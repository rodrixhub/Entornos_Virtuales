import React from 'react'
import { useEffect, useState } from 'react'
import { Layout, Row, Col, Typography, Table, Card } from 'antd'
import { UserLayout } from '../components/layouts/UserLayout'
import { useParams } from 'react-router-dom'

import { eduAPI } from '../services'
import videoImagen from '../assets/image.png'

export const ClasePage = () => {
    
    const { Content } = Layout
    const { Title, Text  } = Typography

    const { id } = useParams()
    const [clase, setClase] = useState({})
    const [videos, setVideos] = useState([])

    const getClase = async () => {
        try{
            const { data } = await eduAPI.get(`/clase/clase/${id}`)  
            if(data.success){ 
                setClase(data.clase)
                getVideo(data.clase.videos)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getVideo = async (videoIds) => {
        try {
            if (videoIds) {
                const videoPromises = videoIds.map((id) => eduAPI.get(`/video/video/${id}`));
                const videoResponses = await Promise.all(videoPromises);
                const videoData = videoResponses.map((response, index) => {
                    const video = response.data.video;
                    video.duration = formatoHora(video.duration);
                    video.key = index;
                    return video;
                }); 
                setVideos(videoData);
            }
        } catch (error) {
            console.log(error);
            console.log("error en getvideo")
        }
    }

    const formatoHora = (duration) => {
        // Separar la duración en horas, minutos y segundos
        const [hours, minutes, seconds] = duration.split(':');
        
        // Si la hora es "00" y los minutos son "00", devolver solo los segundos
        if (hours === '00' && minutes === '00') {
            return `${seconds}`;
        }
        // Si la hora es "00" y los minutos no son "00", devolver los minutos y segundos
        else if (hours === '00') {
            return `${minutes}:${seconds}`;
        }
        // Si hay hora, minutos y segundos, devolver todo
        else {
            return `${hours}:${minutes}:${seconds}`;
        }
    }

    useEffect(() => {
        getClase()
    }, [])

    const courseData = {
        title: `Curso: ${clase.name}`,
        description: `${clase.description}`,
        whatYouWillLearn: [
          "Las bases y particularidades de JS.",
          "Escribir código óptimo y reutilizable.",
          "Manipular datos y colecciones de datos.",
          "Aplicar lógica de programación en JS."
        ],
    }

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            render: text => <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', wordBreak: 'break-word', hyphens: 'auto' }}>{text}</div>
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
            render: text => <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', wordBreak: 'break-word', hyphens: 'auto' }}>{text}</div>
        },
        {
            title: 'tipo',
            dataIndex: 'type',
            key: 'type',
            render: text => <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', wordBreak: 'break-word', hyphens: 'auto' }}>{text}</div>
        },
        {
            title: 'duracion',
            dataIndex: 'duration',
            key: 'duration',
            render: text => <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', wordBreak: 'break-word', hyphens: 'auto' }}>{text}</div>
        }
    ];

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
                <Card style={{ background: '#1f1f1f', border: 'none' }}>
                    <Row gutter={16}>
                        <Col span={16}>
                            <Title level={2} style={{ color: 'white'}}>{courseData.title}</Title>
                            <Text style={{ color: 'white' }}>{courseData.description}</Text>
                            <Table style={{ background: '#ffffff', overflowX: 'auto'}} columns={columns} dataSource={videos} pagination={{ pageSize: 6 }} />
                        </Col>
                        <Col span={6}>
                            <img alt="Videos" src={videoImagen} style={{ width: '100%' }}/>
                        </Col>
                    </Row>
                </Card>
            </Content>
        </UserLayout>
    )
}