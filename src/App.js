import { useState, useContext, useEffect } from "react";
import { AudioContext, _resolution } from ".";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import DrawerMenuitem from "./components/DrawerMenuItem";
import TimelineTrack from "./components/TimelineTrack";
import DrawerMenu from "./components/DrawerMenu";
import { DrawerHeader } from "./components/DrawerMenu";
import TopBar from "./components/TopBar";
import Timeline from "./components/Timeline";
import { Stack } from "@mui/material";
import MediaControls from "./components/MediaControls";
import PreviewCanvas from "./components/PreviewCanvas";
import RestorePageRoundedIcon from "@mui/icons-material/RestorePageRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import HomeIcon from "@mui/icons-material/Home";
import { importImages, importMusic, loadProject, saveProject } from "./features/project";

function App() {
    const audioManager = useContext(AudioContext);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [music, setMusic] = useState([]);
    const [images, setImages] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        document.addEventListener("contextmenu", (event) => event.preventDefault());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleTimelineNavigation = (seconds, userInitiated) => {
        if (userInitiated) audioManager.seek(seconds);
        setCurrentTime(seconds);
    };

    // Calculate timeline length in seconds
    let totalAudioLength = 0;
    music.forEach((audio) => {
        totalAudioLength += audio.length;
    });

    // Also determine the currently previewed image
    let currentImageEnd = 0,
        currentImageIndex = -1;
    for (let i = 0; i < images.length; i++) {
        const prevImageEnd = currentImageEnd;
        currentImageEnd += images[i].width / _resolution;
        if (prevImageEnd <= currentTime && currentImageEnd > currentTime) currentImageIndex = i;
    }
    if (currentImageEnd < currentTime) currentImageIndex = -1;
    const currentImage = currentImageIndex > -1 ? images[currentImageIndex] : null;
    const totalTimelineLength = Math.max(totalAudioLength, currentImageEnd);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <TopBar title="LED Pixel Studio" drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}>
                <Stack spacing={2} direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
                    <MediaControls musicTrack={music} onNavigation={handleTimelineNavigation} />
                </Stack>
            </TopBar>
            <DrawerMenu open={drawerOpen} closeDrawer={() => setDrawerOpen(false)}>
                <List>
                    <DrawerMenuitem
                        open={drawerOpen}
                        text={"Load project"}
                        icon={<RestorePageRoundedIcon />}
                        onClick={async () => loadProject(await window.showDirectoryPicker({ mode: "read" }), setImages)}
                    />
                    <DrawerMenuitem
                        open={drawerOpen}
                        text={"Save project"}
                        icon={<SaveRoundedIcon />}
                        onClick={async () => saveProject(await window.showDirectoryPicker({ mode: "readwrite" }), images)}
                    />
                    <DrawerMenuitem
                        open={drawerOpen}
                        text={"Clear"}
                        icon={<RestartAltRoundedIcon />}
                        onClick={() => {
                            if (window.confirm("Are you sure you want to restart this project?") === true) {
                                audioManager.stop();
                                setImages((_) => []);
                                setMusic((_) => []);
                            }
                        }}
                    />
                </List>
                <Divider />
                <List>
                    <DrawerMenuitem
                        open={drawerOpen}
                        text={"Import pictures"}
                        icon={<ImageRoundedIcon />}
                        onClick={async () => {
                            const pickerOpts = {
                                types: [
                                    {
                                        description: "Images",
                                        accept: {
                                            "image/*": [],
                                        },
                                    },
                                ],
                                excludeAcceptAllOption: true,
                                multiple: true,
                            };
                            importImages(await window.showOpenFilePicker(pickerOpts), setImages);
                        }}
                    />
                    <DrawerMenuitem
                        open={drawerOpen}
                        text={"Import music"}
                        icon={<MusicNoteIcon />}
                        onClick={async () => {
                            const pickerOpts = {
                                types: [
                                    {
                                        description: "Audio",
                                        accept: {
                                            "audio/*": [],
                                        },
                                    },
                                ],
                                excludeAcceptAllOption: true,
                                multiple: true,
                            };
                            importMusic(await window.showOpenFilePicker(pickerOpts), setMusic);
                        }}
                    />
                </List>
                <Divider />
                <List>
                    <DrawerMenuitem open={drawerOpen} text={"Homepage"} icon={<HomeIcon />} />
                </List>
            </DrawerMenu>
            <Box
                component="main"
                sx={{
                    display: "flex",
                    flexGrow: 1,
                    p: 3,
                    height: "100vh",
                    backgroundColor: "black",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}>
                <DrawerHeader />

                <PreviewCanvas currentImage={currentImage} currentTime={currentTime} />

                <Timeline seconds={totalTimelineLength} currentTime={currentTime} onNavigation={handleTimelineNavigation}>
                    <TimelineTrack type="audio" items={music} setItems={setMusic} />
                    <TimelineTrack type="image" items={images} setItems={setImages} />
                </Timeline>
            </Box>
        </Box>
    );
}

export default App;
