import { useEffect, useState, useContext } from "react";
import { AudioContext } from "..";
import { IconButton } from "@mui/material";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";

function MediaControls({ musicTrack, onNavigation }) {
    const audioManager = useContext(AudioContext);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        audioManager.setCallbacks(setIsPlaying, onNavigation);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Create one audio from timeline pieces only when they change/load
    let audioBufferUpdateCond = JSON.stringify(musicTrack.map(m => {
        return `${m.id}-${m?.audioBuffer?.length}`;
    }));
    useEffect(() => {
        audioManager.updateAudioBuffer(musicTrack);
    }, [audioBufferUpdateCond]); // eslint-disable-line react-hooks/exhaustive-deps

    const playPause = () => {
        if (isPlaying) {
            audioManager.pause();
            setIsPlaying(false);
        } else {
            audioManager.play();
            setIsPlaying(true);
        }
    };

    return (
        <>
            <IconButton aria-label="previous">
                <SkipPreviousIcon />
            </IconButton>
            <IconButton aria-label="play/pause" onClick={playPause}>
                {isPlaying ? <PauseIcon sx={{ height: 38, width: 38 }} /> : <PlayArrowIcon sx={{ height: 38, width: 38 }} />}
            </IconButton>
            <IconButton aria-label="next" onClick={() => audioManager.stop()}>
                <StopIcon />
            </IconButton>
        </>
    );
}

export default MediaControls;
