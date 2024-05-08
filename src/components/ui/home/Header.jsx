import React from 'react'
import { Layout, Button, Row, Col  } from 'antd';
import { HomeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';

export const Header = () => {

    const { Header } = Layout

    return(
        <Header className="header">
            <Row justify={"space-between"} align="middle">
                <Col>
                    <div className="logo">
                        <Link to={'/'} >
                            <HomeOutlined style={{ fontSize: '30px' }} />    
                        </Link>
                    </div>
                </Col>
                <Col>
                    <Link to={'/user'}>
                        <Button type= 'primary'> Iniciar Sesion </Button>
                    </Link>
                </Col>
            </Row>
        </Header>
    )
}