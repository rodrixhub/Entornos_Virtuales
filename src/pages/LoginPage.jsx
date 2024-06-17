import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import { HomeLayout } from '../components/layouts/HomeLayout';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/login-user', { email: values.email });
      setResponseMessage(response.data.message);
      if (response.data.success) {
        message.success('Login successful');
        // Guardar el userId en el localStorage
        localStorage.setItem('user', JSON.stringify({ userId: response.data.userId }));
        // Redirigir al usuario a la página principal o a la que desees
        navigate('/user');
      } else {
        message.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setResponseMessage('Error logging in');
      message.error('Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <HomeLayout>
      <div className="login-container" style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>

        <h2>Iniciar sesion</h2>

        <Form
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
        >
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

              Ingresar

            </Button>
          </Form.Item>
        </Form>
        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </HomeLayout>
  );
};

export default LoginPage;
