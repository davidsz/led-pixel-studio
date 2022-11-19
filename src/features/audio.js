import WaveformData from "waveform-data";

export function generateWaveform(audioURL, callback) {
    fetch(audioURL)
        .then((response) => {
            if (response.ok) {
                return response.arrayBuffer();
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        })
        .then((buffer) => {
            const audioContext = new AudioContext();
            const options = {
                audio_context: audioContext,
                array_buffer: buffer,
                scale: 1024,
            };

            return new Promise((resolve, reject) => {
                WaveformData.createFromAudio(options, (err, waveform) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(waveform);
                    }
                    audioContext.close();
                });
            });
        })
        .then((waveform) => {
            console.log(`Waveform has ${waveform.channels} channels`);
            console.log(`Waveform has length ${waveform.length} points`);
            callback(waveform);
        });
}

export function drawWaveform(canvas, waveform) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // TODO: Get rid or support offset
    let offsetX = 0;
    if (offsetX > waveform.length - canvas.width)
        offsetX = waveform.length - canvas.width;

    const waveformHeight = canvas.height / waveform.channels;

    for (let c = 0, offsetY = 0; c < waveform.channels; c++, offsetY += waveformHeight) {
        const channel = waveform.channel(c);

        ctx.beginPath();

        for (let x = 0, i = offsetX; x < canvas.width && i < waveform.length; x++, i++) {
            const val = channel.max_sample(i);
            ctx.lineTo(x + 0.5, offsetY + scaleY(val, waveformHeight) + 0.5);
        }

        for (let x = canvas.width - 1, i = offsetX + canvas.width - 1; x >= 0; x--, i--) {
            const val = channel.min_sample(i);
            ctx.lineTo(x + 0.5, offsetY + scaleY(val, waveformHeight) + 0.5);
        }

        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
}

function scaleY(amplitude, height) {
    const range = 256;
    const offset = 128;
    return height - ((amplitude + offset) * height) / range;
}
