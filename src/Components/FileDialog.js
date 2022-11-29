import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FileInput from "./FileInput";

function FileDialog({ open, title, accept, onAccept, onReject = () => {}, onClose = () => {} }) {
    const [files, setFiles] = useState([]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <FileInput accept={accept} onChange={(attachment) => setFiles(attachment)} />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        onReject();
                        onClose();
                    }}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        onAccept(files);
                        onClose();
                    }}
                    autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FileDialog;
