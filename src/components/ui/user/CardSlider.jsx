import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Carousel, Button } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { CardComponent } from '../user/CardComponent'

export const CardSlider = ({ products }) => {
    
    const [slidesToShow, setSlidesToShow] = useState(2)

    useEffect(() => {
        const calculateSlidesToShow = () => {
          const screenWidth = window.innerWidth;
          const cardWidth = 235; // Ancho aproximado de cada tarjeta en píxeles
          const extraPixels = 100; // Número exacto de píxeles extras para mostrar una tarjeta adicional
    
          // Calculamos el número de tarjetas en función del ancho disponible y el ancho de cada tarjeta
          const calculatedSlidesToShow = Math.floor((screenWidth + extraPixels) / cardWidth);
            
          // Aseguramos que haya al menos una tarjeta mostrada
          setSlidesToShow(Math.max(1, calculatedSlidesToShow));
        };
    
        calculateSlidesToShow();
    
        const handleResize = () => {
          calculateSlidesToShow();
        };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "white",
                    width: "20px", // Ancho del rectángulo
                    height: "20px", // Alto del rectángulo
                    color: "black", // Color del icono de la flecha.
                }}
                onClick={onClick}
            >
            </div>
        );
      }
      
      function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "white",
                    width: "20px", // Ancho del rectángulo
                    height: "20px", // Alto del rectángulo
                    color: "black", // Color del icono de la flecha.
                }}
                onClick={onClick}
            >
                
            </div>
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
            {products.map((item, index) => (
                <div key={index}>
                    <CardComponent data={item} />
                </div>
            ))}
        </Carousel>
    );
};

export default CardSlider;
