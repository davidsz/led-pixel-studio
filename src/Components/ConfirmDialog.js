import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

function ConfirmDialog({ open, title, onAccept, onReject = () => {}, onClose = () => {}, children }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
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

export default ConfirmDialog;
