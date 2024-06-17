import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Layout, Typography, Button, Form, Input, Select, Space, Modal, message, Card, Divider, Badge, Checkbox } from 'antd';
import { UserLayout } from '../components/layouts/UserLayout';
import { useParams } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { eduAPI } from '../services';
import { saveAs } from 'file-saver';

// Componente para renderizar las preguntas y respuestas del formulario
const QuestionFormItems = ({ fields, add, remove }) => (
    <>
        {fields.map(({ key, name, fieldKey, ...restField }, index) => (
            <Space key={key} direction="vertical" style={{ width: '100%' }}>
                <Form.Item
                    {...restField}
                    name={[name, 'questionText']}
                    fieldKey={[fieldKey, 'questionText']}
                    label={`Pregunta ${index + 1}`}
                    rules={[{ required: true, message: 'Por favor ingrese la pregunta' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    {...restField}
                    name={[name, 'intentosPermitidos']}
                    fieldKey={[fieldKey, 'intentosPermitidos']}
                    label={`Intentos Permitidos`}
                >
                    <Input placeholder="Número de intentos permitidos" />
                </Form.Item>
                <Form.Item
                    {...restField}
                    name={[name, 'pista']}
                    fieldKey={[fieldKey, 'pista']}
                    label={`Pista de la pregunta ${index + 1}`}
                >
                    <Input placeholder="Pista (opcional)" />
                </Form.Item>
                <Form.List name={[name, 'answers']}>
                    {(answerFields, { add: addAnswer, remove: removeAnswer }) => (
                        <>
                            {answerFields.map(({ key: answerKey, name: answerName, fieldKey: answerFieldKey, ...answerRestField }, answerIndex) => (
                                <Space key={answerKey} align="baseline" style={{ display: 'flex' }}>
                                    <Form.Item
                                        {...answerRestField}
                                        name={[answerName, 'answer']}
                                        fieldKey={[answerFieldKey, 'answer']}
                                        rules={[{ required: true, message: 'Por favor ingrese una respuesta' }]}
                                    >
                                        <Input placeholder={`Respuesta ${answerIndex + 1}`} />
                                    </Form.Item>
                                    <Form.Item
                                        {...answerRestField}
                                        name={[answerName, 'isCorrect']}
                                        fieldKey={[answerFieldKey, 'isCorrect']}
                                        rules={[{ required: true, message: 'Por favor seleccione si la respuesta es correcta' }]}
                                    >
                                        <Select placeholder="Correcta">
                                            <Option value="true">Correcto</Option>
                                            <Option value="false">Incorrecto</Option>
                                        </Select>
                                    </Form.Item>
                                    <Button type="link" onClick={() => removeAnswer(answerName)}>Eliminar</Button>
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => addAnswer()} block icon={<PlusOutlined />}>
                                    Añadir Respuesta
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Button type="link" onClick={() => remove(name)}>Eliminar Pregunta</Button>
                <hr />
            </Space>
        ))}
        <Form.Item>
            <Button type="dashed" onClick={() => add({
                questionText: '',
                intentosPermitidos: 1, // Inicializar intentosPermitidos con valor predeterminado
                pista: '', // Inicializar el campo pista
                answers: [] // Inicializar sin respuestas
            })} block icon={<PlusOutlined />}>
                Añadir Pregunta
            </Button>
        </Form.Item>
    </>
);

// Componente Modal para añadir cuestionarios
const AddQuestionnaireModal = ({ visible, onCancel, onSubmit, form }) => (
    <Modal title="Añadir Cuestionario" visible={visible} onCancel={onCancel} footer={null}>
        <Form
            form={form}
            name="questionnaire"
            layout="vertical"
            onFinish={onSubmit}
        >
            <Form.List name="questions">
                {(fields, { add, remove }) => (
                    <QuestionFormItems fields={fields} add={add} remove={remove} />
                )}
            </Form.List>
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    Guardar Cuestionario
                </Button>
            </Form.Item>
        </Form>
    </Modal>
);

// Componente Modal para resolver cuestionarios
const ResolveQuestionnaireModal = ({ visible, onCancel, onSubmit, questions, form, selectedAnswers, handleAnswerChange, results }) => (
    <Modal title="Resolver Cuestionario" visible={visible} onCancel={onCancel} footer={null}>
        <Form
            form={form}
            name="resolveQuestionnaire"
            layout="vertical"
            onFinish={onSubmit}
        >
            {questions.length > 0 ? (
                questions.map((question, index) => (
                    <div key={question._id}>
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
                        {results[question._id] !== undefined && (
                            <Typography.Text type={results[question._id] ? "success" : "danger"}>
                                {results[question._id] ? "Correcto" : "Incorrecto"}
                            </Typography.Text>
                        )}
                    </div>
                ))
            ) : (
                <Typography.Text>No hay preguntas disponibles para este video.</Typography.Text>
            )}
            <Form.Item>
                <Divider />
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    Enviar Respuestas
                </Button>
            </Form.Item>
        </Form>
    </Modal>
);

export const ReproducirPage = () => {
    const { Content } = Layout;

    const { id } = useParams();
    const [video, setVideo] = useState(null);
    //Modals
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isResolveModalVisible, setIsResolveModalVisible] = useState(false);
    //Funcion de pausar video
    const videoRef = useRef(null);
    const [pauseTime, setPauseTime] = useState(10);
    //Para resolver cuestionario
    const [form] = Form.useForm();
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [results, setResults] = useState({});
    const [questions, setQuestions] = useState([]);

    // Función para obtener los datos del video desde el servidor
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

    // Función que pausa el video cuando se alcanza el tiempo de pausa
    const handleTimeUpdate = () => {
        const videoElement = videoRef.current;
        if (videoElement && videoElement.currentTime >= pauseTime) {
            videoElement.pause(); 
        }
    };

    // useEffect para obtener el video cuando el id cambia
    useEffect(() => {
        getVideo();
    }, []);
     
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
    }, [pauseTime]);

    // Función para mostrar el modal de añadir cuestionario
    const showAddModal = () => {
        setIsAddModalVisible(true);
        form.setFieldsValue({
            questions: [
                {
                    questionText: '',
                    answers: [] // Inicializar sin respuestas
                },
            ],
        });
    };

    // Función para cerrar el modal de añadir cuestionario
    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    // Función para mostrar el modal de resolver cuestionario
    const showResolveModal = () => {
        setIsResolveModalVisible(true);
        setSelectedAnswers({});
        setResults({});
    };

    // Función para cerrar el modal de resolver cuestionario y resetear el formulario
    const handleResolveCancel = () => {
        setIsResolveModalVisible(false);
        form.resetFields();
        setSelectedAnswers({});
        setResults({});
    };

    // Función para manejar el envío del formulario de añadir cuestionario
    const handleAddFormSubmit = async (values) => {
        try {
            // Obtener el tiempo actual del video
            const videoTime = videoRef.current ? videoRef.current.currentTime : 0;
    
            // Log para verificar el tiempo del video
            console.log('Tiempo actual del video:', videoTime);
    
            // Construir las nuevas preguntas
            const newQuestions = values.questions.map(question => ({
                questionText: question.questionText,
                pista: question.pista || '', // Aquí se añade el campo pista
                intentosPermitidos: question.intentosPermitidos || 1, // Asegurar valor predeterminado de 1
                options: question.answers.filter(answer => answer.answer !== '').map(answer => ({
                    text: answer.answer,
                    isCorrect: answer.isCorrect === "true"
                })),
                time: videoTime.toString() // Añadir el tiempo del video a cada pregunta, convertir a string
            }));
    
            const updatedVideo = { _id: video._id, preguntas: newQuestions };
            const response = await eduAPI.put('/video/updatePreguntaVideo', updatedVideo);
    
            if (response.data.success) {
                message.success("Cuestionario registrado exitosamente");
                setQuestions([...questions, ...newQuestions]);
            } else {
                message.error("Error al registrar el cuestionario");
            }
        } catch (error) {
            message.error("Error en la solicitud al servidor");
            console.error(error);
        } finally {
            setIsAddModalVisible(false);
        }
    };           

    // Función para manejar el envío del formulario de resolver cuestionario
    const handleResolveFormSubmit = async () => {
        const results = {};
        questions.forEach(question => {
            if (question.options && question.options.length > 0) {
                const correctAnswers = question.options.filter(option => option.isCorrect).map(option => option.text);
                const selectedAnswer = selectedAnswers[question._id] || [];
                results[question._id] = correctAnswers.length === selectedAnswer.length && correctAnswers.every(answer => selectedAnswer.includes(answer));
            } else {
                results[question._id] = false; // No hay opciones configuradas
            }
        });
        setResults(results);
        message.success("Cuestionario resuelto exitosamente");
    };        

    // Función para manejar el cambio de respuesta seleccionada
    const handleAnswerChange = (questionId, checkedValues) => {
        setSelectedAnswers(prev => ({ ...prev, [questionId]: checkedValues }));
    };

    //Cambiar el formato de tiempo
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };      

    const handleExportScorm = async () => {
        try {
            const response = await eduAPI.get(`/scorm/export/${id}`, { responseType: 'blob' });
            if (response.data) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'scorm_export.zip');
                document.body.appendChild(link);
                link.click();
                link.remove();
                message.success("SCORM exportado exitosamente");
            } else {
                message.error("Error al exportar SCORM");
            }
        } catch (error) {
            message.error("Error en la solicitud al servidor");
            console.error(error);
        }
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
                <div style={{ display: 'flex', backgroundColor: '#e0e0e0', padding: '20px', borderRadius: '10px', maxWidth: '1200px', width: '100%' }}>                
                    {video ? (
                        <Card className="video-section" style={{ flex: 3, backgroundColor: '#fff', padding: '10px', borderRadius: '10px', marginRight: '20px' }}>
                            <video ref={videoRef} style={{ width: '100%', height: 'auto' }} controls>
                                <source src={`http://localhost:8080/${video.videoPath}`} type="video/mp4" />
                            </video>
                            <Divider />
                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Button type="primary" onClick={showAddModal}>
                                    Añadir Cuestionario
                                </Button>
                                <Button type="primary" onClick={showResolveModal}>
                                    Resolver Cuestionario
                                </Button>
                                <Button type="primary" onClick={handleExportScorm}>
                                    Exportar Scorm
                                </Button>
                            </Space>
                        </Card>
                    ) : (
                        <Typography.Text>Loading...</Typography.Text>
                    )}
                    <Card className="questions-section" style={{ flex: 2, backgroundColor: '#fff', padding: '20px', borderRadius: '10px', overflowY: 'auto', maxHeight: '500px' }}>
                        {questions.map((question, index) => (
                            <div key={question._id} className="question-item" style={{ marginBottom: '20px' }}>
                                <Typography.Paragraph className="question-time" style={{ fontWeight: 'bold', color: '#888' }}>
                                    Tiempo: {formatTime(question.time)} {/* Cambiado para usar la función de formato */}
                                </Typography.Paragraph>
                                <Typography.Paragraph>{question.questionText}</Typography.Paragraph>
                                <Typography.Paragraph style={{ color: '#888' }}>
                                    Intentos Permitidos: {question.intentosPermitidos}
                                </Typography.Paragraph>
                                {question.pista && (
                                    <Typography.Paragraph style={{ fontStyle: 'italic', color: '#888' }}>
                                        Pista: {question.pista}
                                    </Typography.Paragraph>
                                )}
                                <ul>
                                    {question.options.map((option, idx) => (
                                        <li key={`${question._id}-${idx}`} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Badge color={option.isCorrect ? 'green' : 'red'} />
                                            <span style={{ marginLeft: 8 }}>{option.text}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Divider />
                            </div>
                        ))}
                    </Card>
                </div>
                <AddQuestionnaireModal
                    visible={isAddModalVisible}
                    onCancel={handleAddCancel}
                    onSubmit={handleAddFormSubmit}
                    form={form}
                />
                <ResolveQuestionnaireModal
                    visible={isResolveModalVisible}
                    onCancel={handleResolveCancel}
                    onSubmit={handleResolveFormSubmit}
                    questions={questions}
                    form={form}
                    selectedAnswers={selectedAnswers}
                    handleAnswerChange={handleAnswerChange}
                    results={results}
                />
            </Content>
        </UserLayout>
    );
}

export default ReproducirPage;
