import React, { useEffect, useState } from "react";
import axios from "axios";
import sweetAlert from "sweetalert2";

interface User {
    id: number;
    full_name: string;
    username: string;
    email: string;
    status: boolean;
    image?: string;
}

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<FormData>(new FormData());
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("/api/auth-check");
                if (!response.data.authenticated) {
                    window.location.href='/login';
                } else {
                    setUser(response.data.user);
                    setImagePreview(response.data.user.image);
                    setFormData(prev => {
                        const updatedFormData = new FormData();
                        for (const [key, val] of prev.entries()) {
                            updatedFormData.append(key, val);
                        }
                        updatedFormData.set('full_name', response.data.user.full_name);
                        updatedFormData.set('username', response.data.user.username);
                        updatedFormData.set('email', response.data.user.email);
                        return updatedFormData;
                    });
                }
            } catch (err) {
                setError("Failed to fetch user data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        const updatedFormData = new FormData();
        for (const [key, val] of formData.entries()) {
            updatedFormData.append(key, val);
        }

        if (files && files.length > 0) {
            updatedFormData.set(name, files[0]);
            const file = files[0];
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            updatedFormData.set(name, value);
        }

        setFormData(updatedFormData);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsLoading(true);
            if (password) {
                formData.set('password', password);
            }
            await axios.post(`/api/users/${user.id}/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await sweetAlert.fire({
                icon: "success",
                title: "Success",
                text: "User updated successfully!",
                timer: 3000,
                confirmButtonColor: "#3085d6",
            });

            const updatedResponse = await axios.get("/api/auth-check");
            setUser(updatedResponse.data.user);
            setImagePreview(updatedResponse.data.user.image);

            setFormData(prev => {
                const updatedFormData = new FormData();
                for (const [key, val] of prev.entries()) {
                    updatedFormData.append(key, val);
                }
                updatedFormData.set('full_name', updatedResponse.data.user.full_name);
                updatedFormData.set('username', updatedResponse.data.user.username);
                updatedFormData.set('email', updatedResponse.data.user.email);
                return updatedFormData;
            });
        } catch (error: any) {
            await sweetAlert.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Could not update the user. Please try again.",
                timer: 3000,
                confirmButtonColor: "#3085d6",
            });
        } finally {
            setPassword('')
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="p-4 flex flex-col overflow-hidden">
        {/* Breadcrumbs dengan Ikon */}
        <nav className="text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex text-gray-500 font-semibold dark:text-white-dark">
                <li>
                    <button className="hover:text-gray-500/70 dark:hover:text-white-dark/70">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"></circle><path opacity="0.5" d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" stroke="currentColor" strokeWidth="1.5"></path></svg>
                    </button>
                </li>
                <li className="before:content-['/'] before:px-1.5">
                    <button type="button">Setting Profil</button>
                </li>
            </ol>
        </nav>

        <div className="container mx-auto">
            {user && (
                <form onSubmit={handleSubmit} className="p-6 rounded shadow-md panel border border-white-light dark:border-[#1b2e4b]">
                    <h2 className="text-2xl font-bold mb-1">Profil Saya</h2>
                    <h2 className="mb-3 text-gray-500">Kelola informasi profil anda untuk, mengontrol, melindungi dan
                        mengamankan akun</h2>
                    <div className="mb-4">
                        <div className="flex items-center space-x-4">
                            {imagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={user.image !== null && !imagePreview.includes('blob') ? `/storage/${imagePreview}` : imagePreview}
                                        alt="Image Preview" className="w-32 h-32 object-cover rounded"/>
                                </div>
                            )}

                            <input
                                type="file"
                                name="image"
                                id="image"
                                onChange={handleChange}
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

                    <hr className="border-white-light dark:border-[#1b2e4b]"/>

                    <div className="flex items-center space-x-4 mb-4 mt-5">
                        <label className="w-1/4" htmlFor="full_name">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            id="full_name"
                            defaultValue={user.full_name}
                            onChange={handleChange}
                            placeholder="Masukkan Nama Lengkap"
                            className="w-3/4 form-input"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                        <label className="w-1/4" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            defaultValue={user.username}
                            onChange={handleChange}
                            placeholder="Masukkan Username"
                            className="w-3/4 form-input"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                        <label className="w-1/4" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            defaultValue={user.email}
                            onChange={handleChange}
                            placeholder="Masukkan Email"
                            className="w-3/4 form-input"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <label className="w-1/4" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Masukkan Password"
                            className="w-3/4 form-input"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                        <label className="w-1/4" htmlFor="password">

                        </label>
                        <div className={'w-3/4'}>
                            <p className={'text-red-600'}>*Biarkan kosong apabila tidak ada perubahan password</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
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
                                {isLoading ? 'Mengubah...' : 'Perbarui'}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
        </div>
    );
};

export default Profile;
