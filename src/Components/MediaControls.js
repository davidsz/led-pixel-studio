import { useState } from "react";
import { IconButton } from "@mui/material";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from "@mui/icons-material/Stop";
import { playAudioTrack } from "../features/audio";

function MediaControls({ music }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const playPause = () => {
        playAudioTrack(music);
        setIsPlaying(!isPlaying);
    }

    return (
        <>
            <IconButton aria-label="previous">
                <SkipPreviousIcon />
            </IconButton>
            <IconButton aria-label="play/pause" onClick={playPause}>
                {isPlaying ?
                    <PauseIcon sx={{ height: 38, width: 38 }} />
                :
                    <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                }
            </IconButton>
            <IconButton aria-label="next">
                <StopIcon />
            </IconButton>
        </>
    );
}

export default MediaControls;
