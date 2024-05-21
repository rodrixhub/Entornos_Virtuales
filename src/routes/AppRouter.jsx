import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { HomePage, HomeUser, ClasePage, UploadPage, BibliotecaPage } from '../pages'

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
    },
    {
        path: '/user/Clase/:id',
        element: <ClasePage />,
        errorElement: <h1>Error</h1>
    },
    {
        path: '/UploadPage',
        element: <UploadPage />,
        errorElement: <h1>Error</h1>
    },
    {
        path: '/BibliotecaPage',
        element: <BibliotecaPage />,
        errorElement: <h1>Error</h1>
    }
])

export const AppRouter = () => {
    return <RouterProvider router={router} />
}