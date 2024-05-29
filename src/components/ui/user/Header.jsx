import React from 'react';
import { Avatar, Dropdown, Layout, Row, Col } from 'antd';
import { FolderOutlined, CloudUploadOutlined, UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

import { SearchBar } from './SearchBar';

export const Header = () => {
  const { Header } = Layout
  const navigate = useNavigate()

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

  //Funcion para redirigir a la pagina que se desea
  const handleMenuClick = (e) => {
    const item = items.find((item) => item.key === e.key);
    if (item && !item.disabled && item.path) {
      navigate(item.path);
    }
  }

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