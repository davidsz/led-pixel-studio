import { useEffect } from "react";
import { clearCanvas, drawCircularPreview } from "../features/drawing";

const _canvasViewportSize = 550;

const style = {
    width: "400px",
    height: "400px",
    position: "fixed",
    left: "calc(50% - 200px)",
    top: "80px",
};

function PreviewCanvas({ currentImage, imageLoaded }) {
    useEffect(() => {
        if (!currentImage) {
            clearCanvas(document.getElementById("preview-canvas"));
            return;
        }
        if (currentImage.circularPreview) {
            // Image is already loaded and preview has been generated
            const destCtx = document.getElementById("preview-canvas").getContext("2d");
            destCtx.drawImage(currentImage.circularPreview, 0, 0);
        } else {
            // TODO: This will be not called. Remove after removing test data

            // We have to download the image, generate preview and store them
            let image = new Image();
            image.onload = () => {
                const previewCanvas = new OffscreenCanvas(_canvasViewportSize, _canvasViewportSize);
                drawCircularPreview(previewCanvas, image);
                imageLoaded(currentImage.id, image, previewCanvas);
            };
            image.src = currentImage.imageUrl;
        }
    }, [currentImage]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <canvas id="preview-canvas" width={_canvasViewportSize} height={_canvasViewportSize} style={style} />
        </>
    );
}

export default PreviewCanvas;
