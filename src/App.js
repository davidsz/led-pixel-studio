import { useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import DrawerMenuitem from "./components/DrawerMenuItem";
import TimelineTrack from "./components/TimelineTrack";
import DrawerMenu from "./components/DrawerMenu";
import { DrawerHeader } from "./components/DrawerMenu";
import TopBar from "./components/TopBar";
import Timeline from "./components/Timeline";
import { Stack } from "@mui/material";
import MediaControls from "./components/MediaControls";

function App() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [music, setMusic] = useState([
        {
            id: "0",
            width: 250,
            audioURL: "sample/07023003.mp3",
            audioBuffer: null,
            waveform: null,
            length: 0,
        },
        {
            id: "1",
            width: 250,
            audioURL: "sample/Yodel_Sound_Effect.mp3",
            audioBuffer: null,
            waveform: null,
            length: 0,
        },
    ]);
    const [images, setImages] = useState([
        {
            id: "0",
            width: 300,
            imageUrl: "sample/sample1.png",
        },
        {
            id: "1",
            width: 200,
            imageUrl: "sample/sample2.png",
        },
        {
            id: "2",
            width: 500,
            imageUrl: "sample/sample3.png",
        },
    ]);
    const [currentTime, setCurrentTime] = useState(3.5);

    let totalAudioLength = 0,
        totalAudioPixelLength = 0;
    music.forEach((audio) => {
        totalAudioLength += audio.length;
        totalAudioPixelLength += audio.waveform ? audio.waveform.length : 0;
    });
    const resolution = totalAudioLength > 0 ? totalAudioPixelLength / totalAudioLength : 0;

    let handleTimelineNavigation = (seconds) => {
        setCurrentTime(seconds);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <TopBar title="LED Pixel Studio" drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}>
                <Stack spacing={2} direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
                    <MediaControls music={music} />
                </Stack>
            </TopBar>
            <DrawerMenu open={drawerOpen} closeDrawer={() => setDrawerOpen(false)}>
                <List>
                    <DrawerMenuitem open={drawerOpen} text={"Load project"} icon={<InboxIcon />} />
                    <DrawerMenuitem open={drawerOpen} text={"Save project"} icon={<InboxIcon />} />
                    <DrawerMenuitem open={drawerOpen} text={"Clear"} icon={<InboxIcon />} />
                </List>
                <Divider />
                <List>
                    <DrawerMenuitem open={drawerOpen} text={"Pictures"} icon={<MailIcon />} />
                    <DrawerMenuitem open={drawerOpen} text={"Music"} icon={<MailIcon />} />
                </List>
                <Divider />
                <List>
                    <DrawerMenuitem open={drawerOpen} text={"Homepage"} icon={<InboxIcon />} />
                </List>
            </DrawerMenu>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />

                <Timeline
                    seconds={totalAudioLength}
                    pixelPerSecond={resolution}
                    currentTime={currentTime}
                    onNavigation={handleTimelineNavigation}>
                    <TimelineTrack type="audio" items={music} setItems={setMusic} />
                    <TimelineTrack type="image" items={images} setItems={setImages} />
                </Timeline>
            </Box>
        </Box>
    );
}

export default App;
