import React from 'react'
import { Avatar, Menu, Dropdown, Layout, Row, Col } from 'antd'
import { FolderOutlined, CloudUploadOutlined, UserOutlined, SettingOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

import { SearchBar } from './SearchBar'

export const Header = () => {

    const { Header } = Layout

    const menu = (
        <Menu>
          <Menu.Item key="1" icon={<UserOutlined />}>
            Perfil
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="2" icon={<CloudUploadOutlined />}>
            Subir Video
          </Menu.Item>
          <Menu.Item key="3" icon={<FolderOutlined />}>
            Biblioteca
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="4" icon={<SettingOutlined />}>
            Configuración
          </Menu.Item>
          
          <Menu.Item key="5" icon={<LogoutOutlined />}>
            <Link to={'/'}> Cerrar sesión </Link>
          </Menu.Item>
        </Menu>
    )

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
                    <Dropdown overlay={menu} trigger={['click']}>
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