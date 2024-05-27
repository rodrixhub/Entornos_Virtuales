import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Form, Radio, Modal, message } from 'antd';
import { UserLayout } from '../components/layouts/UserLayout';
import { useParams } from 'react-router-dom';
import { eduAPI } from '../services';

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

export const ReproducirUsuario = () => {
    const { Content } = Layout;
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    //Modal de resolver cuestionario
    const [isResolveModalVisible, setIsResolveModalVisible] = useState(false);
    //constantes para el resolver cuestionario
    const [form] = Form.useForm();
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [results, setResults] = useState({});

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

    useEffect(() => {
        getVideo();
    }, []);

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
    /*const showResolveModal = () => {
        setIsResolveModalVisible(true);
    };

    const handleResolveCancel = () => {
        setIsResolveModalVisible(false);
    };

    const handleResolveFormSubmit = async (values) => {
        try {
            message.success("Cuestionario resuelto exitosamente");
        } catch (error) {
            message.error("Error en la solicitud al servidor");
            console.error(error);
        } finally {
            setIsResolveModalVisible(false);
        }
    };*/

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
                        <video style={{ width: '100%', height: 'auto' }} controls>
                            <source src={`http://localhost:8080/${video.videoPath}`} type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>
                ) : (
                    <Typography.Text>Loading...</Typography.Text>
                )}
                <Button type="primary" onClick={showResolveModal} style={{ marginTop: '10px' }}>
                    Resolver Cuestionario
                </Button>
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

export default ReproducirUsuario;
