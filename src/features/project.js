import { drawCircularPreview } from "./drawing";

export function loadProject(directoryHandle, setImages, setMusic, pixelPerSecond) {}

export function saveProject(directoryHandle) {}

export function clearProject(setImages, setMusic) {
    setImages((_) => []);
    setMusic((_) => []);
}

export function importImages(images, setAppImages) {
    for (let i = 0; i < images.length; i++) {
        const objectURL = URL.createObjectURL(images[i]);
        const image = new Image();
        image.addEventListener("load", () => {
            // TODO: Duplicated logic from PreviewCanvas
            // TODO: Add image immediately by URL and load later as music (not when previewed)
            const previewCanvas = new OffscreenCanvas(550, 550);
            drawCircularPreview(previewCanvas, image);
            setAppImages((current) => {
                const id = getAvailableId(current);
                return [
                    ...current,
                    {
                        id: id,
                        width: 200,
                        imageUrl: objectURL,
                        imageObj: image,
                        circularPreview: previewCanvas,
                    },
                ];
            });
        });
        image.src = objectURL;
    }
}

export function importMusic(music, setAppMusic) {
    for (let i = 0; i < music.length; i++) {
        const objectURL = URL.createObjectURL(music[i]);
        setAppMusic((current) => {
            const id = getAvailableId(current);
            return [
                ...current,
                {
                    id: id,
                    width: 250,
                    audioURL: objectURL,
                    audioBuffer: null,
                    waveform: null,
                    length: 0,
                },
            ];
        });
    }
}

function getAvailableId(array) {
    let id = array.length;
    for (let i = 0, n = array.length; i < n; i++) {
        if (array[i].id === [id].toString()) {
            id++;
            i = 0;
        }
    }
    return [id].toString();
}
