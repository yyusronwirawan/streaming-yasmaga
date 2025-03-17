import { FaRegSquare } from 'react-icons/fa';
// @ts-ignore
import bgBanner from '../assets/content.webp';
import { IoPlayOutline, IoShareSocialOutline } from 'react-icons/io5';
import { SlEarphones } from 'react-icons/sl';
import { BsChatRightText } from 'react-icons/bs';
import { useAtom } from 'jotai';
import { storePlayPause } from '../router';
import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';
// @ts-ignore
import newsIcon from '../assets/news.svg';
import { useState, useEffect } from 'react';
import axios from 'axios';
import app from '../App';
import Header from './Header';
import Schedule from './Schedule';
import BottomBar from './BottomBar';
import AudioSpectrum from 'react-audio-spectrum';
import { FaWhatsapp } from 'react-icons/fa';
import { useAudioPlayer } from '../utils/use-audio-player';

const Banner = () => {
    const [isFavorited, setIsFavorited] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    // const [applicationName, setApplicationName] = useState('nama aplikasi');
    const [logo, setLogo] = useState('logo');
    const [streamUrl, setStreamUrl] = useState('stream url');
    const [isLoaded, setIsLoaded] = useState(true);
    const audioPlayer = useAudioPlayer();

    // const streamUrl = "https://stream-152.zeno.fm/kfp2ghnat18uv";

    useEffect(() => {
        // if (applicationName === 'nama aplikasi') {
        //     updateApplicationName()
        // }

        const fetchContentData = async () => {
            const newLogo = await fetchContents('logo');
            const newUrl = await fetchContents('stream url');

            setLogo(newLogo);
            setStreamUrl(newUrl);
            setIsLoaded(false);
        };

        if (isLoaded) {
            fetchContentData();
        }
    }, [logo, streamUrl, isLoaded]);

    const fetchContents = async (name: string): Promise<string> => {
        try {
            const response = await axios.get('/api/contents', {
                params: {
                    name: name
                }
            });
            if (response.data && response.data.contents) {
                const contentsWithParsedMetadata = response.data.contents.map((content: any) => ({
                    ...content,
                    metadata: JSON.parse(content.metadata) as {
                        image?: string | null;
                        type: string;
                        value: string;
                    }
                }));
                if (contentsWithParsedMetadata[0].metadata.type === 'image') {
                    return contentsWithParsedMetadata[0].metadata.image;
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

    function play() {
        if (!isLoaded && audioPlayer.status === 'idle') {
            audioPlayer.play(streamUrl);
            return;
        }

        if (audioPlayer.status === 'playing') {
            audioPlayer.pause();
            return;
        }

        audioPlayer.play();
    }

    // const updateApplicationName = async () => {
    //   const newName = await fetchContents(applicationName)
    //   setApplicationName(String(newName))
    // };

    const toggleFavorite = () => {
        setIsFavorited(!isFavorited);
    };

    const handleShare = () => {
        const shareUrl = "https://yasmaga.com";
        navigator.clipboard.writeText(shareUrl);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
    };

    return (
        <div
            className="w-screen flex flex-col justify-center items-center relative lg:bg-center bg-no-repeat px-[5%]"
            style={{ backgroundImage: `url(${bgBanner})`, backgroundSize: '100%' }}
        >
            <div
                className="absolute top-0 left-0 w-full h-full"
                // style={{
                //     background:
                //         'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 100%)',
                // }}
            >
                <div className="sm:hidden absolute w-full h-full"
                     style={{
                         background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 35%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 100%)'
                     }}>
                </div>
                <div className="hidden sm:block md:hidden absolute w-full h-full"
                     style={{
                         background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 1) 100%)'
                     }}>
                </div>
                <div className="hidden md:block absolute w-full h-full"
                     style={{
                         background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 100%)'
                     }}>
                </div>
            </div>


            <div className="absolute inset-0 bg-gradientMobile md:bg-gradientDesktop" />

            <div className="absolute inset-0">
                {audioPlayer.audio && <AudioSpectrum
                    id="audio-canvas"
                    height={340}
                    width={window.innerWidth}
                    meterWidth={5}
                    meterColor="#FFF"
                    audioEle={audioPlayer.audio}
                />}
            </div>

            <div className="relative flex flex-col gap-5 w-full">
                {isLoaded ? (
                    <div
                        className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                        <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg"
                             fill="#4361ee">
                            <path
                                d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                                <animateTransform attributeName="transform" type="rotate" from="0 67 67"
                                                  to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
                            </path>
                            <path
                                d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                                <animateTransform attributeName="transform" type="rotate" from="0 67 67"
                                                  to="360 67 67" dur="8s" repeatCount="indefinite" />
                            </path>
                        </svg>
                    </div>
                ) : (
                    <div className="w-[130px] h-[130px] mt-32 mx-auto overflow-hidden rounded-lg">
                        <img
                            src={logo !== 'logo' ? `/storage/${logo}` : bgBanner}
                            alt="Banner"
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}

                <div className="flex flex-col gap-2 items-center">
                    <div
                        onClick={play}
                        className="w-12 h-12 z-10 bg-white rounded-full flex justify-center items-center cursor-pointer text-black"
                    >
                        {audioPlayer.status === 'playing' ? <FaRegSquare size={32} /> : <IoPlayOutline size={32} />}
                    </div>
                </div>
                <p className="text-sm text-center text-white">
                    Radio Yasmaga FM 96.9 MHz adalah salah satu stasiun radio FM yang ada di wilayah kabupaten
                    Ponorogo. Radio Yasmaga FM 96.9 MHz menjadi alternatif pilihan radio yang memberi hiburan, informasi dan
                    edukasi, sehingga radio ini memiliki banyak pendengar setia.
                </p>

                <div className="flex items-center w-full text-white gap-5 md:gap-10 mt-10">
                    <div
                        onClick={toggleFavorite}
                        className="flex items-center justify-center gap-4 border border-white w-full py-2 rounded-[4px] cursor-pointer"
                    >
                        {isFavorited ? (
                            <IoIosHeart
                                className="text-red-500 transition-transform duration-300 transform scale-125" />
                        ) : (
                            <IoIosHeartEmpty className="text-white transition-transform duration-300" />
                        )}
                        <p className="text-xs font-bold uppercase">FAVORIT</p>
                    </div>

                    <label
                        onClick={handleShare}
                        className="flex items-center mb-0 justify-center gap-4 border border-white w-full py-2 rounded-[4px] cursor-pointer"
                    >
                        <IoShareSocialOutline />
                        <p className="text-xs font-bold uppercase">BAGIKAN</p>
                    </label>
                </div>

                <div className="w-full bg-[#202020] rounded-lg flex items-center p-3 lg:px-20 lg:py-5 gap-3 lg:gap-20">
                    <div className="min-w-20 w-20 h-20 overflow-hidden rounded-lg">
                        <img src={bgBanner} alt="Mini Banner" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-white flex flex-col gap-3">
                        <div className="flex items-start gap-[10px]">
                            <p className="rounded-lg border border-[#FAD810] text-[#F9CF5F] text-[10px] font-bold capitalize py-[2px] px-1">
                                Live
                            </p>
                            <p className="text-sm font-bold text-Gainsboro">
                                 Radio Yasmaga FM 96.9 MHz
                            </p>
                        </div>
                        <p className="text-xs text-Gainsboro/70 mb-4 text-gray-300">
                            Radio Yasmaga FM 96.9 MHz Ponorogo adalah salah satu stasiun radio FM yang ada di wilayah
                            kabupaten Ponorogo. Radio Yasmaga FM 96.9 MHz menjadi alternatif pilihan radio yang memberi hiburan,
                            informasi dan edukasi, sehingga radio ini memiliki banyak pendengar setia.
                        </p>
                        <div className="flex items-center gap-5 text-xs text-Gainsboro/70">
                            <div className="flex items-center gap-1">
                                <SlEarphones className="text-Gainsboro/70" />
                                <p className="text-Gainsboro/70">2</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <BsChatRightText className="text-Gainsboro/70" />
                                <p className="text-Gainsboro/70">0</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="capitalize font-bold text-Gainsboro text-xl my-4 text-gray-300">
                    Setelah ini
                </p>
                <div className="flex flex-col items-center gap-4 mt-4 mb-10">
                    <img src={newsIcon} alt="Ikon Jadwal" className="w-6 h-6" />
                    <p className="text-base font-bold text-Gainsboro text-gray-300">
                        Jadwal Program Belum Tersedia
                    </p>
                    <p className="text-xs capitalize font-bold text-Gainsboro text-yellow-500">
                        Coba lagi di lain hari ya
                    </p>
                </div>

                {showNotification && (
                    <div
                        className="fixed bottom-16 z-30 left-1/2 transform -translate-x-1/2 bg-[#1f1f1f] text-white rounded-lg px-4 py-2 shadow-lg">
                        <p className="text-xs">Link telah disalin ke papan klip!</p>
                    </div>
                )}

            {/* Floating WhatsApp Button */}
            <a
            href="https://wa.me/6282140347772?text=Halo%20Bapak/Ibu.%0A%0APro%20Sehat%20adalah%20sebuah%20layanan%20kesehatan%20yang%20berfokus%20pada%20pemberian%20informasi%20dan%20solusi%20kesehatan%20terpercaya%20untuk%20masyarakat.%20Berikut%20nomor%20CALL%20CENTER%20yang%20dapat%20dihubungi%20untuk%20konsultasi%20lebih%20lanjut:%0A%0ACALL%20CENTER%20:%20082140347771%20&%20082140347772%0ABANYUWANGI%20:%20081234701692%0AJEMBER%20:082338019096%0ALUMAJANG%20:%20082232155118%0ABOJONEGORO%20:082244880169%0AMADIUN%20:085235031111%20&%20081359523373%0APONOROGO%20:08113375559%0ATRENGGALEK%20:085330103777%20&%20085330103777%0APACITAN,%20KEDIRI%20:087758700600%0ASOLO%20RAYA%20:081548314892%20&%20082134821529%0AMEDAN%20:082267673597%0ALAMPUNG%20:081227645225%0APADANG%20:085263830072"
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: "fixed",
                bottom: "90px", 
                right: "80px", 
                backgroundColor: "#25D366", 
                color: "white",
                width: "56px", 
                height: "56px", 
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%", 
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                zIndex: 50, 
                ...(window.innerWidth <= 768 && { right: "20px" })
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1EBE57"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#25D366"} 
            aria-label="Hubungi WhatsApp"
            >
            <FaWhatsapp size={28} />
            <span className="tooltip">Hubungi Kami</span>
            </a>
      </div>
    </div>
    );
};

export default Banner;
