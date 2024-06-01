import React from 'react';
import { useEffect, useState } from 'react'
import { Avatar, Dropdown, Layout, Row, Col, Typography  } from 'antd';
import { FolderOutlined, CloudUploadOutlined, UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

import { SearchBar } from './SearchBar';
import { eduAPI } from '../../../services'

export const Header = () => {
  const { Header } = Layout
  const { Text } = Typography;
  const navigate = useNavigate()
  const [user, setUser] = useState(null);

  const items = [
    {
      label: 'Perfil',
      key: '1',
      path: '/',
      icon: <UserOutlined />,
    },
    {
      label: 'Subir Video',
      key: '2',
      path: '/user/UploadPage',
      icon: <CloudUploadOutlined />,
    },
    {
      label: 'Biblioteca',
      key: '3',
      path: '/user/BibliotecaPage',
      icon: <FolderOutlined />,
    },
    {
      label: 'Cerrar Sesion',
      key: '4',
      path: '/',
      icon: <LogoutOutlined />,
    }
  ]

  const handleMenuClick = (e) => {
    const item = items.find((item) => item.key === e.key);
    if (item) {
      if (item.key === '4') {
        // Eliminar el usuario del localStorage
        localStorage.removeItem('user');
        // Puedes hacer cualquier otro manejo adicional aquí si es necesario
      }
      if (!item.disabled && item.path) {
        navigate(item.path);
      }
    }
  };

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
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      getUser(userData.userId);
    }
  }, []);
  return (
    <Header className="header">
      <Row justify="space-between" align="middle">
        <Col className="logo">
          <Link to="/user">
            <HomeOutlined style={{ fontSize: '30px' }} />
          </Link>
        </Col>
        <Col className="SearchBar">
          <SearchBar />
        </Col>
        <Col className="Dropdown">
          {user ? (
            <Text style={{ color: 'white', marginRight: '10px' }}>
              {`Hola, ${user.name}`}
            </Text>
          ) : (
            <Text style={{ color: 'white', marginRight: '10px' }}>
              Cargando...
            </Text>
          )}
          <Dropdown menu={{items, onClick: handleMenuClick,}} trigger={['click']}>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ backgroundColor: 'red' }}
            />
          </Dropdown>
        </Col>
      </Row>
    </Header>
  )
}