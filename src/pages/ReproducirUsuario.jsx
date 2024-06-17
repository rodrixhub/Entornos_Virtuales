import React, { useState, useEffect, useRef } from 'react';
import { Layout, Typography, Button, Form, Modal, message, Card, Checkbox, Badge, Divider  } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { UserLayout } from '../components/layouts/UserLayout';
import { useParams } from 'react-router-dom';
import { eduAPI } from '../services';

const ResolveQuestionnaireModal = ({ visible, onCancel, onSubmit, question, form, handleAnswerChange, intentosActuales }) => (
    <Modal title="Resolver Cuestionario" visible={visible} onCancel={onCancel} footer={null}>
        <Form
            form={form}
            name="resolveQuestionnaire"
            layout="vertical"
            onFinish={onSubmit}
        >
            {question ? (
                <div key={question._id} style={{ marginBottom: 16 }}>
                    <Typography.Text>{question.questionText}</Typography.Text>
                    {intentosActuales >= 1 && question.pista && (
                        <Typography.Text style={{ display: 'block', margin: '8px 0', color: 'grey' }}>
                            Pista: {question.pista}
                        </Typography.Text>
                    )}
                    <Form.Item
                        name={`question_${question._id}`}
                        rules={[{ required: true, message: 'Por favor seleccione una respuesta' }]}
                    >
                        <Checkbox.Group onChange={checkedValues => handleAnswerChange(question._id, checkedValues)}>
                            {question.options.map((option, optionIndex) => (
                                <Checkbox key={`${question._id}-${optionIndex}`} value={option.text}>
                                    {option.text}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>
                </div>
            ) : (
                <Typography.Text>No hay preguntas disponibles para este tiempo.</Typography.Text>
            )}
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    Enviar Respuestas
                </Button>
            </Form.Item>
        </Form>
    </Modal>
);

export const ReproducirUsuario = () => {
    const { Content } = Layout;
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [questions, setQuestions] = useState([]);
    //Funcion de pausar video
    const videoRef = useRef(null);
    // Estado del modal y la pregunta actual
    const [isResolveModalVisible, setIsResolveModalVisible] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [form] = Form.useForm();
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [user, setUser] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getUser = async (userId) => {
        try {
            const { data } = await eduAPI.get(`/get-user-id/${userId}`);
            if (data.success) {
                setUser(data.user);
            }
        } catch (error) {
        console.log('Error fetching user data:', error);
        }
    };

    const getVideo = async () => {
        try {
            const { data } = await eduAPI.get(`/video/video/${id}`);
            if (data.success) {
                setVideo(data.video);
                setQuestions(data.video.preguntas || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAttemptForQuestions = async () => {
        if (!user || questions.length === 0) {
            console.log('User or questions are not defined');
            return;
        }
    
        try {
            const attemptPromises = questions.map(async (question) => {
                const payload = {
                    userId: user._id,
                    questionId: question._id
                };
                console.log("User ID: ", user._id);
                console.log("Question ID: ", question._id);
                let attemptResult = null;
                try {
                    const { data } = await eduAPI.post('/attempt/Attemptuser', payload);
                    if (data.success) {
                        attemptResult = data.attempt;
                    }
                } catch (error) {
                    console.error('Error fetching attempt:', error);
                }
    
                if (!attemptResult) {
                    const createPayload = {
                        userId: user._id,
                        questionId: question._id
                    };
                    console.log("Creating Attempt with payload: ", createPayload);
                    try {
                        const { data } = await eduAPI.post('/attempt/register', createPayload);
                        if (data.success) {
                            attemptResult = data.attempt;
                        }
                    } catch (error) {
                        console.error('Error creating attempt:', error);
                    }
                }
    
                return attemptResult;
            });
    
            const fetchedAttempts = await Promise.all(attemptPromises);
            setAttempts(fetchedAttempts.filter(attemptResult => attemptResult !== null));
        } catch (error) {
            console.error('Error fetching or creating attempts:', error);
        }
    };           

    //useEffect para obtener los datos de usuario y video
    /*useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            getUser(userData.userId);
        }
        getVideo();

        // Ahora puedes llamar a getAttempt después de que se hayan resuelto getUser y getVideo
        getAttemptForQuestions();
    }, []);*/
    useEffect(() => {
        const fetchData = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                await getUser(userData.userId);
                await getVideo();
                setLoading(false);  // Set loading to false after data is fetched
            }
        };
    
        fetchData();
    }, []);
    
    useEffect(() => {
        console.log(loading)
        if (!loading) {
            getAttemptForQuestions();
        }
    }, [loading, video, questions]);
    
    // useEffect para añadir y remover el event listener del video
    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('timeupdate', handleTimeUpdate);
        }
        return () => {
            if (videoElement) {
                videoElement.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, [video, questions, attempts ]);
    
    // Función que pausa el video cuando se alcanza el tiempo de pausa
    const handleTimeUpdate = () => {
        const videoElement = videoRef.current;
        if (videoElement) {
            questions.forEach((question) => {
                const questionTime = parseFloat(question.time);
                const attempt = attempts.find(attempt => attempt.questionId === question._id);
                const intentosRestantes = question.intentosPermitidos - (attempt ? attempt.intentosActuales : 0);
                if (videoElement.currentTime >= questionTime && videoElement.currentTime < questionTime + 0.3) {
                    if (intentosRestantes <= 0) {
                        message.warning("Ya no puedes resolver esta pregunta porque has alcanzado el límite de intentos.");
                        setIsResolveModalVisible(false);
                    } else if (intentosRestantes > 0) {
                        videoElement.pause();
                        setCurrentQuestion(question);
                        setIsResolveModalVisible(true);
                    }
                }
            });
        } else {
            console.log('Video element is not defined in handleTimeUpdate');
        }
    };

    // Función para manejar el cambio de respuesta seleccionada
    const handleAnswerChange = (questionId, checkedValues) => {
        setSelectedAnswers(prev => ({ ...prev, [questionId]: checkedValues }));
    };
    
    // Función para manejar el envío del formulario de resolver cuestionario
    const handleResolveFormSubmit = async () => {
        const question = currentQuestion;
        if (question) {
            const attempt = attempts.find(attempt => attempt.questionId === question._id);
            const selectedAnswer = selectedAnswers[question._id] || [];
    
            // Verificar si la respuesta es correcta o incorrecta
            let resultado = "Incorrecto";
            if (question.options && question.options.length > 0) {
                const correctAnswers = question.options.filter(option => option.isCorrect).map(option => option.text);
                const isCorrect = correctAnswers.length === selectedAnswer.length && correctAnswers.every(answer => selectedAnswer.includes(answer));
                resultado = isCorrect ? "Correcto" : "Incorrecto";
                message.open({
                    content: (
                        <span>
                            {isCorrect ? <CheckCircleFilled style={{ color: 'green', marginRight: '8px' }} /> : <CloseCircleFilled style={{ color: 'red', marginRight: '8px' }} />}
                            {isCorrect ? "Correcto" : "Incorrecto"}
                        </span>
                    ),
                    duration: 2,
                });
            }
    
            // Incluir "Correcto" o "Incorrecto" en respuestasSeleccionadas
            const respuestaSeleccionada = resultado;
    
            await updateAttempt(attempt._id, respuestaSeleccionada);
        }
        setIsResolveModalVisible(false);
        setCurrentQuestion(null);
        form.resetFields();
    };                

    const updateAttempt = async (attemptId, respuestaSeleccionada) => {
        const attempt = attempts.find(attempt => attempt._id === attemptId);
        const payload = {
            _id: attemptId,
            respuestaSeleccionada,
            intentosActuales: Math.min(attempt.intentosActuales + 1, questions.find(q => q._id === attempt.questionId).intentosPermitidos)
        };
    
        try {
            const { data } = await eduAPI.put('/attempt/AttemptPut', payload);
            if (data.success) {
                console.log('Attempt updated successfully:', data.attempt);
                // Actualizar el estado con los nuevos datos de intento
                setAttempts(prevAttempts => {
                    return prevAttempts.map(attempt => 
                        attempt._id === data.attempt._id ? data.attempt : attempt
                    );
                });
            } else {
                console.error('Failed to update attempt:', data.message);
            }
        } catch (error) {
            console.error('Error updating attempt:', error);
        }
    };       

    // Función para cerrar el modal de resolver cuestionario y resetear el formulario
    const handleResolveCancel = () => {
        setIsResolveModalVisible(false);
        setCurrentQuestion(null);
        form.resetFields();
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <UserLayout>
            <Content
                className='fondo'
                style={{
                    height: '100%',
                    minHeight: '84vh',
                    display: 'flex',
                    flexDirection: 'column', // Cambiado para apilar verticalmente
                    justifyContent: 'center',
                    alignItems: 'center', // Cambiado a 'center' para centrar verticalmente
                    padding: '20px'
                }}
            >
                {video && <Typography.Title level={4} style={{ fontWeight: 'bold' }}>{video.name}</Typography.Title>}
                <div style={{ display: 'flex', backgroundColor: '#e0e0e0', padding: '20px', borderRadius: '10px', maxWidth: '1200px', width: '100%' }}>
                    {video ? (
                        <Card className="video-section" style={{ flex: 3, backgroundColor: '#fff', padding: '10px', borderRadius: '10px', marginRight: '20px' }}>
                            <video ref={videoRef} style={{ width: '100%', height: 'auto' }} controls>
                                <source src={`http://localhost:8080/${video.videoPath}`} type="video/mp4" />
                                Tu navegador no soporta el elemento de video.
                            </video>
                        </Card>
                    ) : (
                        <Typography.Text>Loading...</Typography.Text>
                    )}
                    <Card className="questions-section" style={{ flex: 2, backgroundColor: '#fff', padding: '20px', borderRadius: '10px', overflowY: 'auto', maxHeight: '500px', maxWidth: '300px' }}>
                        {questions.map((question, index) => {
                            const attempt = attempts.find(attempt => attempt.questionId === question._id);
                            const intentosRestantes = question.intentosPermitidos - (attempt ? attempt.intentosActuales : 0);
                            
                            console.log("Intentos permitidos para Pregunta " + (index + 1) + ": " + question.intentosPermitidos);
                            console.log("Intentos actuales para Pregunta " + (index + 1) + ": " + (attempt ? attempt.intentosActuales : 0));
                            console.log("Intentos restantes para Pregunta " + (index + 1) + ": " + intentosRestantes);

                            return (
                                <div key={question._id} className="question-item" style={{ marginBottom: '20px' }}>
                                    <Typography.Paragraph className="question-number" style={{ fontWeight: 'bold', color: '#888' }}>
                                        Pregunta {index + 1}
                                    </Typography.Paragraph>
                                    <Typography.Paragraph className="question-time" style={{ fontWeight: 'bold', color: '#888' }}>
                                        Tiempo: {formatTime(question.time)} {/* Cambiado para usar la función de formato */}
                                    </Typography.Paragraph>
                                    <Typography.Paragraph className="attempts-remaining" style={{ fontWeight: 'bold', color: '#888' }}>
                                        Intentos restantes: {intentosRestantes}
                                    </Typography.Paragraph>
                                    <Divider />
                                </div>
                            );
                        })}
                    </Card>


                </div>
                <ResolveQuestionnaireModal
                    visible={isResolveModalVisible}
                    onCancel={handleResolveCancel}
                    onSubmit={handleResolveFormSubmit}
                    question={currentQuestion}
                    form={form}
                    handleAnswerChange={handleAnswerChange}
                    intentosActuales={attempts.find(attempt => attempt.questionId === currentQuestion?._id)?.intentosActuales || 0}
                />
            </Content>
        </UserLayout>
    );
}

export default ReproducirUsuario;
