import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import { HomeLayout } from '../components/layouts/HomeLayout';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/register-user', values);
      setResponseMessage(response.data.message);
      if (response.data.success) {

        message.success('Registro exitoso');
        // Redirigir al usuario a la página /user después de un registro exitoso
        navigate('/user');
      } else {
        message.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setResponseMessage('Error registering user');
      message.error('Error registering user');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/LoginPage');
  };

  return (
    <HomeLayout>
      <div className="register-container" style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>

        <h2>REGISTRATE</h2>
        <Form
          name="register"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item

            label="Nombre"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item

            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: '10px' }}>

              Registrarse
            </Button>
            <Button type="default" onClick={handleLoginRedirect}>
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>
        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </HomeLayout>
  );
};

export default RegisterPage;
