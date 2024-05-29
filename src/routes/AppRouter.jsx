import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { HomePage, HomeUser, ClasePage, UploadPage, BibliotecaPage, ReproducirPage, ReproducirUsuario, LoginPage, RegisterPage } from '../pages'

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
        path: '/user/UploadPage',
        element: <UploadPage />,
        errorElement: <h1>Error</h1>
    },
    {
        path: '/user/BibliotecaPage',
        element: <BibliotecaPage />,
        errorElement: <h1>Error</h1>
    },
    {
        path: '/user/ReproducirPage/:id',
        element: <ReproducirPage />,
        errorElement: <h1>Error</h1>
    },
    {
        path: '/user/ReproducirUsuario/:id',
        element: <ReproducirUsuario />,
        errorElement: <h1>Error</h1>
    },
{
    path: '/LoginPage',
    element: <LoginPage />,
    errorElement: <h1>error</h1>
},
{
    path: '/RegisterPage',
    element: <RegisterPage />,
    errorElement: <h1>error</h1>
}
])

export const AppRouter = () => {
    return <RouterProvider router={router} />
}