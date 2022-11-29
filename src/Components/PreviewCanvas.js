import { useEffect } from "react";
import { clearCanvas } from "../features/drawing";

const _canvasViewportSize = 550;

const style = {
    width: "400px",
    height: "400px",
    position: "fixed",
    left: "calc(50% - 200px)",
    top: "80px",
};

function PreviewCanvas({ currentImage }) {
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
            // TODO: Consider drawing a general placeholder
        }
    }, [currentImage]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <canvas id="preview-canvas" width={_canvasViewportSize} height={_canvasViewportSize} style={style} />
        </>
    );
}

export default PreviewCanvas;
