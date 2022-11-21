import { useEffect } from "react";
import { clearCanvas, drawImage } from "../features/drawing";

function PreviewCanvas({ currentImage, imageLoaded }) {
    useEffect(() => {
        if (!currentImage) {
            clearCanvas(document.getElementById("preview-canvas"));
            return;
        }
        if (currentImage.imageObj) {
            drawImage(document.getElementById("preview-canvas"), currentImage.imageObj);
        } else {
            let image = new Image();
            image.onload = () => imageLoaded(currentImage.id, image);
            image.src = currentImage.imageUrl;
        }
    }, [currentImage]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <canvas id="preview-canvas" width="550" height="550" style={{ width: "400px", height: "400px" }} />
        </>
    );
}

export default PreviewCanvas;
