import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import axios from 'axios';
import { CardComponent } from '../user/CardComponent';

export const CardSlider = () => {
    const [videos, setVideos] = useState([]);
    const [slidesToShow, setSlidesToShow] = useState(2);

    const fetchVideos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/video/video');
            setVideos(response.data.video);
        } catch (error) {
            console.error('Error fetching videos', error);
        }
    };

    useEffect(() => {
        fetchVideos();
        window.addEventListener('resize', handleResize);
        console.log("Actualizcion")
    }, []);

    const calculateSlidesToShow = () => {
        const screenWidth = window.innerWidth;
        const cardWidth = 360; // Ancho aproximado de cada tarjeta en píxeles incluyendo margen
        const extraPixels = 100; // Número exacto de píxeles extras para mostrar una tarjeta adicional
    
        // Calculamos el número de tarjetas en función del ancho disponible y el ancho de cada tarjeta
        const calculatedSlidesToShow = Math.floor((screenWidth + extraPixels) / cardWidth);
        
        // Aseguramos que haya al menos una tarjeta mostrada
        setSlidesToShow(Math.max(1, calculatedSlidesToShow));
    };

    const handleResize = () => {
        calculateSlidesToShow();
    };

    /*useEffect(() => {
        
        console.log("Actualiza flechas")
        /*return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])*/

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'white',
                    width: '20px', // Ancho del rectángulo
                    height: '20px', // Alto del rectángulo
                    color: 'black', // Color del icono de la flecha.
                }}
                onClick={onClick}
            />
        );
    }
    
    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'white',
                    width: '20px', // Ancho del rectángulo
                    height: '20px', // Alto del rectángulo
                    color: 'black', // Color del icono de la flecha.
                }}
                onClick={onClick}
            />
        );
    }

    return (
        <Carousel 
            
            infinite 
            arrows
            nextArrow={<SampleNextArrow />}
            prevArrow={<SamplePrevArrow />}
            slidesToShow={slidesToShow} 
            dots={false} 
            style={{ width: '100%'}}
        >
            {videos.map((video, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'center' }}>
                    <CardComponent data={video} />
                </div>
            ))}
        </Carousel>
    );
};

export default CardSlider;
