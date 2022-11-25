import { convertInterval } from "./util";

export function clearCanvas(canvasElement) {
    let context = canvasElement.getContext("2d");
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
}

function rgbAtDataPixel(data, i) {
    return `rgba(${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${data[i + 3]})`;
}

export function drawImage(canvasElement, image) {
    let tempCanvas = document.createElement("canvas");
    let tempContext = tempCanvas.getContext("2d");
    tempContext.drawImage(image, 0, 0);
    const sourceImageData = tempContext.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;

    let context = canvasElement.getContext("2d");
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    context.lineWidth = 2;
    context.strokeStyle = "maroon";

    let centerX = canvasElement.width / 2,
        centerY = canvasElement.height / 2,
        radius = 0,
        startArc = 0,
        endArc = 0;

    // Calculate number of sections from image width/height ratio
    const ratio = Math.round(image.width / image.height);
    const numSection = Math.round(convertInterval(ratio, [0.5, 2], [20, 3]));

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
