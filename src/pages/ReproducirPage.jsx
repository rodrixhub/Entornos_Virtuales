import React, { useState, useEffect, useRef } from 'react';
import { Layout, Typography, Button, Form, Input, Select, Space, Modal, message, Radio } from 'antd';
import { UserLayout } from '../components/layouts/UserLayout';
import { useParams } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { eduAPI } from '../services';

const { Content } = Layout;
const { Option } = Select;

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
                <Form.List name={[name, 'answers']}>
                    {(answerFields, { add: addAnswer, remove: removeAnswer }) => (
                        <>
                            {answerFields.map(({ key: answerKey, name: answerName, fieldKey: answerFieldKey, ...answerRestField }, answerIndex) => (
                                <Space key={answerKey} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
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
                                    <Button type="link" onClick={() => remove(answerName)}>Eliminar</Button>
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
                answers: [{ answer: '', isCorrect: 'false' }, { answer: '', isCorrect: 'false' }]
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
                    <div key={question._id} style={{ marginBottom: 16 }}>
                        <Typography.Text>{question.questionText}</Typography.Text>
                        <Form.Item
                            name={`question_${question._id}`}
                            rules={[{ required: true, message: 'Por favor seleccione una respuesta' }]}
                        >
                            <Radio.Group onChange={e => handleAnswerChange(question._id, e.target.value)}>
                                {question.options.map((option, optionIndex) => (
                                    <Radio key={`${question._id}-${optionIndex}`} value={option.text}>
                                        {option.text}
                                    </Radio>
                                ))}
                            </Radio.Group>
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
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    Enviar Respuestas
                </Button>
            </Form.Item>
        </Form>
    </Modal>
);


export const ReproducirPage = () => {
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

    // useEffect para obtener el video cuando el id cambia
    useEffect(() => {
        getVideo();
    }, []);

    // Función que pausa el video cuando se alcanza el tiempo de pausa
    const handleTimeUpdate = () => {
        const videoElement = videoRef.current;
        if (videoElement && videoElement.currentTime >= pauseTime) {
            videoElement.pause();
        }
    };

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
                    answers: [{ answer: '', isCorrect: 'false' }, { answer: '', isCorrect: 'false' }],
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
            const newQuestions = values.questions.map(question => ({
                questionText: question.questionText,
                options: question.answers.filter(answer => answer.answer !== '').map(answer => ({
                    text: answer.answer,
                    isCorrect: answer.isCorrect === "true"
                }))
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
                const correctAnswer = question.options.find(option => option.isCorrect === true);
                if (correctAnswer) {
                    const selectedAnswer = selectedAnswers[question._id];
                    results[question._id] = selectedAnswer === correctAnswer.text;
                } else {
                    results[question._id] = false; // No hay respuesta correcta configurada
                }
            } else {
                results[question._id] = false; // No hay opciones configuradas
            }
        });
        setResults(results);
        message.success("Cuestionario resuelto exitosamente");
    };

    // Función para manejar el cambio de respuesta seleccionada
    const handleAnswerChange = (questionId, answerText) => {
        setSelectedAnswers(prev => ({ ...prev, [questionId]: answerText }));
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
                {video ? (
                    <div key={video._id} className="video-card" style={{ textAlign: 'center', width: '100%', maxWidth: '600px' }}>
                        <video ref={videoRef} style={{ width: '100%', height: 'auto' }} controls>
                            <source src={`http://localhost:8080/${video.videoPath}`} type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>
                ) : (
                    <Typography.Text>Loading...</Typography.Text>
                )}
                <Button type="primary" onClick={showAddModal} style={{ marginTop: '20px' }}>
                    Añadir Cuestionario
                </Button>
                <Button type="primary" onClick={showResolveModal} style={{ marginTop: '10px' }}>
                    Resolver Cuestionario
                </Button>
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
