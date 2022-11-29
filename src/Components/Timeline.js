import { Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useId, useContext } from "react";
import { AudioContext } from "..";
import { makeElementDraggable } from "../features/util";

const _cursorWidth = 6;

const TimelineOuter = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    position: "relative",
    marginTop: "400px",
}));

const Cursor = styled("div")(({ theme }) => ({
    width: `${_cursorWidth}px`,
    height: "100%",
    top: "0px",
    position: "absolute",
    backgroundColor: theme.palette._cursorColor,
    cursor: "col-resize",
    borderRadius: "2px",
}));

const TimeTrack = styled("div")(({ theme }) => ({
    width: "100%",
    height: "30px",
    display: "flex",
    flexDirection: "row",
    borderTop: `2px solid ${theme.palette._timetrackColor}`,
    cursor: "s-resize",
}));

const FiveSeconds = styled("div")(({ theme }) => ({
    height: "14px",
    display: "flex",
    flexDirection: "row",
    borderLeft: `3px solid ${theme.palette._timetrackColor}`,
    pointerEvents: "none",
}));

const Second = styled("div")(({ theme }) => ({
    height: "10px",
    borderRight: `1px solid ${theme.palette._timetrackColor}`,
    pointerEvents: "none",
}));

function Timeline({ seconds, pixelPerSecond, currentTime, onNavigation, children }) {
    const audioManager = useContext(AudioContext);
    const cursorId = useId();

    useEffect(() => {
        let wasPlaying = false;
        let cursorElement = document.getElementById(`${cursorId}-cursor`);
        if (cursorElement.removeDraggable) cursorElement.removeDraggable();
        makeElementDraggable(cursorElement, {
            horizontal: true,
            vertical: false,
            grabbedCallback: () => {
                if (audioManager.isPlaying) {
                    audioManager.pause();
                    wasPlaying = true;
                } else wasPlaying = false;
            },
            doneCallback: (_, left) => {
                onNavigation(left / pixelPerSecond, true);
                if (wasPlaying) audioManager.play();
            },
        });
    }, [pixelPerSecond]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleTimetrackMouseDown = (e) => {
        let rect = e.target.getBoundingClientRect();
        let cursorElement = document.getElementById(`${cursorId}-cursor`);
        // TODO: Maybe refactor args? (Currently drunk and afraid to touch it.)
        cursorElement.initiateDrag(e, e.clientX - rect.left - _cursorWidth / 2, e.clientY - rect.top);
    };

    // Generate time track
    const timeTrackItems = [];
    for (let i = 0; i < seconds; i += 5) {
        let secondElements = [...Array(4)].map((_, j) => <Second key={i + j} style={{ width: `${pixelPerSecond}px` }} />);
        let fiveSecondsElement = (
            <FiveSeconds key={i} style={{ width: `${pixelPerSecond * 5}px` }}>
                {secondElements}
            </FiveSeconds>
        );
        timeTrackItems.push(fiveSecondsElement);
    }

    return (
        <TimelineOuter>
            <TimeTrack onMouseDown={handleTimetrackMouseDown}>{timeTrackItems}</TimeTrack>
            {children}
            <Tooltip title={Number(currentTime).toFixed(1)} placement="top" open={true} arrow>
                <Cursor id={`${cursorId}-cursor`} style={{ left: currentTime * pixelPerSecond }} />
            </Tooltip>
        </TimelineOuter>
    );
}

export default Timeline;
