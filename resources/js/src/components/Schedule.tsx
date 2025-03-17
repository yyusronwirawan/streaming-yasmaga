import { useEffect, useState } from 'react';
// @ts-ignore
import bgBanner from "../assets/logo_prosehat.jpeg";
// @ts-ignore
import yasmagaLogo from "../assets/yasmaga_1.png"; // Import logo
import { day, schedule } from "../utils/dummyData";
import axios from 'axios';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt } from "react-icons/fa";
import { HiOutlinePhone } from 'react-icons/hi';

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
interface Promo {
    id: number;
    name: string;
    phone: string;
}

const Schedule = () => {
    const [selectedDay, setSelectedDay] = useState(day[0]);
    const [selectedDate, setSelectedDate] = useState('Senin');
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [filteredSchedule, setFilteredSchedule] = useState<Schedule[]>([]);
    const [logo, setLogo] = useState('logo');
    const [footer, setFooter] = useState('footer');
    const [promos, setPromos] = useState<Promo[]>([]);

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

    const updateLogo = async () => {
        const newLogo = await fetchContents(logo)
        setLogo(newLogo)
    };

    const updateFooter = async () => {
        const newFooter = await fetchContents(footer)
        setFooter(newFooter)
    };

    useEffect(() => {
        fetchSchedules();
        fetchPromos();
    }, [selectedDate]);

    useEffect(() => {
        if (logo === 'logo') {
            updateLogo()
        }
        if (footer === 'footer') {
            updateFooter()
        }
        filterSchedules(schedules);
    }, [selectedDay, schedules, logo, footer, promos]);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get('/api/schedules?per_page=0', {
                params: {
                    date: [selectedDate],
                },
            });
            setSchedules(response.data.data || []);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const fetchPromos = async () => {
        try {
            const response = await axios.get('/api/promos?per_page=0', {});
            setPromos(response.data.data || []);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const filterSchedules = (scheduleList: Schedule[]) => {
        const filtered = scheduleList.filter((item) => item.date === selectedDay);
        setFilteredSchedule(filtered.length > 0 ? filtered : []);
    };

    const handleDayClick = (item: string) => {
        if (item === "Jum'at") {
            item = "Jumat"
        }
        setSelectedDay(item);
        setSelectedDate(item);
    };

    return (
        <div className="bg-[#202020] px-[5%] pt-5 pb-20">
        <h1 className="capitalize font-bold text-lg text-white mb-4">
            Streaming Pro Sehat
        </h1>

        <div className="flex items-center gap-5 text-white mb-6">
            <img
                src={bgBanner}
                alt="Streaming Pro Sehat"
                className="w-16 h-16 rounded-lg"
            />
            <div>
            <p className="text-sm font-bold text-Gainsboro">
                Pro Sehat
            </p>

            <p className="text-xs text-Gainsboro/70 mb-4 text-gray-300">
                Pro Sehat merupakan herbal modern yang praktis, didalamnya kaya akan berbagai jenis herbal, sehingga hadir sebagai solusi bagi berbagai macam penyakit dan juga untuk menjaga kesehatan tubuh. Terdapat 5 varian produk: H Pro, G Pro, R Pro, La Pro dan Ci Pro.
            </p>
            </div>
        </div>

            <p className="capitalize font-bold text-lg text-white mb-4">
                Jadwal Radio Yasmaga FM 96.9 MHz
            </p>

            <div className="flex items-center gap-5 text-white mt-8 overflow-x-auto pb-4">
                {day.map((item, index) => (
                    <p
                        key={index}
                        className={`cursor-pointer border-b-2 ${
                            (item === selectedDay || (item === "Jum'at" && selectedDay === "Jumat"))
                                ? 'border-b-[#FAD810]'
                                : 'border-b-transparent'
                        }`}
                        onClick={() => handleDayClick(item === 'Jumat' ? "Jum'at" : item)}
                    >
                        {item === 'Jumat' ? "Jum'at" : item}
                    </p>
                ))}

            </div>

            <div className="mt-5 space-y-4">
                {filteredSchedule.length > 0 ? (
                    filteredSchedule.map((item, index) => (
                        <div key={index}>
                            <div className="bg-Gainsboro/5 text-white px-[4%] md:px-[1%] h-9 flex items-center rounded-t-md bg-[#2B2B2B]">
                                <p>
                                    {item.time} WIB
                                </p>
                            </div>

                            <div className="flex items-center gap-3 bg-[#2A2A2A] p-3 rounded-b-md min-h-18">
                                <img
                                    src={item.image ? `/storage/${item.image}` : '/assets/images/content.webp'}
                                    alt={item.name}
                                    className="h-16 rounded-lg"
                                />
                                <div>
                                    <p className="text-sm font-bold text-white">{item.name}</p>
                                    <p className="text-xs text-Gainsboro/70 text-gray-300">{selectedDay === 'Jumat' ? "Jum'at" : selectedDay}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-white text-center">
                        Tidak Ada Jadwal Untuk Hari {selectedDay}.
                    </div>
                )}
            </div>

            <div className="bg-[#202020] pt-2 pb-2"></div>
            <h1 className="capitalize font-bold text-lg text-white mb-2">
                Jaringan Pro Sehat
            </h1>

            {promos.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-6">
                    {promos.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#2b2b2b] text-white hover:bg-[#e61919] transition-colors duration-300 ease-in-out rounded-full px-3 py-2 text-center shadow-sm"
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-gray-900 dark:text-white text-center text-xl font-bold mt-12">
                    Tidak Ada Data Promosi.
                </div>
            )}

            <div style={{ paddingBottom: "13px", marginTop: "10px" }}></div>
            {/* Title */}
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>
                Kontak Pro Sehat
            </p>
            {/* Header icons */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "white",
                    padding: "12px 1px",
                }}
            >
                <div>
                    {/* Phone */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <a 
                            href="https://wa.me/6281234567890?text=Halo%20Bapak/Ibu.%0A%0APro%20Sehati%20adalah%20sebuah%20layanan%20kesehatan%20yang%20berfokus%20pada%20pemberian%20informasi%20dan%20solusi%20kesehatan%20terpercaya%20untuk%20masyarakat.%20Berikut%20nomor%20CALL%20CENTER%20yang%20dapat%20dihubungi%20untuk%20konsultasi%20lebih%20lanjut:%0A%0ACALL%20CENTER%20:%20082140347772%20&%20082140347772%0ABANYUWANGI%20:%20081234701692%0AJEMBER%20:082338019096%0ALUMAJANG%20:%20082232155118%0ABOJONEGORO%20:082244880169%0AMADIUN%20:085235031111%20&%20081359523373%0APONOROGO%20:08113375559%0ATRENGGALEK%20:085330103777%20&%20085330103777%0APACITAN,%20KEDIRI%20:087758700600%0ASOLO%20RAYA%20:081548314892%20&%20082134821529%0AMEDAN%20:082267673597%0ALAMPUNG%20:081227645225%0APADANG%20:085263830072" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ display: "flex", alignItems: "center", gap: "8px" }}
                        >
                            <HiOutlinePhone size={15} />
                            <span style={{ fontSize: "14px" }}>082140347772</span>
                        </a>
                    </div>
                    {/* Location */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                        <FaMapMarkerAlt size={15} />
                        <span style={{ fontSize: "14px" }}>Tower Berkeley, CitraLand, Made, Kec. Sambikerep, Surabaya, Jawa Timur 60219</span>
                    </div>
                </div>

                {/* Social Media Icons */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <a href="https://wa.me/6282140347772?text=Hello%20I%20would%20like%20to%20inquire%20about%20your%20services" target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
                        <FaWhatsapp size={15} />
                    </a>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
                        <FaFacebookF size={15} />
                    </a>
                    <a href="https://www.instagram.com/yasmagafm" target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
                        <FaInstagram size={15} />
                    </a>
                </div>
            </div>

            <footer className="mt-10 md:pb-4">
                <div className="flex flex-col items-center justify-center">
                    <img
                        src={logo !== 'logo' ? `/storage/${logo}` : yasmagaLogo}
                        alt="Yasmaga Logo"
                        className="h-20 rounded-md mb-4"
                    />
                    <p className="text-xs text-Gainsboro/70 text-gray-300">
                        {footer === 'footer' ? '© ' : '© ' + footer}
                        {/*© 2024 Radio Yasmaga 96.90 FM Mhz v1.1.0*/}
                    </p>
                </div>
            </footer>
            </div>
    );
};

export default Schedule;
