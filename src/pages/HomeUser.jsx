import React from 'react'
import { useEffect, useState } from 'react'
import { Layout, Row, Col, Typography } from 'antd'

import { eduAPI } from '../services'

import { UserLayout } from '../components/layouts/UserLayout'
import { CardSlider } from '../components/ui/user/CardSlider'

export const HomeUser = () => {
    const [videos, setVideos] = useState([])
    const [clases, setClases] = useState([])
    const { Title } = Typography;
    const { Content } = Layout
    
    const getAllVideos = async () => {
        try{
            const { data } = await eduAPI.get(`/video/video`)      
            if(data.success){
                setVideos(data.video)
            }
        }catch (error){
            console.log( error )
        }
    }
    const getAllClases = async () => {
        try{
            const { data } = await eduAPI.get(`/clase/clase`)      
            if(data.success){
                setClases(data.clase)
            }
        }catch (error){
            console.log( error )
        }
    }

    useEffect(() => {
        getAllVideos()
        getAllClases()
    }, [])

    return(
        <UserLayout>
            <Content
            className='fondo'
            style={{
                height: '100%',
                minHeight: '84vh',
                lineHeight: '100vh',
                textAlign: 'center'
            }}
            >
                <>
                    <Col gutter={24}>
                        <Row>
                            <Title 
                                level={2}
                                style={{ marginLeft: '5vh', marginTop: '5vh' }}
                            > 
                            Videos 
                            </Title>
                        </Row>
                        <Row>
                            <Col span={22} offset={1}>
                                <CardSlider products={videos} />
                            </Col>
                        </Row>
                        <Row>
                            <Title 
                                level={2}
                                style={{ marginLeft: '5vh', marginTop: '5vh' }}
                            > 
                            Clases 
                            </Title>
                        </Row>
                        <Row>
                            <Col span={22} offset={1}>
                                <CardSlider products={clases} />
                            </Col>
                        </Row>
                    </Col>
                </>
            </Content>
        </UserLayout>
    )
}