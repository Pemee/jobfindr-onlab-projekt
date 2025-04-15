import { render } from 'preact'
import './styles/index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './pages/Home.tsx';
import Profile from './pages/Profile.tsx';
import Post from './pages/Post.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import Registration from './auth/Registration.tsx';
import Login from './auth/Login.tsx';
import Quiz from './pages/Quiz.tsx';
import PostCreation from './pages/PostCreation.tsx';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <NotFoundPage />,
    },
    {
        path: '/profile',
        element: <Profile />,
    },
    {
        path: '/post-creation',
        element: <PostCreation />,
    },
    {
        path: '/posts/:id',
        element: <Post />,
    },
    {
        path: '/registration',
        element: <Registration/>,
    },
    {
        path: '/login',
        element: <Login/>,
    },
    {
        path: '/quiz/:id',
        element: <Quiz/>,
    },
  ]);
render(<RouterProvider router={router} />, document.getElementById('app')!)
