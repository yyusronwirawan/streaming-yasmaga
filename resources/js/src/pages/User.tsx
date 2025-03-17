import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HiPlus, HiMinus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import sweetAlert from 'sweetalert2';
import { Dialog, Transition } from '@headlessui/react';
import { Response } from '../utils/types';

interface User {
    id: number;
    full_name: string;
    username: string;
    email: string;
    status: boolean;
    image?: string;
}

const UserList: React.FC = () => {
    const [url, setUrl] = useState(() => {
        const url = new URL(window.location.href);
        url.pathname = '/api/users';
        return url.toString();
    });
    const [data, setData] = useState<Response<User> | null>(null);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<{
        fullName: string;
        email: string;
        username: string;
        password: string;
        image: File | null;
    }>({
        fullName: '',
        email: '',
        username: '',
        password: '',
        image: null,
    });

    useEffect(() => {
        const checkAuth = async () => {
            const response = await axios.get('/api/auth-check');
            if (!response.data.authenticated) {
                window.location.href='/login';
                return
            }
        };

        checkAuth();
        fetchUsers();
    }, [url]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(url);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const toggleRow = (index: number) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    const onClose = () => {
        setShowModal(false);
        setIsEditing(false);
        setCurrentUser(null);
        setFormData({ fullName: '', email: '', username: '', password: '', image: null });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                image: files[0],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                image: null,
            }));
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { fullName, email, username, password, image } = formData;

        const userPayload = { full_name: fullName, email, username, password };

        try {
            const formDataObj = new FormData();
            Object.keys(userPayload).forEach((key) => {
                formDataObj.append(key, userPayload[key as keyof typeof userPayload]);
            });
            if (image) {
                formDataObj.append('image', image);
            }
            console.log(formDataObj)

            if (isEditing && currentUser) {
                try {
                    await axios.post(`/api/users/${currentUser.id}/update`, formDataObj);
                    await sweetAlert.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'User updated successfully!',
                        timer: 2000,
                        confirmButtonColor: '#3085d6',
                    });
                } catch (error) {
                    await sweetAlert.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Could not update the user. Please try again.',
                        timer: 2000,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    });
                }
            } else {
                try {
                    await axios.post('/api/users', formDataObj);
                    await sweetAlert.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'User created successfully!',
                        timer: 2000,
                        confirmButtonColor: '#3085d6',
                    });
                } catch (error) {
                    await sweetAlert.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Could not save user. Please try again.',
                        timer: 2000,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    });
                }
            }
            fetchUsers();
            onClose();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleEdit = (user: User) => {
        setCurrentUser(user);
        setFormData({
            fullName: user.full_name,
            email: user.email,
            username: user.username,
            password: '',
            image: null,
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        const result = await sweetAlert.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/users/${id}`);
                setUrl((prev) => {
                    const url = new URL(prev);
                    url.searchParams.set('page', '1');
                    return url.toString();
                })
                await sweetAlert.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Your user has been deleted.',
                    timer: 2000,
                    confirmButtonColor: '#3085d6',
                });
            } catch (error) {
                console.error('Error deleting schedule:', error);
                await sweetAlert.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Could not delete user. Please try again.',
                    timer: 2000,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                });
            }
        }
    };

    return (
        <div className="p-4 flex flex-col overflow-hidden">
            {/* Breadcrumbs dengan Ikon */}
            <nav className="text-gray-500 mb-4" aria-label="Breadcrumb">
                <ol className="flex text-gray-500 font-semibold dark:text-white-dark">
                    <li>
                        <button className="hover:text-gray-500/70 dark:hover:text-white-dark/70">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><circle cx="9" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"></circle><path opacity="0.5" d="M12.5 4.3411C13.0375 3.53275 13.9565 3 15 3C16.6569 3 18 4.34315 18 6C18 7.65685 16.6569 9 15 9C13.9565 9 13.0375 8.46725 12.5 7.6589" stroke="currentColor" strokeWidth="1.5"></path><ellipse cx="9" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5"></ellipse><path opacity="0.5" d="M18 14C19.7542 14.3847 21 15.3589 21 16.5C21 17.5293 19.9863 18.4229 18.5 18.8704" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path></svg>
                        </button>
                    </li>
                    <li className="before:content-['/'] before:px-1.5">
                        <button type="button">Data Pengguna</button>
                    </li>
                </ol>
            </nav>

            <div className="container mx-auto py-1 px-4 sm:px-0">
                <button
                    className="flex items-center justify-center mb-2 px-2 py-2 text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                    onClick={() => {
                        setIsEditing(false);
                        setShowModal(true);
                    }}
                >
                    Tambah Pengguna
                </button>

                <div className="overflow-x-auto shadow-md rounded-lg border border-white-light/40 dark:border-[#191e3a]">
                    <table className="min-w-full table-auto table-hover">
                        <thead>
                            <tr>
                                <th className="py-3 px-4 text-left">No</th>
                                <th className="py-3 px-4 text-left">Nama</th>
                                <th className="py-3 px-4 text-left hidden sm:table-cell">Username</th>
                                <th className="py-3 px-4 text-left hidden md:table-cell">Email</th>
                                <th className="py-3 px-4 text-left hidden lg:table-cell">Status</th>
                                <th className="py-3 px-4 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                        {!data?.data || data.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-4 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((user, index) => (
                                <React.Fragment key={user.id}>
                                    <tr>
                                        <td className="py-2 px-4">{index + 1}</td>
                                        <td className="py-2 px-4">{user.full_name}</td>
                                        <td className="py-2 px-4 hidden sm:table-cell">{user.username}</td>
                                        <td className="py-2 px-4 hidden md:table-cell">{user.email}</td>
                                        <td className="py-2 px-4 hidden lg:table-cell">
                                            {user.status ? (
                                                <span className="text-green-600 font-semibold">Active</span>
                                            ) : (
                                                <span className="text-red-600 font-semibold">Inactive</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 flex items-center space-x-2">
                                            <button onClick={() => handleEdit(user)}
                                                    className="text-blue-600 hover:text-blue-800 focus:outline-none">
                                                <HiOutlinePencil size={20} />
                                            </button>
                                            <button onClick={() => handleDelete(user.id)}
                                                    className="text-red-600 hover:text-red-800 focus:outline-none">
                                                <HiOutlineTrash size={20} />
                                            </button>
                                            <div className="lg:hidden mt-2">
                                                <button
                                                    onClick={() => toggleRow(index)}
                                                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                                                >
                                                    {expandedRow === index ? (
                                                        <HiMinus size={20} />
                                                    ) : (
                                                        <HiPlus size={20} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {expandedRow === index && (
                                        <tr>
                                            <td colSpan={6} className="py-3 px-4 lg:hidden">
                                                <div className="flex flex-col space-y-2">
                                                    <div className="block sm:hidden md:hidden">
                                                        <span className="font-semibold">Username: </span>{user.username}
                                                    </div>

                                                    <div className="block md:hidden lg:hidden">
                                                        <span className="font-semibold">Email: </span>{user.email}
                                                    </div>

                                                    <div>
                                                        <span className="font-semibold">Status: </span>
                                                        {user.status ? (
                                                            <span className="text-green-600 font-semibold">Active</span>
                                                        ) : (
                                                            <span className="text-red-600 font-semibold">Inactive</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mt-2">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <span>
                            Showing {data?.from} to {data?.to} of {data?.total} entries
                        </span>
                        <select
                            className="form-select form-select-sm text-white-dark w-auto pr-6"
                            value={data?.per_page}
                            onChange={(e) => setUrl((prev) => {
                                const url = new URL(prev);
                                url.searchParams.set('per_page', e.target.value);
                                url.searchParams.set('page', '1');
                                return url.toString();
                            })}
                            >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <ul className="flex items-center space-x-1 rtl:space-x-reverse">
                        {data?.links.map((link, index) => (
                            <li key={index}>
                                <button
                                    type="button"
                                    onClick={() => link.url && setUrl(link.url)}
                                    className={`flex justify-center font-semibold px-3.5 py-2 rounded-full transition ${
                                        link.active ? 'bg-primary text-white dark:text-white-light dark:bg-primary' : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
                <Transition appear show={showModal} as={React.Fragment}>
                    <Dialog as="div" open={showModal} onClose={onClose}>
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-center justify-center px-4">
                                <Transition.Child
                                    as={React.Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div"
                                                  className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <div
                                            className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h5>
                                        </div>
                                        <form onSubmit={handleSubmit} className="p-4 text-sm">
                                            <div className="mb-4">
                                                <label htmlFor="fullName">Nama Lengkap</label>
                                                <input type="text" id="fullName" name="fullName" required
                                                       value={formData.fullName}
                                                       onChange={handleInputChange} placeholder="Masukkan Nama Lengkap"
                                                       className="form-input" />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="email">Email</label>
                                                <input type="email" id="email" name="email" required value={formData.email}
                                                       onChange={handleInputChange} placeholder="Masukkan Email"
                                                       className="form-input" />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="username">Username</label>
                                                <input type="text" id="username" name="username" required
                                                       value={formData.username}
                                                       onChange={handleInputChange} placeholder="Masukkan Username"
                                                       className="form-input" />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="password">Password</label>
                                                <input type="password" id="password" name="password" required={!isEditing}
                                                       value={formData.password}
                                                       onChange={handleInputChange} placeholder="Masukkan Password"
                                                       className="form-input" />
                                                <p className={'text-red-600 mt-1 text-xs'}> {isEditing ? '*Fill this field if you want change your password' : ''}</p>
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="image">Unggah Gambar (Opsional)</label>
                                                <input type="file" id="image" accept="image/*" onChange={handleFileChange}
                                                       className="form-input" />
                                                <p className={'text-red-600 mt-1 text-xs'}> {isEditing ? '*Upload the image if you want to change your image' : ''}</p>
                                            </div>
                                            <div className="flex justify-end">
                                                <button type="button"
                                                        className="mr-2 px-4 py-2 text-gray-600 bg-gray-200 rounded-md"
                                                        onClick={onClose}>Batal
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">{isEditing ? 'Simpan Perubahan' : 'Simpan'}
                                                </button>
                                            </div>
                                        </form>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
};

export default UserList;
