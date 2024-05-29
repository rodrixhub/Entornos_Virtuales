import React from 'react';
import { Layout } from 'antd';
import { HomeLayout } from '../components/layouts/HomeLayout';
import './homepage.css';
import homeImage from '../assets/home.jpg'; // Ajusta la ruta según la ubicación de tu imagen

export const HomePage = () => {
    const { Content } = Layout;

    return (
        <HomeLayout>
            <Content>
                <div className="content-wrapper">
                    <div className="text-section">
                        <div className="subheader">Bienvenido</div>
                        <div className="header">Biblioteca del Saber</div>
                        <div className="description">
                            Somos la Biblioteca Del Saber. Biblioteca del Saber es una plataforma educativa donde puedes subir videos y aprender de ellos. Nuestra misión es facilitar el acceso al conocimiento a través de recursos visuales, permitiendo a los usuarios compartir y adquirir conocimientos de manera interactiva y accesible.
                        </div>
                        <button className="button">Comenzar</button>
                    </div>
                    <div className="image-section">
                        <img src={homeImage} alt="Biblioteca del Saber" />
                    </div>
                </div>
            </Content>
        </HomeLayout>
    );
};
