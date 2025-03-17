import axios from 'axios';
import React, { useEffect, useState } from 'react';
import sweetAlert from 'sweetalert2';

const Login: React.FC = () => {
    const [identifier, setIdentifier] = useState<string>(''); // Renamed to identifier for clarity
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [footer, setFooter] = useState('footer');

    const fetchContents = async (name: string): Promise<string> => {
        try {
            const response = await axios.get('/api/contents', {
                params: {
                    name: name,
                },
            });
            if (response.data && response.data.contents) {
                const contentsWithParsedMetadata = response.data.contents.map((content: any) => ({
                    ...content,
                    metadata: JSON.parse(content.metadata) as {
                        image?: string | null;
                        type: string;
                        value: string;
                    },
                }));
                if (contentsWithParsedMetadata[0].metadata.type === 'image') {
                    return contentsWithParsedMetadata[0].metadata.image
                } else {
                    return contentsWithParsedMetadata[0].metadata.value
                }
            } else {
                return ''
            }
        } catch (error) {
            console.error('Error fetching contents:', error);
            return ''
        }
    };

    useEffect(() => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
        }
        const checkAuth = async () => {
            const response = await axios.get('/api/auth-check');
            if (response.data.authenticated) {
                window.history.back();
                return
            }
        };
        const fetchContentData = async () => {
            const newFooter = await fetchContents('footer');
            setFooter(newFooter);
        };


        checkAuth();
        if (footer === 'footer') {
            fetchContentData();
        }
    }, [footer]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('/api/login', {
                identifier,
                password,
            });

            if (response.status === 200) {
                await sweetAlert.fire({
                    icon: 'success',
                    title: 'Login Success',
                    text: 'You will be redirected to the dashboard',
                    timer: 2000,
                    confirmButtonColor: '#3085d6',
                });
                window.location.href = '/admin';
            }
        } catch (error: any) {
            if (error.response && error.response.data.errors) {
                setMessage(error.response.data.errors.identifier ? error.response.data.errors.identifier[0] : 'Login failed. Check your credentials.');
            } else {
                setMessage('Login failed. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="flex flex-col justify-center items-center space-y-4">
                    <img
                        src="/assets/images/yasmaga_1.png"
                        alt="Radio Yasmaga"
                        className="w-auto h-12 max-w-xs object-contain "
                    />
                </div>


                {message && <div className="p-3 text-red-500 bg-red-100 rounded">{message}</div>}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="identifier"
                               className="block mb-1 text-sm font-medium text-gray-600">Email/Username</label>
                        <input
                            type="text"
                            id="identifier"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Masukkan Email/Username"
                            required
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"
                               className="block mb-1 text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan Password"
                            required
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    <span className="block text-xs text-gray-600">Belum punya akun? Silakan hubungi admin</span>
                </p>
                <div className="dark:text-white-dark text-center text-xs mt-auto">
                    {/*© {new Date().getFullYear()}. Radio Yasmaga 96.90 FM Mhz v1.1.0*/}
                    {footer === 'footer' ? '© ' : '© ' + footer}
                </div>
            </div>
        </div>
    );
};

export default Login;
