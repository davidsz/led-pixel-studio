import { useState } from "react";
import { Button, Typography, Stack } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

function FileInput({ accept, onChange }) {
    const [attachment, setAttachment] = useState([]);

    function handleChange(event) {
        const files = Array.from(event.target.files);
        setAttachment(files);
        if (!!onChange) onChange(files);
    }

    let nameToDisplay = "Select files";
    if (attachment && attachment.length === 1) nameToDisplay = attachment[0].name;
    else if (attachment && attachment.length > 1) nameToDisplay = "Multiple selected";

    let acceptType = "";
    if (accept === "images") acceptType = "image/*";
    else if (accept === "music") acceptType = "audio/*";

    return (
        <Button component="label" color="inherit" sx={{ mt: 3 }}>
            <Stack spacing={2} direction="row" alignItems="center">
                <InsertDriveFileIcon color="inherit" />
                <Typography noWrap>{nameToDisplay}</Typography>
                <input type="file" hidden multiple accept={acceptType} onChange={handleChange} />
            </Stack>
        </Button>
    );
}

export default FileInput;
