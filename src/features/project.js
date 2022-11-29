export function loadProject(directoryHandle, setImages, pixelPerSecond) {}

export function saveProject(directoryHandle) {}

export function importImages(images, setAppImages) {
    for (let i = 0; i < images.length; i++) {
        const objectURL = URL.createObjectURL(images[i]);
        setAppImages((current) => {
            const id = getAvailableId(current);
            return [
                ...current,
                {
                    id: id,
                    width: 200,
                    imageUrl: objectURL,
                    imageObj: null,
                    circularPreview: null,
                },
            ];
        });
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
