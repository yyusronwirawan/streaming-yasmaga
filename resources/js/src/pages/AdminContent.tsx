import React, { useEffect, useState } from 'react';
import axios from 'axios';
import sweetAlert from 'sweetalert2';
import app from "../App";

const AdminContent: React.FC = () => {
    const [appName, setAppName] = useState<string>('');
    const [streamUrl, setStreamUrl] = useState<string>('');
    const [footer, setFooter] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [logoUrl, setLogoUrl] = useState<string>('');
    const [faviconUrl, setFaviconUrl] = useState<string>('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);

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
                    return contentsWithParsedMetadata[0].metadata.image ?? '';
                } else {
                    return contentsWithParsedMetadata[0].metadata.value;
                }
            } else {
                return '';
            }
        } catch (error) {
            console.error('Error fetching contents:', error);
            return '';
        }
    };

    const getData = async (name: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        const value = await fetchContents(name);
        setter(value);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            const checkAuth = async () => {
                const response = await axios.get('/api/auth-check');
                if (!response.data.authenticated) {
                    window.location.href='/login';
                    return
                }
            };

            checkAuth();
            await getData('nama aplikasi', setAppName);
            await getData('stream url', setStreamUrl);
            await getData('footer', setFooter);
            const logo = await fetchContents('logo');
            const favicon = await fetchContents('favicon');

            if (favicon !== '' && favicon !== 'image') {
                setFaviconUrl(favicon);
            }

            if (logo !== '' && logo !== 'image') {
                setLogoUrl(logo);
            }
            setIsLoading(false);
        };

        fetchInitialData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(e.target.value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            if (name === 'image') {
                setLogoFile(file)
                setLogoUrl(URL.createObjectURL(file));
            } else {
                setFaviconFile(file)
                setFaviconUrl(URL.createObjectURL(file));
            }
        }
    };

    const updateProcess = async (name: string, type: string, value: string, image?: File) => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        if (type === 'image' && image) {
            formData.append('image', image);
            formData.append('value', value);
        } else {
            formData.append('value', value);
        }

        await axios.post('/api/contents/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            await updateProcess('nama aplikasi', 'text', appName)
            await updateProcess('stream url', 'text', streamUrl)
            await updateProcess('footer', 'text', footer)

            if (logoFile) {
                await updateProcess('logo', 'image','image', logoFile)
            }

            if (faviconFile) {
                await updateProcess('favicon', 'image','image', faviconFile)
            }

            await sweetAlert.fire({
                icon: 'success',
                title: 'Success',
                text: 'Content updated successfully!',
                timer: 2000,
                confirmButtonColor: '#3085d6',
            });
        } catch (error) {
            await sweetAlert.fire({
                icon: 'error',
                title: 'Error',
                text: 'Could not update the content. Please try again.',
                timer: 2000,
                confirmButtonColor: '#3085d6',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="p-4 flex flex-col overflow-hidden">
        {/* Breadcrumbs dengan Ikon */}
        <nav className="text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex text-gray-500 font-semibold dark:text-white-dark">
                <li>
                    <button className="hover:text-gray-500/70 dark:hover:text-white-dark/70">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"></circle><path d="M12 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path><circle cx="12" cy="16" r="1" fill="currentColor"></circle></svg>
                    </button>
                </li>
                <li className="before:content-['/'] before:px-1.5">
                    <button type="button">Setting App</button>
                </li>
            </ol>
        </nav>

        <div className="container mx-auto p-8 shadow-lg rounded-lg panel border border-white-light dark:border-[#1b2e4b]">
            <h2 className="text-2xl font-bold mb-1">Pengaturan Aplikasi</h2>
            <h2 className="mb-3 text-gray-500">Atur aplikasi anda sesuai keinginan</h2>
            <form className="space-y-4">
                <div className="flex flex-col items-center sm:flex-row sm:justify-center">
                    <div className="mb-4">
                        <label htmlFor="image" className="mb-2">Logo</label>

                        <div className="flex items-center space-x-4">
                            {logoUrl ? (
                                <img
                                    src={!logoUrl.includes('blob') ? `/storage/${logoUrl}` : logoUrl}
                                    alt="Image Preview"
                                    className="w-32 h-32 object-cover rounded"
                                />
                            ) : (
                                <img
                                    src={'https://placehold.co/300x200'}
                                    alt="Current Logo"
                                    className="w-32 h-32 object-cover rounded"
                                />
                            )}

                            <input
                                type="file"
                                name="image"
                                id="image"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={() => document.getElementById('image')?.click()}
                                className="relative flex items-center justify-center bg-white border border-blue-600 text-blue-600 hover:text-white font-bold py-2 px-4 rounded group overflow-hidden"
                            >
                <span
                    className="absolute inset-0 bg-blue-700 transform -translate-x-full group-hover:translate-x-0 transition duration-300 ease-in-out"></span>
                                <span className="relative z-10 flex items-center">
                    <svg
                        height="24px"
                        width="24px"
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 312.602 312.602"
                        xmlSpace="preserve"
                        className="mr-2"
                        aria-hidden="true"
                    >
                        <path
                            className="fill-blue-600 group-hover:fill-white transition-colors duration-300"
                            d="M251.52,137.244c-3.966,0-7.889,0.38-11.738,1.134c-1.756-47.268-40.758-85.181-88.448-85.181
                                c-43.856,0-80.964,32.449-87.474,75.106C28.501,129.167,0,158.201,0,193.764c0,36.106,29.374,65.48,65.48,65.48h54.782
                                c4.143,0,7.5-3.357,7.5-7.5c0-4.143-3.357-7.5-7.5-7.5H65.48c-27.835,0-50.48-22.645-50.48-50.48c0-27.835,22.646-50.48,50.48-50.48
                                c1.367,0,2.813,0.067,4.419,0.206l7.6,0.658l0.529-7.61c2.661-38.322,34.861-68.341,73.306-68.341
                                c40.533,0,73.51,32.977,73.51,73.51c0,1.863-0.089,3.855-0.272,6.088l-0.983,11.968l11.186-4.367
                                c5.356-2.091,10.99-3.151,16.747-3.151c25.409,0,46.081,20.672,46.081,46.081c0,25.408-20.672,46.08-46.081,46.08
                                c-0.668,0-20.608-0.04-40.467-0.08c-19.714-0.04-39.347-0.08-39.999-0.08c-4.668,0-7.108-2.248-7.254-6.681v-80.959l8.139,9.667
                                c2.667,3.17,7.399,3.576,10.567,0.907c3.169-2.667,3.575-7.398,0.907-10.567l-18.037-21.427c-2.272-2.699-5.537-4.247-8.958-4.247
                                c-3.421,0-6.686,1.548-8.957,4.247l-18.037,21.427c-2.668,3.169-2.262,7.9,0.907,10.567c1.407,1.185,3.121,1.763,4.826,1.763
                                c2.137,0,4.258-0.908,5.741-2.67l7.901-9.386v80.751c0,8.686,5.927,21.607,22.254,21.607c0.652,0,20.27,0.04,39.968,0.079
                                c19.874,0.041,39.829,0.081,40.498,0.081c33.681,0,61.081-27.4,61.081-61.08C312.602,164.644,285.201,137.244,251.52,137.244z"
                        />
                    </svg>
                    Upload
                </span>
                            </button>
                        </div>
                    </div>

                    <div className="mb-4 sm:ml-12">
                        <label htmlFor="favicon" className="mb-2">Favicon</label>

                        <div className="flex items-center space-x-4">
                            {faviconUrl ? (
                                <img
                                    src={!faviconUrl.includes('blob') ? `/storage/${faviconUrl}` : faviconUrl}
                                    alt="Image Preview"
                                    className="w-32 h-32 object-cover rounded"
                                />
                            ) : (
                                <img
                                    src={'https://placehold.co/300x200'}
                                    alt="Current Logo"
                                    className="w-32 h-32 object-cover rounded"
                                />
                            )}

                            <input
                                type="file"
                                name="favicon"
                                id="favicon"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={() => document.getElementById('favicon')?.click()}
                                className="relative flex items-center justify-center bg-white border border-blue-600 text-blue-600 hover:text-white font-bold py-2 px-4 rounded group overflow-hidden"
                            >
                <span
                    className="absolute inset-0 bg-blue-700 transform -translate-x-full group-hover:translate-x-0 transition duration-300 ease-in-out"></span>
                                <span className="relative z-10 flex items-center">
                    <svg
                        height="24px"
                        width="24px"
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 312.602 312.602"
                        xmlSpace="preserve"
                        className="mr-2"
                        aria-hidden="true"
                    >
                        <path
                            className="fill-blue-600 group-hover:fill-white transition-colors duration-300"
                            d="M251.52,137.244c-3.966,0-7.889,0.38-11.738,1.134c-1.756-47.268-40.758-85.181-88.448-85.181
                                c-43.856,0-80.964,32.449-87.474,75.106C28.501,129.167,0,158.201,0,193.764c0,36.106,29.374,65.48,65.48,65.48h54.782
                                c4.143,0,7.5-3.357,7.5-7.5c0-4.143-3.357-7.5-7.5-7.5H65.48c-27.835,0-50.48-22.645-50.48-50.48c0-27.835,22.646-50.48,50.48-50.48
                                c1.367,0,2.813,0.067,4.419,0.206l7.6,0.658l0.529-7.61c2.661-38.322,34.861-68.341,73.306-68.341
                                c40.533,0,73.51,32.977,73.51,73.51c0,1.863-0.089,3.855-0.272,6.088l-0.983,11.968l11.186-4.367
                                c5.356-2.091,10.99-3.151,16.747-3.151c25.409,0,46.081,20.672,46.081,46.081c0,25.408-20.672,46.08-46.081,46.08
                                c-0.668,0-20.608-0.04-40.467-0.08c-19.714-0.04-39.347-0.08-39.999-0.08c-4.668,0-7.108-2.248-7.254-6.681v-80.959l8.139,9.667
                                c2.667,3.17,7.399,3.576,10.567,0.907c3.169-2.667,3.575-7.398,0.907-10.567l-18.037-21.427c-2.272-2.699-5.537-4.247-8.958-4.247
                                c-3.421,0-6.686,1.548-8.957,4.247l-18.037,21.427c-2.668,3.169-2.262,7.9,0.907,10.567c1.407,1.185,3.121,1.763,4.826,1.763
                                c2.137,0,4.258-0.908,5.741-2.67l7.901-9.386v80.751c0,8.686,5.927,21.607,22.254,21.607c0.652,0,20.27,0.04,39.968,0.079
                                c19.874,0.041,39.829,0.081,40.498,0.081c33.681,0,61.081-27.4,61.081-61.08C312.602,164.644,285.201,137.244,251.52,137.244z"
                        />
                    </svg>
                    Upload
                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="border-white-light dark:border-[#1b2e4b]"/>

                <div className="flex items-center space-x-4 mb-4">
                    <label className="w-1/4" htmlFor="appName">
                        Nama Aplikasi
                    </label>
                    <input
                        type="text"
                        id="appName"
                        value={appName}
                        onChange={(e) => handleInputChange(e, setAppName)}
                        placeholder="Masukkan Nama Aplikasi"
                        className="w-3/4 form-input"
                    />
                </div>

                <div className="flex items-center space-x-4 mb-4">
                    <label className="w-1/4" htmlFor="streamUrl">
                        Stream Url
                    </label>
                    <input
                        type="text"
                        id="streamUrl"
                        value={streamUrl}
                        onChange={(e) => handleInputChange(e, setStreamUrl)}
                        placeholder="Masukkan API Stream URL"
                        className="w-3/4 form-input"
                    />
                </div>

                <div className="flex items-center space-x-4 mb-4">
                    <label className="w-1/4" htmlFor="footer">
                        Footer
                    </label>
                    <input
                        type="text"
                        id="footer"
                        value={footer}
                        onChange={(e) => handleInputChange(e, setFooter)}
                        placeholder="Masukkan Footer"
                        className="w-3/4 form-input"
                    />
                </div>

                <div className="flex items-center space-x-4 mb-4">
                    <label className="w-1/4">

                    </label>
                    <div className={'w-3/4'}>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className={`px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out
                            ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`
                            }
                            disabled={isLoading}
                        >
                            {isLoading ? 'Mengubah...' : 'Simpan'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
        </div>
    );
};

export default AdminContent;
