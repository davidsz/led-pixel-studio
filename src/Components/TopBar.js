import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: theme._drawerWidth,
        width: `calc(100% - ${theme._drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

function TopBar({ title, drawerOpen, setDrawerOpen }) {
    return (
        <AppBar position="fixed" open={drawerOpen}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => setDrawerOpen(true)}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(drawerOpen && { display: "none" }),
                    }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    {title}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;
