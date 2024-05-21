import React from 'react'
import { useEffect, useState } from 'react'
import { Layout, Row, Col, Typography } from 'antd'
import { UserLayout } from '../components/layouts/UserLayout'
import { useParams } from 'react-router-dom'

import { eduAPI } from '../services'

export const ReproducirPage = () => {
    const { Content } = Layout

    const { id } = useParams()
    const [videos, setVideos] = useState([])

    const getVideo = async () => {
        try{
            const { data } = await eduAPI.get(`/video/video/${id}`)  
            if(data.success){ 
                setVideos(data.video)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getVideo()
    }, [])
    console.log(videos)
  return (
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
                <div key={videos._id} className="video-card" style={{ padding: '20px', textAlign: 'center' }}>
                    <h1>Reproducir Video</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
                    <video style={{ width: '400px', height: 'auto' }} controls>
                        <source src={`http://localhost:8080/${videos.videoPath}`} type="video/mp4"/>
                        Tu navegador no soporta el elemento de video.
                    </video>
                    </div>
                </div>
        </Content>
    </UserLayout>
  );
}

export default ReproducirPage;