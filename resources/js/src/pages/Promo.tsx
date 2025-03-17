import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HiPlus, HiMinus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import sweetAlert from 'sweetalert2';
import { Dialog, Transition } from '@headlessui/react';
import { Response } from '../utils/types';

interface Promo {
    id: number;
    name: string;
    phone: string;
}

const PromoList: React.FC = () => {
    const [url, setUrl] = useState(() => {
        const url = new URL(window.location.href);
        url.pathname = '/api/promos';
        return url.toString();
    });
    const [data, setData] = useState<Response<Promo> | null>(null);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentPromo, setCurrentPromo] = useState<Promo | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        phone: string;
    }>({
        name: '',
        phone: '',
    });

    useEffect(() => {
        const checkAuth = async () => {
            const response = await axios.get('/api/auth-check');
            if (!response.data.authenticated) {
                window.location.href='/login';
                return;
            }
        };

        checkAuth();
        fetchPromos();
    }, [url]);

    const fetchPromos = async () => {
        try {
            const response = await axios.get(url);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching promos:', error);
        }
    };

    const toggleRow = (index: number) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    const onClose = () => {
        setShowModal(false);
        setIsEditing(false);
        setCurrentPromo(null);
        setFormData({ name: '', phone: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, phone } = formData;

        const userPayload = { name, phone };

        try {
            const formDataObj = new FormData();
            Object.keys(userPayload).forEach((key) => {
                formDataObj.append(key, userPayload[key as keyof typeof userPayload]);
            });

            if (isEditing && currentPromo) {
                try {
                    await axios.post(`/api/promos/${currentPromo.id}/update`, formDataObj);
                    await sweetAlert.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Data promosi berhasil diupdate!',
                        timer: 2000,
                        confirmButtonColor: '#3085d6',
                    });
                } catch (error) {
                    await sweetAlert.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Tidak dapat mengupdate data promosi. Harap coba lagi.',
                        timer: 2000,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    });
                }
            } else {
                try {
                    await axios.post('/api/promos', formDataObj);
                    await sweetAlert.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Data promosi berhasil dibuat!',
                        timer: 2000,
                        confirmButtonColor: '#3085d6',
                    });
                } catch (error) {
                    await sweetAlert.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Tidak dapat menyimpan data promosi. Harap coba lagi.',
                        timer: 2000,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    });
                }
            }
            fetchPromos();
            onClose();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleEdit = (promo: Promo) => {
        setCurrentPromo(promo);
        setFormData({
            name: promo.name,
            phone: promo.phone,
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        const result = await sweetAlert.fire({
            title: 'Anda yakin?',
            text: 'Kamu tidak akan bisa membatalkan ini!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Tidak',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/promos/${id}`);
                setUrl((prev) => {
                    const url = new URL(prev);
                    url.searchParams.set('page', '1');
                    return url.toString();
                })
                await sweetAlert.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Data promosi berhasil dihapus.',
                    timer: 2000,
                    confirmButtonColor: '#3085d6',
                });
            } catch (error) {
                console.error('Error deleting promo:', error);
                await sweetAlert.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Tidak bisa menghapus data promosi. Harap coba lagi.',
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
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                        <path d="M18.18 8.03933L18.6435 7.57589C19.4113 6.80804 20.6563 6.80804 21.4241 7.57589C22.192 8.34374 22.192 9.58868 21.4241 10.3565L20.9607 10.82M18.18 8.03933C18.18 8.03933 18.238 9.02414 19.1069 9.89309C19.9759 10.762 20.9607 10.82 20.9607 10.82M18.18 8.03933L13.9194 12.2999C13.6308 12.5885 13.4865 12.7328 13.3624 12.8919C13.2161 13.0796 13.0906 13.2827 12.9882 13.4975C12.9014 13.6797 12.8368 13.8732 12.7078 14.2604L12.2946 15.5L12.1609 15.901M20.9607 10.82L16.7001 15.0806C16.4115 15.3692 16.2672 15.5135 16.1081 15.6376C15.9204 15.7839 15.7173 15.9094 15.5025 16.0118C15.3203 16.0986 15.1268 16.1632 14.7396 16.2922L13.5 16.7054L13.099 16.8391M13.099 16.8391L12.6979 16.9728C12.5074 17.0363 12.2973 16.9867 12.1553 16.8447C12.0133 16.7027 11.9637 16.4926 12.0272 16.3021L12.1609 15.901M13.099 16.8391L12.1609 15.901" stroke="currentColor" strokeWidth="1.5"></path><path d="M8 13H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path><path d="M8 9H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path><path d="M8 17H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path><path opacity="0.5" d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z" stroke="currentColor" strokeWidth="1.5"></path></svg>
                    </button>
                </li>
                <li className="before:content-['/'] before:px-1.5">
                    <button type="button">Data Promosi</button>
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
                    Tambah Promosi
                </button>

                <div
                    className="overflow-x-auto shadow-md rounded-lg border border-white-light/40 dark:border-[#191e3a]">
                    <table className="min-w-full table-auto table-hover">
                        <thead>
                        <tr>
                            <th className="py-3 px-4 text-left">No</th>
                            <th className="py-3 px-4 text-left">Nama Kota</th>
                            <th className="py-3 px-4 text-left hidden sm:table-cell">Nomor Telepon</th>
                            <th className="py-3 px-4 text-left">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {!data?.data || data.data.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-4 text-center text-gray-500">
                                    Tidak ada data promosi.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((promo, index) => (
                                <React.Fragment key={promo.id}>
                                    <tr>
                                        <td className="py-2 px-4">{index + 1}</td>
                                        <td className="py-2 px-4">{promo.name}</td>
                                        <td className="py-2 px-4 hidden sm:table-cell">{promo.phone}</td>
                                        <td className="py-4 px-4 flex items-center space-x-2">
                                            <button onClick={() => handleEdit(promo)}
                                                    className="text-blue-600 hover:text-blue-800 focus:outline-none">
                                                <HiOutlinePencil size={20} />
                                            </button>
                                            <button onClick={() => handleDelete(promo.id)}
                                                    className="text-red-600 hover:text-red-800 focus:outline-none">
                                                <HiOutlineTrash size={20} />
                                            </button>
                                            <div className="lg:hidden mt-2">
                                                <button
                                                    onClick={() => toggleRow(index)}
                                                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                                                >
                                                    {expandedRow === index ? <HiMinus size={20} /> :
                                                        <HiPlus size={20} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {expandedRow === index && (
                                        <tr>
                                            <td colSpan={4} className="py-3 px-4 lg:hidden">
                                                <div className="flex flex-col space-y-2">
                                                    <div className="block sm:hidden md:hidden">
                                                        <p>Nomor Telepon: {promo.phone}</p>
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
                                            <h5 className="text-lg font-bold">{isEditing ? 'Edit Promo' : 'Tambah Promosi'}</h5>
                                        </div>
                                        <form onSubmit={handleSubmit} className="p-4 text-sm">
                                            <div className="mb-4">
                                                <label htmlFor="name">
                                                    Nama Kota
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Masukkan Nama Kota"
                                                    required
                                                    className="form-input"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="phone">
                                                    Nomor Telepon
                                                </label>
                                                <input
                                                    type="number"
                                                    name="phone"
                                                    id="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="Masukkan Nomor Telepon"
                                                    required
                                                    className="form-input"
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <button type="button"
                                                        className="mr-2 px-4 py-2 text-gray-600 bg-gray-200 rounded-md"
                                                        onClick={onClose}>Batal
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                                    {isEditing ? 'Simpan Perubahan' : 'Simpan'}
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

export default PromoList;
