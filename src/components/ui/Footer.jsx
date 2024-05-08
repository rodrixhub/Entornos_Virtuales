import { Layout } from 'antd'

export const Footer = () => {
    const { Footer } = Layout

    return(
        <Footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#001529', color: 'white', height: '5vh' }} className='footer'>
            Biblioteca tecnologica ©2024 Entornos Virtuales
        </Footer>
    )
}