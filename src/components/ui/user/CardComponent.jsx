import React from 'react'
import { Card } from 'antd'
import { Link } from 'react-router-dom';

export const CardComponent = (props) => {
    const { data: { _id, name, videoPath } } = props;

    return (
        <Link   to={`/user/ReproducirUsuario/${_id}`} 
                style={{ textDecoration: 'none' }}>
            <Card 
                hoverable
                style={{ 
                    width: 300, 
                    height: 250,
                    display: 'inline-block',
                    overflow: 'hidden'
                }}
                cover={<video 
                    src={`http://localhost:8080/${videoPath}`} 
                    alt={name} 
                    style={{ height: '180px', width: '100%', objectFit: 'cover' }} 
                    //controls 
                />}
            >
                <Card.Meta title={name}/>
            </Card>
        </Link>
    )
}

export default CardComponent