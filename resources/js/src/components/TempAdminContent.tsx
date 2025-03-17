import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import sweetAlert from 'sweetalert2';

interface Content {
    id?: number;
    name: string;
    metadata: {
        image?: File | null;
        type: string;
        value: string;
    };
}

const AdminContent: React.FC = () => {
    const [contents, setContents] = useState<Content[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentContent, setCurrentContent] = useState<Content | null>(null);
    const [formData, setFormData] = useState<Content>({
        name: '',
        metadata: {
            image: null,
            type: '',
            value: '',
        },
    });

    useEffect(() => {
        fetchContents();
    }, [showModal]);

    const fetchContents = async () => {
        try {
            const response = await axios.get('/api/contents');
            if (response.data && response.data.contents) {
                const contentsWithParsedMetadata = response.data.contents.map((content: any) => ({
                    ...content,
                    metadata: JSON.parse(content.metadata) as {
                        image?: string | null;
                        type: string;
                        value: string;
                    },
                }));
                setContents(contentsWithParsedMetadata);
            }
        } catch (error) {
            console.error('Error fetching contents:', error);
        }
    };

    const onClose = () => {
        setShowModal(false);
        setIsEditing(false);
        setCurrentContent(null);
        setFormData({
            name: '',
            metadata: {
                image: null,
                type: '',
                value: '',
            },
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                type: value,
                value: '', // Reset the value field when the type changes
            },
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                metadata: {
                    ...prev.metadata,
                    image: files[0],
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                metadata: {
                    ...prev.metadata,
                    image: null,
                },
            }));
        }
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, metadata } = formData;
        const contentPayload = { name, metadata };

        try {
            const formDataObj = new FormData();
            formDataObj.append('name', contentPayload.name);
            formDataObj.append('type', contentPayload.metadata.type);
            formDataObj.append('value', metadata.image ? 'image' : contentPayload.metadata.value);

            if (metadata.image) {
                formDataObj.append('image', metadata.image);
            }

            if (isEditing && currentContent) {
                try {
                    await axios.post(`/api/contents/${currentContent.id}/update`, formDataObj);
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
                        cancelButtonColor: '#d33',
                    });
                }
            } else {
                try {
                    await axios.post('/api/contents', formDataObj);
                    await sweetAlert.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Content created successfully!',
                        timer: 2000,
                        confirmButtonColor: '#3085d6',
                    });
                } catch (error) {
                    await sweetAlert.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Could not save content. Please try again.',
                        timer: 2000,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    });
                }
            }
            fetchContents();
            onClose();
        } catch (error) {
            console.error('Error saving content:', error);
        }
    };

    const handleEdit = (content: Content) => {
        setCurrentContent(content);
        setFormData({
            name: content.name,
            metadata: {
                image: null,
                type: content.metadata.type,
                value: content.metadata.value,
            },
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
                await axios.delete(`/api/contents/${id}`);
                fetchContents();
                await sweetAlert.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Your content has been deleted.',
                    timer: 2000,
                    confirmButtonColor: '#3085d6',
                });
            } catch (error) {
                console.error('Error deleting schedule:', error);
                await sweetAlert.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Could not delete content. Please try again.',
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                        <path d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z" stroke="currentColor" strokeWidth="1.5"></path>
                        <path opacity="0.5" d="M6 10V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                    </svg>
                </button>
            </li>
            <li className="before:content-['/'] before:px-1.5">
                <button type="button">Pengaturan</button>
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
                Tambah Konten Baru
            </button>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100 text-black font-bold">
                    <tr>
                        <th className="py-3 px-4 text-left">No</th>
                        <th className="py-3 px-4 text-left">Nama Konten</th>
                        <th className="py-3 px-4 text-left">Type</th>
                        <th className="py-3 px-4 text-left">Value</th>
                        <th className="py-3 px-1 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {contents.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="py-4 text-center text-gray-500">
                                No contents found.
                            </td>
                        </tr>
                    ) : (
                        contents.map((content, index) => (
                            <tr key={content.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4">{index + 1}</td>
                                <td className="py-3 px-4">{content.name}</td>
                                <td className="py-3 px-4">
                                    {content.metadata.image ? 'image' : 'text'}
                                </td>
                                <td className="py-3 px-4">
                                    {content.metadata.image ? (
                                        <img
                                            src={`/storage/${content.metadata.image}`}
                                            className="w-16 h-16 object-cover rounded ml-3 sm:ml-2 mr-10 md:-mr-8 lg:-mr-20"
                                            alt="Content"
                                        />
                                    ) : (
                                        content.metadata.value
                                    )}
                                </td>
                                <td className="py-4 px-1 flex items-center space-x-2">
                                    <div className={"mt-3"}>
                                        <button onClick={() => handleEdit(content)}
                                                className="text-blue-600 hover:text-blue-800 focus:outline-none">
                                            <HiOutlinePencil size={20} />
                                        </button>
                                        <button onClick={() => handleDelete(content.id!)}
                                                className="text-red-600 hover:text-red-800 focus:outline-none ml-2">
                                            <HiOutlineTrash size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
                    <div className="w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-800">{isEditing ? 'Edit Konten' : 'Tambah Konten Baru'}</h2>
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Konten</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipe</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.metadata.type}
                                    onChange={handleSelectChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Pilih Tipe</option>
                                    <option value="string">Text</option>
                                    <option value="image">Image</option>
                                </select>
                            </div>
                            {formData.metadata.type === 'text' || formData.metadata.type === 'string' && (
                                <div className="mb-4">
                                    <label htmlFor="value" className="block text-sm font-medium text-gray-700">Nilai</label>
                                    <input
                                        type="text"
                                        id="value"
                                        name="value"
                                        value={formData.metadata.value}
                                        onChange={handleValueChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            )}
                            {formData.metadata.type === 'image' && (
                                <div className="mb-4">
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Unggah
                                        Gambar</label>
                                    <input
                                        type="file"
                                        id="image"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                <p className={'text-red-600 mt-1 text-xs'}> {isEditing ? '*Upload the image if you want to change your image' : ''}</p>
                                </div>
                            )}
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="mr-2 text-gray-500 hover:text-gray-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                                >
                                    {isEditing ? 'Update Konten' : 'Simpan Konten'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default AdminContent;
