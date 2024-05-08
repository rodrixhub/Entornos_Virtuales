import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { HomePage, HomeUser } from '../pages'

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        errorElement: <h1>Error</h1>
    },
    {
        path: '/user',
        element: <HomeUser />,
        errorElement: <h1>Error</h1>
    }
])

export const AppRouter = () => {
    return <RouterProvider router={router} />
}