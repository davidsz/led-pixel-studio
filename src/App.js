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

function App() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [music, setMusic] = useState([
        {
            id: "0",
            width: 400,
        },
        {
            id: "1",
            width: 200,
        },
    ]);
    const [images, setImages] = useState([
        {
            id: "0",
            width: 100,
        },
        {
            id: "1",
            width: 200,
        },
        {
            id: "2",
            width: 300,
        },
    ]);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <TopBar title="LED Pixel Studio" drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}></TopBar>
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
            <Box component="main" sx={{ flexGrow: 1, p: 3, height: "100vh" }}>
                <DrawerHeader />

                <TimelineTrack items={music} setItems={setMusic} />
                <TimelineTrack items={images} setItems={setImages} />
            </Box>
        </Box>
    );
}

export default App;
