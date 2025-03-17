import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import user from "./User";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [totalSchedules, setTotalSchedules] = useState<number>(0);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalPromos, setTotalPromos] = useState<number>(0);
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const response = await axios.get('/api/auth-check');
            if (!response.data.authenticated) {
                window.location.href='/login';
                return
            }
        };

        checkAuth();
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get('/api/schedules?per_page=0');
            const response_user = await axios.get('/api/users');
            const response_promo = await axios.get('/api/promos');

            setTotalUsers(response_user.data.total);
            setTotalSchedules(response.data.total);
            setTotalPromos(response_promo.data.total);

            const dayCount = response.data.data.reduce((acc: { [x: string]: any }, curr: { date: any }) => {
                const { date } = curr;
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const dayOfWeekCounts = {
                Senin: dayCount.Senin || 0,
                Selasa: dayCount.Selasa || 0,
                Rabu: dayCount.Rabu || 0,
                Kamis: dayCount.Kamis || 0,
                Jumat: dayCount.Jumat || 0,
                Sabtu: dayCount.Sabtu || 0,
                Minggu: dayCount.Minggu || 0,
            };

            setChartData({
                labels: Object.keys(dayOfWeekCounts),
                datasets: [
                    {
                        label: 'Jumlah Siaran Harian',
                        data: Object.values(dayOfWeekCounts),
                        borderColor: '#4F46E5',
                        backgroundColor: 'rgba(79, 70, 229, 0.5)',
                        fill: true,
                        tension: 0.3,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    return (
        <div className="p-4 flex flex-col overflow-hidden">
        {/* Breadcrumbs dengan Ikon */}
        <nav className="text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex text-gray-500 font-semibold dark:text-white-dark">
                <li>
                    <button className="hover:text-gray-500/70 dark:hover:text-white-dark/70">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                            <path
                                opacity="0.5"
                                d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path d="M12 15L12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </li>
                <li className="before:content-['/'] before:px-1.5">
                <button type="button">Dashboard</button>
                </li>
            </ol>
        </nav>

        <div className="p-4 flex flex-col overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <div
                    className="relative bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-lg shadow-lg flex items-center justify-between h-24 text-white transition-transform duration-300 hover:scale-105">
                    <div className="flex items-center">
                    <svg className="mr-2" width="40" height="40" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                    d="M6.94028 2C7.35614 2 7.69326 2.32421 7.69326 2.72414V4.18487C8.36117 4.17241 9.10983 4.17241 9.95219 4.17241H13.9681C14.8104 4.17241 15.5591 4.17241 16.227 4.18487V2.72414C16.227 2.32421 16.5641 2 16.98 2C17.3958 2 17.733 2.32421 17.733 2.72414V4.24894C19.178 4.36022 20.1267 4.63333 20.8236 5.30359C21.5206 5.97385 21.8046 6.88616 21.9203 8.27586L22 9H2.92456H2V8.27586C2.11571 6.88616 2.3997 5.97385 3.09665 5.30359C3.79361 4.63333 4.74226 4.36022 6.1873 4.24894V2.72414C6.1873 2.32421 6.52442 2 6.94028 2Z"
                    fill="currentColor"
                    />
                    <path
                    opacity="0.5"
                    d="M21.9995 14.0001V12.0001C21.9995 11.161 21.9963 9.66527 21.9834 9H2.00917C1.99626 9.66527 1.99953 11.161 1.99953 12.0001V14.0001C1.99953 17.7713 1.99953 19.6569 3.1711 20.8285C4.34267 22.0001 6.22829 22.0001 9.99953 22.0001H13.9995C17.7708 22.0001 19.6564 22.0001 20.828 20.8285C21.9995 19.6569 21.9995 17.7713 21.9995 14.0001Z"
                    fill="currentColor"
                    />
                   </svg>
                        <div className="text-center ml-3">
                            <h3 className="text-xl font-semibold">Jumlah Jadwal</h3>
                            <p className="text-2xl font-bold">{totalSchedules}</p>
                        </div>
                    </div>
                    <a href="/admin/schedules"
                       className="flex items-center absolute bottom-2 left-2 text-white hover:text-gray-300 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path opacity="0.5" d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z" stroke="currentColor" strokeWidth="1.5"></path><path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5"></path></svg>
                        <span className="ml-1 text-xs">Selengkapnya..</span>
                    </a>
                </div>

                <div
                    className="relative bg-gradient-to-r from-green-400 to-green-600 p-4 rounded-lg shadow-lg flex items-center justify-between h-24 text-white transition-transform duration-300 hover:scale-105">
                    <div className="flex items-center">
                        <svg className="mr-2" width="40" height="40" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <circle opacity="0.5" cx="15" cy="6" r="3" fill="currentColor"/>
                            <ellipse opacity="0.5" cx="16" cy="17" rx="5" ry="3" fill="currentColor"/>
                            <circle cx="9.00098" cy="6" r="4" fill="currentColor"/>
                            <ellipse cx="9.00098" cy="17.001" rx="7" ry="4" fill="currentColor"/>
                        </svg>
                        <div className="text-center ml-3">
                            <h3 className="text-xl font-semibold">Jumlah Pengguna</h3>
                            <p className="text-2xl font-bold">{totalUsers}</p>
                        </div>
                    </div>
                    <a href="/admin/users"
                       className="flex items-center absolute bottom-2 left-2 text-white hover:text-gray-300 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path opacity="0.5" d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z" stroke="currentColor" strokeWidth="1.5"></path><path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5"></path></svg>
                        <span className="ml-1 text-xs">Selengkapnya..</span>
                    </a>
                </div>

                <div
                    className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-lg shadow-lg flex items-center justify-between h-24 text-white transition-transform duration-300 hover:scale-105"
                >
                    <div className="flex items-center">
                        <svg className="mr-2 w-6 h-6" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.5" d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z" fill="currentColor"></path><path d="M16.5189 16.5013C16.6939 16.3648 16.8526 16.2061 17.1701 15.8886L21.1275 11.9312C21.2231 11.8356 21.1793 11.6708 21.0515 11.6264C20.5844 11.4644 19.9767 11.1601 19.4083 10.5917C18.8399 10.0233 18.5356 9.41561 18.3736 8.94849C18.3292 8.82066 18.1644 8.77687 18.0688 8.87254L14.1114 12.8299C13.7939 13.1474 13.6352 13.3061 13.4987 13.4811C13.3377 13.6876 13.1996 13.9109 13.087 14.1473C12.9915 14.3476 12.9205 14.5606 12.7786 14.9865L12.5951 15.5368L12.3034 16.4118L12.0299 17.2323C11.9601 17.4419 12.0146 17.6729 12.1708 17.8292C12.3271 17.9854 12.5581 18.0399 12.7677 17.9701L13.5882 17.6966L14.4632 17.4049L15.0135 17.2214L15.0136 17.2214C15.4394 17.0795 15.6524 17.0085 15.8527 16.913C16.0891 16.8004 16.3124 16.6623 16.5189 16.5013Z" fill="currentColor"></path><path d="M22.3665 10.6922C23.2112 9.84754 23.2112 8.47812 22.3665 7.63348C21.5219 6.78884 20.1525 6.78884 19.3078 7.63348L19.1806 7.76071C19.0578 7.88348 19.0022 8.05496 19.0329 8.22586C19.0522 8.33336 19.0879 8.49053 19.153 8.67807C19.2831 9.05314 19.5288 9.54549 19.9917 10.0083C20.4545 10.4712 20.9469 10.7169 21.3219 10.847C21.5095 10.9121 21.6666 10.9478 21.7741 10.9671C21.945 10.9978 22.1165 10.9422 22.2393 10.8194L22.3665 10.6922Z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M7.25 9C7.25 8.58579 7.58579 8.25 8 8.25H14.5C14.9142 8.25 15.25 8.58579 15.25 9C15.25 9.41421 14.9142 9.75 14.5 9.75H8C7.58579 9.75 7.25 9.41421 7.25 9ZM7.25 13C7.25 12.5858 7.58579 12.25 8 12.25H11C11.4142 12.25 11.75 12.5858 11.75 13C11.75 13.4142 11.4142 13.75 11 13.75H8C7.58579 13.75 7.25 13.4142 7.25 13ZM7.25 17C7.25 16.5858 7.58579 16.25 8 16.25H9.5C9.91421 16.25 10.25 16.5858 10.25 17C10.25 17.4142 9.91421 17.75 9.5 17.75H8C7.58579 17.75 7.25 17.4142 7.25 17Z" fill="currentColor"></path></svg>
                        <div className="text-center ml-3">
                            <h3 className="text-xl font-semibold">Jumlah Promosi</h3>
                            <p className="text-2xl font-bold">{totalPromos}</p>
                        </div>
                    </div>
                    <a
                        href="/admin/promotions"
                        className="flex items-center absolute bottom-2 left-2 text-white hover:text-gray-300 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path opacity="0.5" d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z" stroke="currentColor" strokeWidth="1.5"></path><path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5"></path></svg>
                        <span className="ml-1 text-xs">Selengkapnya..</span>
                    </a>
                </div>

            </div>


            {/*<div className="items-center justify-center text-center mt-2">*/}
            {/*    <h2 className="text-xl font-semibold text-gray-700 mb-4">Jadwal Siaran Mingguan</h2>*/}
            {/*    <div className="bg-white p-4 rounded-lg shadow-md w-full"*/}
            {/*         style={{height: '305px'}}*/}
            {/*    >*/}
            {/*            {chartData ? (*/}
            {/*                <Line*/}
            {/*                    data={chartData}*/}
            {/*                    options={{*/}
            {/*                        responsive: true,*/}
            {/*                        maintainAspectRatio: false,*/}
            {/*                        plugins: {*/}
            {/*                            legend: {*/}
            {/*                                display: true,*/}
            {/*                                position: 'top',*/}
            {/*                            },*/}
            {/*                            title: {*/}
            {/*                                display: true,*/}
            {/*                                text: "Jadwal Siaran Senin - Jum'at",*/}
            {/*                            },*/}
            {/*                        },*/}
            {/*                        scales: {*/}
            {/*                            y: {*/}
            {/*                                beginAtZero: true,*/}
            {/*                                ticks: {*/}
            {/*                                    stepSize: 1,*/}
            {/*                                },*/}
            {/*                            },*/}
            {/*                        },*/}
            {/*                    }}*/}
            {/*                />*/}
            {/*            ) : (*/}
            {/*                <p className="text-gray-500 text-center">Loading chart...</p>*/}
            {/*            )}*/}
            {/*        </div>*/}

            {/*</div>*/}
        </div>
        </div>
    );
};

export default Dashboard;
