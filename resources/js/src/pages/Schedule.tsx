import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HiPlus, HiMinus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import sweetAlert from 'sweetalert2';
import { Dialog, Transition } from '@headlessui/react';
import { Response } from '../utils/types';

interface Schedule {
    id: number;
    name: string;
    date: string;
    time: string;
    created_by: string;
    updated_by: string;
    description: string;
    image?: string;
}

const Schedule: React.FC = () => {
    const [url, setUrl] = useState(() => {
        const url = new URL(window.location.href);
        url.pathname = '/api/schedules';
        return url.toString();
    });
    const [data, setData] = useState<Response<Schedule> | null>(null);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        date: string;
        time: string;
        created_by: string;
        updated_by: string;
        description: string;
        image: File | null;
    }>({
        name: '',
        date: '',
        time: '',
        created_by: '',
        updated_by: '',
        description: '',
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
        fetchSchedules();
    }, [url]);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get(url);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const toggleRow = (index: number) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    const onClose = () => {
        setShowModal(false);
        setIsEditing(false);
        setCurrentSchedule(null);
        setFormData({ name: '', date: '', time: '', created_by: '', updated_by: '', description: '', image: null });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            const input = e.target as HTMLInputElement;
            const value = input.value;

            if (value.endsWith(':') && value.length === 3) {
                input.value = value.slice(0, -2);
                e.preventDefault();
            }
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        const { value } = e.target;

        let newValue = value.replace(/[^0-9:]/g, '');

        if (isEditing) {
            if (newValue.length === 2 && !newValue.includes(':')) {
                newValue += ':';
            }

            const parts = newValue.split(':');

            if (parts.length > 2) {
                newValue = newValue.slice(0, -1);
            } else if (parts[0].length > 2 || (parts[0].length === 2 && parseInt(parts[0]) > 23)) {
                newValue = parts[0].slice(0, 2);
            } else if (parts[1] && (parts[1].length > 2 || (parts[1].length === 2 && parseInt(parts[1]) > 59))) {
                newValue = newValue.slice(0, -1);
            }

            setFormData((prev) => {
                const [startTime, endTime] = prev.time.split(' - ').map((time) => time.trim());

                let newStartTime = startTime;
                let newEndTime = endTime;

                if (name === 'startTime') {
                    newStartTime = newValue;
                } else if (name === 'endTime') {
                    newEndTime = newValue;
                }

                return {
                    ...prev,
                    time: `${newStartTime || ''} - ${newEndTime || ''}`.trim(),
                };
            });
        } else {
            if (newValue.length === 2 && !newValue.includes(':')) {
                e.target.value = newValue + ':';
                return;
            }

            const parts = newValue.split(':');

            if (parts.length > 2) {
                e.target.value = newValue.slice(0, -1);
                return;
            }

            if (parts[0].length > 2 || (parts[0].length === 2 && parseInt(parts[0]) > 23)) {
                e.target.value = parts[0].slice(0, 2);
                return;
            }

            if (parts[1] && (parts[1].length > 2 || (parts[1].length === 2 && parseInt(parts[1]) > 59))) {
                e.target.value = newValue.slice(0, -1);
                return;
            }

            e.target.value = newValue;

            setFormData((prev) => {
                const [startTime, endTime] = prev.time.split(' - ');

                let newStartTime = startTime;
                let newEndTime = endTime;

                if (name === 'startTime') {
                    newStartTime = value || newValue;
                } else if (name === 'endTime') {
                    newEndTime = value || newValue;
                }

                return {
                    ...prev,
                    time: `${newStartTime} - ${newEndTime}`
                };
            });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        const value = input.value;

        if (value.length === 1) {
            input.value = value + '0:00';
        } else if (value.length === 3 && value.endsWith(':')) {
            input.value = value + '00';
        } else if (value.length === 4 && value[2] === ':') {
            input.value = value + '0';
        }
    };

    const getStartTime = (): string => {
        if (formData.time && isEditing) {
            const [startTime] = formData.time.split('-').map(time => time.trim());
            return startTime;
        } else {
            return ''
        }
    };

    const getEndTime = (): string => {
        if (formData.time) {
            const parts = formData.time.split('-').map(time => time.trim());
            return parts.length > 1 ? parts[1] : '';
        } else {
            return ''
        }
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
        const { name, date, time, created_by, updated_by, description, image } = formData;

        const schedulePayload = { name: name, date, time, created_by, updated_by, description };

        try {
            const formDataObj = new FormData();
            Object.keys(schedulePayload).forEach((key) => {
                formDataObj.append(key, schedulePayload[key as keyof typeof schedulePayload]);
            });
            if (image) {
                formDataObj.append('image', image);
            }

            if (isEditing && currentSchedule) {
                try {
                    await axios.post(`/api/schedules/${currentSchedule.id}/update`, formDataObj);
                    await sweetAlert.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Schedule updated successfully!',
                        timer: 2000,
                        confirmButtonColor: '#3085d6',
                    });
                } catch (error) {
                    await sweetAlert.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Could not update the schedule. Please try again.',
                        timer: 2000,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    });
                }
            } else {
                try {
                    await axios.post('/api/schedules', formDataObj);
                    await sweetAlert.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Schedule created successfully!',
                        timer: 2000,
                        confirmButtonColor: '#3085d6',
                    });
                } catch (error) {
                    await sweetAlert.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Could not save schedule. Please try again.',
                        timer: 2000,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    });
                }
            }
            fetchSchedules();
            onClose();
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    };

    const handleEdit = (schedule: Schedule) => {
        setCurrentSchedule(schedule);
        setFormData({
            name: schedule.name,
            date: schedule.date,
            time: schedule.time,
            created_by: schedule.created_by,
            updated_by: schedule.updated_by,
            description: schedule.description,
            image: null });
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
                await axios.delete(`/api/schedules/${id}`);
                setUrl((prev) => {
                    const url = new URL(prev);
                    url.searchParams.set('page', '1');
                    return url.toString();
                })
                await sweetAlert.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Your schedule has been deleted.',
                    timer: 2000,
                    confirmButtonColor: '#3085d6',
                });
            } catch (error) {
                console.error('Error deleting schedule:', error);
                await sweetAlert.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Could not delete schedule. Please try again.',
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
                        <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" stroke="currentColor" strokeWidth="1.5"></path>
                        <path opacity="0.5" d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                        <path opacity="0.5" d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                        <path opacity="0.5" d="M2 9H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                    </svg>
                </button>
            </li>
            <li className="before:content-['/'] before:px-1.5">
                <button type="button">Data Jadwal</button>
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
                    Tambah Jadwal
                </button>

                <div
                    className="overflow-x-auto shadow-md rounded-lg border border-white-light/40 dark:border-[#191e3a]">
                    <table className="min-w-full table-auto table-hover">
                        <thead>
                        <tr>
                            <th className="py-3 px-2 md text-left">
                            <span className={"ml-2"}>
                                No
                            </span>
                            </th>
                            <th className="py-3 px-4 text-left">
                            <span className={'sm:ml-8 md:ml-10 lg:ml-12'}>
                                Nama Jadwal
                            </span>
                            </th>
                            <th className="py-3 px-4 text-left hidden sm:table-cell">Hari</th>
                            <th className="py-3 px-4 text-left hidden md:table-cell">Waktu Siaran</th>
                            <th className="py-3 px-4 text-left hidden lg:table-cell">Dibuat Oleh</th>
                            <th className="py-3 px-4 text-left">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {!data?.data || data.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-4 text-center text-gray-500">
                                    No schedules found.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((schedule, index) => (
                                <React.Fragment key={schedule.id}>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-4 flex items-center gap-4">
                                            <span className={"w-2"}>
                                                {index + 1}
                                            </span>
                                            <img
                                                src={schedule.image ? `/storage/${schedule.image}` : '/assets/images/content.webp'}
                                                alt={schedule.name}
                                                className="h-16 object-contain rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4">
                                        <span className={'sm:ml-8 md:ml-10 lg:ml-12'}>
                                            {schedule.name}
                                        </span>
                                        </td>
                                        <td className="py-2 px-4 hidden sm:table-cell">{schedule.date}</td>
                                        <td className="py-2 px-4 hidden md:table-cell">{schedule.time} WIB</td>
                                        <td className="py-2 px-4 hidden lg:table-cell">{schedule.created_by}</td>
                                        <td className="py-4 px-4 flex items-center space-x-2">
                                            <button onClick={() => handleEdit(schedule)}
                                                    className="text-blue-600 hover:text-blue-800 focus:outline-none">
                                                <HiOutlinePencil size={20} />
                                            </button>
                                            <button onClick={() => handleDelete(schedule.id)}
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
                                                        <span className="font-semibold">Hari: </span>{schedule.date}
                                                    </div>

                                                    <div className="block md:hidden lg:hidden">
                                                        <span
                                                            className="font-semibold">Waktu Siaran: </span>{schedule.time} WIB
                                                    </div>

                                                    <div>
                                                        <span
                                                            className="font-semibold">Dibuat Oleh: </span>{schedule.created_by}
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
                                            <h5 className="text-lg font-bold">{isEditing ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h5>
                                        </div>
                                        <form onSubmit={handleSubmit} className="p-4 text-sm">
                                            <div className="mb-4">
                                                <label htmlFor="name">Nama Jadwal</label>
                                                <input type="text" id="name" name="name" required value={formData.name}
                                                       onChange={handleInputChange} placeholder="Masukkan Nama Jadwal"
                                                       className="form-input" />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="date">Hari</label>
                                                <select
                                                    id="date"
                                                    name="date"
                                                    required
                                                    value={formData.date}
                                                    onChange={handleSelectChange}
                                                    className="form-input"
                                                >
                                                    <option value="">Pilih Hari</option>
                                                    <option value="Senin">Senin</option>
                                                    <option value="Selasa">Selasa</option>
                                                    <option value="Rabu">Rabu</option>
                                                    <option value="Kamis">Kamis</option>
                                                    <option value="Jumat">Jumat</option>
                                                    <option value="Sabtu">Sabtu</option>
                                                    <option value="Minggu">Minggu</option>
                                                </select>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="time">
                                                    Jam
                                                </label>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="text"
                                                        id="startTime"
                                                        name="startTime"
                                                        required
                                                        value={isEditing ? getStartTime() : undefined}
                                                        onChange={handleTimeChange}
                                                        onKeyDown={handleKeyDown}
                                                        onBlur={handleBlur}
                                                        className="form-input"
                                                        placeholder="HH:mm"
                                                        maxLength={5}
                                                        minLength={5}
                                                    />
                                                    <span className="text-gray-700">-</span>
                                                    <input
                                                        type="text"
                                                        id="endTime"
                                                        name="endTime"
                                                        required
                                                        value={isEditing ? getEndTime() : undefined}
                                                        onChange={handleTimeChange}
                                                        onKeyDown={handleKeyDown}
                                                        onBlur={handleBlur}
                                                        className="form-input"
                                                        placeholder="HH:mm"
                                                        maxLength={5}
                                                        minLength={5}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="image">Gambar
                                                    (optional)</label>
                                                <input type="file" id="image" accept="image/*"
                                                       onChange={handleFileChange}
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

export default Schedule;
