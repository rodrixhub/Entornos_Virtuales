import { Layout } from 'antd'
import { UserLayout } from '../components/layouts/UserLayout'

export const HomeUser = () => {
    const { Content } = Layout

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
                
            </Content>
        </UserLayout>
    )
}