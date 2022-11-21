import { styled } from "@mui/material/styles";
import { useEffect, useId } from "react";
import { makeElementDraggable } from "../features/util";

const TimelineOuter = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    position: "relative",
    marginTop: "400px",
}));

const Cursor = styled("div")(({ theme }) => ({
    width: "5px",
    height: "100%",
    top: "0px",
    position: "absolute",
    backgroundColor: "maroon",
    cursor: "col-resize",
}));

const TimeTrack = styled("div")(({ theme }) => ({
    width: "100%",
    height: "30px",
    display: "flex",
    flexDirection: "row",
    borderTop: "2px solid #555",
}));

const FiveSeconds = styled("div")(({ theme }) => ({
    height: "14px",
    display: "flex",
    flexDirection: "row",
    borderLeft: "2px solid #555",
}));

const Second = styled("div")(({ theme }) => ({
    height: "10px",
    borderRight: "1px solid #555",
}));

function Timeline({ seconds, pixelPerSecond, currentTime, onNavigation, children }) {
    const cursorId = useId();

    useEffect(() => {
        let cursorElement = document.getElementById(`${cursorId}-cursor`);
        if (cursorElement.removeDraggable)
            cursorElement.removeDraggable();
        makeElementDraggable(cursorElement, {
            horizontal: true,
            vertical: false,
            doneCallback: (_, left) => onNavigation(left / pixelPerSecond),
        });
    }, [pixelPerSecond]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <TimeTrack>{timeTrackItems}</TimeTrack>
            {children}
            <Cursor id={`${cursorId}-cursor`} style={{ left: currentTime * pixelPerSecond }} />
        </TimelineOuter>
    );
}

export default Timeline;
