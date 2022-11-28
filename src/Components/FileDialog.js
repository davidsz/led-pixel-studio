import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FileInput from "./FileInput";

function FileDialog({ open, title, onAccept, onReject = () => {}, onClose = () => {} }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <FileInput
                    onChange={() => {
                        // TODO: Implement
                    }}
                />
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
                        onAccept();
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
