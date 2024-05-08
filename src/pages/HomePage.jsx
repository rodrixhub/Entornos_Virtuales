import { Layout } from 'antd'
import { HomeLayout } from '../components/layouts/HomeLayout'

export const HomePage = () => {
    const { Content } = Layout

    return(
        <HomeLayout>
            <Content
            className='fondo'
            style={{
                height: '100%',
                minHeight: '84vh',
                lineHeight: '100vh',
                textAlign: 'center'
            }}
            >
                
            </Content>
        </HomeLayout>
    )
}