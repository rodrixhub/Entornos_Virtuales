import { Layout } from 'antd'
import { Header } from '../ui/user'
import { Footer } from '../ui'

export const UserLayout = ({ children }) => {
    return(
        <Layout style={{ minHeight: '100vh' }}>
            <Header />
            <Layout className="site-layout">

                {children}
                <Footer />
            </Layout>
        </Layout>
    )
}