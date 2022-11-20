import { styled } from "@mui/material/styles";

const TimelineOuter = styled("div")(({ theme }) => ({
    width: "100%",
    position: "relative",
}));

const Cursor = styled("div")(({ theme }) => ({
    width: "5px",
    height: "100%",
    top: "0px",
    position: "absolute",
    backgroundColor: "maroon",
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

function Timeline({ seconds, pixelPerSecond, currentTime, children }) {
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
            <Cursor style={{left: currentTime * pixelPerSecond}}/>
        </TimelineOuter>
    );
}

export default Timeline;
