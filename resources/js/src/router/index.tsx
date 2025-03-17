import { createBrowserRouter, RouteObject, Navigate } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { routes } from './routes';
import { atom } from 'jotai';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const storePlayPause = atom(true);

const protectedRoutes = ['/admin', '/admin/profile', '/admin/users', '/admin/schedules', '/admin/contents', '/admin/promotions'];

const finalRoutes: RouteObject[] = routes.map((route) => {
    const CheckAuth = () => {
        const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response = await axios.get('/api/auth-check');
                    setIsAuthenticated(response.data.authenticated);
                } catch (error) {
                    console.error("Authentication check failed", error);
                    setIsAuthenticated(false);
                }
            };

            if (protectedRoutes.includes(route.path) || route.path === '/login') {
                checkAuth();
            } else {
                setIsAuthenticated(true);
            }
        }, [route.path]);

        if (isAuthenticated === null) {
            return (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
                        <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                            <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite"/>
                        </path>
                    </svg>
                </div>
            );
        }

        if (isAuthenticated && protectedRoutes.includes(route.path)) {
            return route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout>{route.element}</DefaultLayout>;
        } else if (isAuthenticated && route.path === '/login') {
            return <Navigate to="/admin" replace />;
        } else if (!isAuthenticated && protectedRoutes.includes(route.path)) {
            return <Navigate to="/login" replace />;
        } else {
            return route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout>{route.element}</DefaultLayout>;
        }
    };

    return {
        ...route,
        element: <CheckAuth />,
    };
});

const router = createBrowserRouter(finalRoutes);

export default router;
