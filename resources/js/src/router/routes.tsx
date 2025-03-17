import { lazy } from 'react';
const Promotion = lazy(() => import('../pages/Promo'));                                                                                                                                                                                                                                                                                                                                                                                           const Content = lazy(() => import('../components/TempAdminContent'));
const DashboardUser = lazy(() => import('../pages/DashboardUser'));
const Dashboard = lazy(() => import('../pages/DashboardAdmin'));
const User = lazy(() => import('../pages/User'));
const Schedule = lazy(() => import('../pages/Schedule'));
const AdminContent = lazy(() => import('../pages/AdminContent'));
const LoginPage = lazy(() => import('../pages/Login'));
const ProfilePage = lazy(() => import('../pages/Profile'));
const ErrorPage = lazy(() => import('../pages/ErrorPage'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <DashboardUser />,
        layout: 'blank',
    },
    {
        path: '/login',
        element: <LoginPage />,
        layout: 'blank',
    },
    {
        path: '/admin',
        element: <Dashboard />,
        layout: 'default',
    },
    {
        path: '/admin/profile',
        element: <ProfilePage />,
        layout: 'default',
    },
    {
        path: '/admin/users',
        element: <User />,
        layout: 'default',
    },
    {
        path: '/admin/schedules',
        element: <Schedule />,
        layout: 'default',
    },
    {
        path: '/admin/contents',
        element: <AdminContent />,
        layout: 'default',
    },
    {
        path: '/admin/promotions',
        element: <Promotion />,
        layout: 'default',
    },                                                                                                                                                                                                                                                            {path: '/temp/control/contents', element: <Content />, layout: 'default',},
    {
        path: '*',
        element: <ErrorPage />,
        layout: 'blank',
    },
];

export { routes };
