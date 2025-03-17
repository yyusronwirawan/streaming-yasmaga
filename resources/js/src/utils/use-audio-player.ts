import { atom, useAtom } from 'jotai';

export const audioAtom = atom<HTMLAudioElement | null>(null);
export const statusAtom = atom<'playing' | 'paused' | 'idle'>('idle');
export const volumeAtom = atom(100);
export const mutedAtom = atom(false);

export function useAudioPlayer() {
    const [audio, setAudio] = useAtom(audioAtom);
    const [status, setStatus] = useAtom(statusAtom);
    const [volume, setVolume] = useAtom(volumeAtom);
    const [muted, setMuted] = useAtom(mutedAtom);

    function play(url?: string) {
        if (!url && !audio) return;
        if (!url && !!audio) {
            audio.play()
                .then(() => setStatus('playing'))
                .catch((e) => {
                    setStatus('paused');
                    console.error('Failed to play audio: ', e);
                });
            return;
        }

        const newAudio = new Audio(url);
        newAudio.crossOrigin = 'anonymous';
        newAudio.volume = volume / 100;
        newAudio.muted = muted;

        newAudio.play()
            .then(() => setStatus('playing'))
            .catch((e) => {
                setStatus('paused');
                console.error('Failed to play audio: ', e);
            });
        setAudio(newAudio);
    }

    function pause() {
        if (!audio) return;

        audio.pause();
        setStatus('paused');
    }

    function updateVolume(newVolume: number) {
        setVolume(newVolume);

        if (!audio) return;
        audio.volume = newVolume / 100;
    }

    function toggleMute(isMuted?: boolean) {
        const newMuted = typeof isMuted === 'boolean' ? isMuted : !muted;
        setMuted(newMuted);

        if (!audio) return;
        audio.muted = newMuted;
    }

    return { status, audio, play, pause, volume, updateVolume, muted, toggleMute };
}
