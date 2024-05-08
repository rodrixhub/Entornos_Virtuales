import { Layout } from 'antd'

import { Header } from '../ui/home'
import { Footer } from '../ui'
export const HomeLayout = ({ children }) => {
    return(
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Header />
                <Layout className="site-layout">

                    {children}
                    <Footer />
                </Layout>
            </Layout>
        </>
    )
}