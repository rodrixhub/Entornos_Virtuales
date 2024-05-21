import React from 'react'
import { Avatar, Dropdown, Layout, Row, Col } from 'antd'
import { FolderOutlined, CloudUploadOutlined, UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'

import { SearchBar } from './SearchBar'

export const Header = () => {

    const { Header } = Layout
    const navigate = useNavigate()

    const handleMenuClick = (e) => {
      switch (e.key) {
        case '1':
          navigate('/perfil')
          break
        case '2':
          navigate('/UploadPage')
          break
        case '3':
          navigate('/BibliotecaPage')
          break
        case '4':
          navigate('/')
          break
        default:
          break
      }
    }

    const items = [
      {
        label: 'Perfil',
        key: '1',
        icon: <UserOutlined />
      },
      {
        label: 'Subir Video',
        key: '2',
        icon: <CloudUploadOutlined />
      },
      {
        label: 'Biblioteca',
        key: '3',
        icon: <FolderOutlined />
      },
      {
        label: 'Cerrar Sesion',
        key: '4',
        icon: <LogoutOutlined />
      }
    ]

    const menuProps = {
      items,
      onClick: handleMenuClick
    }

    return(
        <Header className="header">
            <Row justify={"space-between"} align="middle">
                <Col className="logo">
                    <Link to={'/'} >
                        <HomeOutlined style={{ fontSize: '30px' }} />    
                    </Link>
                </Col>
                <Col className='SearchBar'>
                    <SearchBar />
                </Col>
                <Col className='Dropdown'>
                    <Dropdown menu={menuProps} trigger={['click']}>
                      <Avatar 
                        size="large"
                        icon={<UserOutlined />} 
                        style={{
                            backgroundColor: 'red'
                        }}
                      />
                    </Dropdown>
                </Col>
            </Row>
        </Header>
    )
}