import { convertInterval } from "./util";

export function clearCanvas(canvasElement) {
    const context = canvasElement.getContext("2d");
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
}

function rgbAtDataPixel(data, i) {
    return `rgba(${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${data[i + 3]})`;
}

export function drawCircularPreview(canvasElement, image) {
    const tempCanvas = new OffscreenCanvas(image.width, image.height);
    const tempContext = tempCanvas.getContext("2d");
    tempContext.drawImage(image, 0, 0);
    const sourceImageData = tempContext.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;

    const context = canvasElement.getContext("2d");
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    context.lineWidth = 2;
    context.strokeStyle = "maroon";

    let centerX = canvasElement.width / 2,
        centerY = canvasElement.height / 2,
        radius = 0,
        startArc = 0,
        endArc = 0;

    // Calculate number of sections from image width/height ratio
    const ratio = (image.width / image.height).toFixed(1);
    const numSection = Math.round(convertInterval(ratio, [0.3, 2], [17, 4]));

    const sectionArc = (2 * Math.PI) / numSection;
    const pixelArc = sectionArc / image.width;
    for (let s = 0; s < numSection; s++) {
        const sectionStart = s * sectionArc;
        for (let y = 0; y < image.height; y++) {
            radius = 256 - y * 2;
            for (let x = 0; x < image.width; x++) {
                let pIndex = x * 4;
                if (y > 0) pIndex += (y - 1) * tempCanvas.width * 4;
                context.strokeStyle = rgbAtDataPixel(sourceImageData, pIndex);
                startArc = sectionStart + x * pixelArc;
                endArc = startArc + pixelArc;
                context.beginPath();
                context.arc(centerX, centerY, radius, startArc, endArc);
                context.stroke();
            }
        }
    }
}
