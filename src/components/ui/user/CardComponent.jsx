import React from 'react'
import { Card } from 'antd'
import videoImagen from '../../../assets/image.png'

//const { Meta } = Card

export const CardComponent = (props) => {
    //console.log('Props recibidas:', props); 
    const { data: { name } } = props;

    return (
        <Card 
            hoverable
            style={{ width: 200, display: 'inline-block' }}
            cover={<img alt={name} src={videoImagen} />}
        >
            <Card.Meta title={name}/>
        </Card>
    )
}

export default CardComponent