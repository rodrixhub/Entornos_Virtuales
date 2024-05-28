import React, { useState, useEffect, useRef } from 'react';
import { Layout, Typography, Button, Form, Modal, message, Card, Checkbox } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { UserLayout } from '../components/layouts/UserLayout';
import { useParams } from 'react-router-dom';
import { eduAPI } from '../services';

const ResolveQuestionnaireModal = ({ visible, onCancel, onSubmit, question, form, handleAnswerChange }) => (
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

    const getVideo = async () => {
        try {
            const { data } = await eduAPI.get(`/video/video/${id}`);
            if (data.success) {
                setVideo(data.video);
                setQuestions(data.video.preguntas || []);
                console.log(data.video)
                console.log(data.video.preguntas)
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getVideo();
    }, []);

    // useEffect para añadir y remover el event listener del video
    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('timeupdate', handleTimeUpdate);
            console.log('Event listener added');
        }
        return () => {
            if (videoElement) {
                videoElement.removeEventListener('timeupdate', handleTimeUpdate);
                console.log('Event listener removed');
            }
        };
    }, [video, questions]);
    
    // Función que pausa el video cuando se alcanza el tiempo de pausa
    const handleTimeUpdate = () => {
        const videoElement = videoRef.current;
        if (videoElement) {
            console.log(`Current time: ${videoElement.currentTime}`);
            questions.forEach(question => {
                const questionTime = parseFloat(question.time);
                if (videoElement.currentTime >= questionTime && videoElement.currentTime < questionTime + 0.3) {
                    videoElement.pause();
                    console.log(`Video paused at ${questionTime} seconds for question: ${question.questionText}`);
                    setCurrentQuestion(question);
                    setIsResolveModalVisible(true);
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
            if (question.options && question.options.length > 0) {
                const correctAnswers = question.options.filter(option => option.isCorrect).map(option => option.text);
                const selectedAnswer = selectedAnswers[question._id] || [];
                const isCorrect = correctAnswers.length === selectedAnswer.length && correctAnswers.every(answer => selectedAnswer.includes(answer));
                message.open({
                    content: (
                        <span>
                            {isCorrect ? <CheckCircleFilled style={{ color: 'green', marginRight: '8px'}} /> : <CloseCircleFilled style={{ color: 'red', marginRight: '8px' }} />}
                            {isCorrect ? "Correcto" : "Incorrecto"}
                        </span>
                    ),
                    duration: 2,
                });
            }
        }
        setIsResolveModalVisible(false);
        setCurrentQuestion(null);
        form.resetFields();
    };    

    // Función para cerrar el modal de resolver cuestionario y resetear el formulario
    const handleResolveCancel = () => {
        setIsResolveModalVisible(false);
        setCurrentQuestion(null);
        form.resetFields();
    };

    return (
        <UserLayout>
            <Content
                className='fondo'
                style={{
                    height: '100%',
                    minHeight: '84vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px'
                }}
            >
                <div style={{ display: 'flex', backgroundColor: '#e0e0e0', padding: '20px', borderRadius: '10px', maxWidth: '620px', width: '100%' }}>
                    {video ? (
                        <Card className="video-section" style={{ flex: 3, backgroundColor: '#fff', borderRadius: '10px' }}>
                            <video ref={videoRef} style={{ width: '100%', height: 'auto' }} controls>
                                <source src={`http://localhost:8080/${video.videoPath}`} type="video/mp4" />
                                Tu navegador no soporta el elemento de video.
                            </video>
                        </Card>
                    ) : (
                        <Typography.Text>Loading...</Typography.Text>
                    )}
                </div>
                <ResolveQuestionnaireModal
                    visible={isResolveModalVisible}
                    onCancel={handleResolveCancel}
                    onSubmit={handleResolveFormSubmit}
                    question={currentQuestion}
                    form={form}
                    handleAnswerChange={handleAnswerChange}
                />
            </Content>
        </UserLayout>
    );
}

export default ReproducirUsuario;
