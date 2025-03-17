import { FaRegSquare, FaPlay, FaRegHeart } from 'react-icons/fa';
// @ts-ignore
import logoFM from '../assets/content.webp';
import { useAtom } from 'jotai';
import { storePlayPause } from '../router';
import { FaBackwardStep, FaForwardStep } from 'react-icons/fa6';
import { GoDotFill } from 'react-icons/go';
import { HiDotsVertical } from 'react-icons/hi';
import { IoMdVolumeHigh, IoMdVolumeOff } from 'react-icons/io';
import { IoShareSocialOutline } from 'react-icons/io5';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAudioPlayer } from '../utils/use-audio-player';

const BottomBar = () => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(31);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const [streamUrl, setStreamUrl] = useState('stream url');
    const websiteLink = 'https://yasmaga.com';
    // const streamUrl = "https://stream-152.zeno.fm/kfp2ghnat18uv";
    const audioPlayer = useAudioPlayer();


    // Load likes count from localStorage on mount
    useEffect(() => {
        const storedLikes = localStorage.getItem('likesCount');
        const storedLiked = localStorage.getItem('liked') === 'true';

        if (storedLikes) {
            setLikesCount(Number(storedLikes));
        }
        setLiked(storedLiked);

        if (streamUrl === 'stream url') {
            updateStreamUrl();
        }
    }, [streamUrl]);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        audioPlayer.updateVolume(newVolume);
    };

    const toggleMute = () => {
        audioPlayer.toggleMute();
    };

    function play() {
        if (streamUrl !== 'stream url' && audioPlayer.status === 'idle') {
            audioPlayer.play(streamUrl);
            return;
        }

        if (audioPlayer.status === 'playing') audioPlayer.pause();
        else audioPlayer.play();
    }

    const toggleLike = () => {
        const newLikedStatus = !liked;
        setLiked(newLikedStatus); // Toggle like status

        // Update likes count and store in localStorage
        const newLikesCount = newLikedStatus ? likesCount + 1 : likesCount - 1;
        setLikesCount(newLikesCount);
        localStorage.setItem('likesCount', String(newLikesCount));
        localStorage.setItem('liked', String(newLikedStatus));
    };

    const handleShare = async () => {
        try {
            setShowShareOptions(!showShareOptions);
            await navigator.clipboard.writeText(websiteLink); // Copy link to clipboard
            setShowNotification(true); // Show notification
            setTimeout(() => setShowNotification(false), 2000); // Hide after 2 seconds
        } catch (err) {
            console.error('Failed to copy link: ', err);
        }
    };

    const updateStreamUrl = async () => {
        const newUrl = await fetchContents(streamUrl);
        setStreamUrl(newUrl);
    };

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

    return (
        <div className="fixed bottom-0 w-full z-20">
            {/* Audio Element */}

            <div className="bg-[#1f1f1f] py-3 px-4 flex justify-between items-center gap-4 md:hidden">
                <div className="flex items-center gap-5">
                        <img src={logoFM} alt="Logo Radio" className="rounded-md h-12 flex-none" />
                    <div className="flex flex-col">
                        <p className="text-xs text-Gainsboro/70 text-gray-300">Radio Yasmaga FM 96.9 MHz (Ponorogo)</p>
                        <div className="flex items-center text-red-500 text-xs">
                            <GoDotFill />
                            <p>Live</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                        <FaBackwardStep className="text-Gainsboro/70 text-gray-300" size={16} />
                        {audioPlayer.status === 'playing' ? (
                            <FaRegSquare color="white" size={16} onClick={play} className="cursor-pointer" />
                        ) : (
                            <FaPlay color="white" size={16} onClick={play} className="cursor-pointer" />
                        )}
                        <FaForwardStep className="text-Gainsboro/70 text-gray-300" size={16} />
                    </div>
                    <div className="flex items-center gap-3">
                        <div onClick={toggleMute}>
                            {audioPlayer.muted ? (
                                <IoMdVolumeOff color="white" size={20} className="cursor-pointer" />
                            ) : (
                                <IoMdVolumeHigh color="white" size={20} className="cursor-pointer" />
                            )}
                        </div>
                        <input
                            type="range"
                            className="bg-white cursor-pointer h-1 max-w-20"
                            value={audioPlayer.volume}
                            onChange={handleVolumeChange}
                            min="0"
                            max="100"
                        />
                    </div>
                </div>
            </div>
            <div className="bg-[#1f1f1f] p-4 md:flex justify-around items-center hidden">
                <div className="flex items-center gap-5 relative">
                    <img src={logoFM} alt="Logo Radio" className="rounded-lg h-14" />
                    <div>
                        <p className="text-xs text-Gainsboro/70 text-gray-300">Radio Yasmaga FM 96.9 MHz (Ponorogo)</p>
                        <div className="flex items-center text-red-500 text-sm">
                            <GoDotFill />
                            <p>Live</p>
                        </div>
                    </div>
                    <div className="flex items-center text-sm gap-2 text-Gainsboro/70 cursor-pointer">
                        <div onClick={toggleLike}
                             className={`transition duration-300 transform ${liked ? 'scale-125' : ''}`}>
                            <FaRegHeart color={'red'} size={16} />
                        </div>
                        <p className={'text-gray-300'}>{likesCount}</p> {/* Update to show dynamic likes count */}
                    </div>
                    <HiDotsVertical color="gray" className="cursor-pointer"
                                    onClick={() => setShowShareOptions(!showShareOptions)} />
                    {showShareOptions && (
                        <div
                            className="absolute right-0 bottom-[calc(100%+8px)] bg-[#1f1f1f] text-white rounded-lg shadow-lg p-4 w-40">
                            <div className="flex items-center cursor-pointer" onClick={handleShare}>
                                <IoShareSocialOutline className="mr-2" color="gray" />
                                <p className="text-xs text-Gainsboro/70">Bagikan</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex gap-5">
                    <div className="flex items-center gap-4">
                        <FaBackwardStep className="text-Gainsboro/70 text-gray-300" size={20} />
                        {audioPlayer.status === 'playing' ? (
                            <FaRegSquare color="white" size={20} onClick={play} className="cursor-pointer" />
                        ) : (
                            <FaPlay color="white" size={20} onClick={play} className="cursor-pointer" />
                        )}
                        <FaForwardStep className="text-Gainsboro/70 text-gray-300" size={20} />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div onClick={toggleMute}>
                        {audioPlayer.muted ? (
                            <IoMdVolumeOff color="white" size={20} className="cursor-pointer" />
                        ) : (
                            <IoMdVolumeHigh color="white" size={20} className="cursor-pointer" />
                        )}
                    </div>
                    <input
                        type="range"
                        className="bg-white cursor-pointer h-1"
                        value={audioPlayer.volume}
                        onChange={handleVolumeChange}
                        min="0"
                        max="100"
                    />
                </div>
            </div>

            {/* Notification Popup for Link Copied */}
            {showNotification && (
                <div
                    className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-[#1f1f1f] text-white rounded-lg px-4 py-2 shadow-lg">
                    <p className="text-xs">Link telah disalin ke papan klip!</p>
                </div>
            )}
        </div>
    );
};

export default BottomBar;
