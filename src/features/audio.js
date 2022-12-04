import WaveformData from "waveform-data";
import { _audioScale, _sampleRate } from "..";

export function initializeAudio(audioURL, callback) {
    const audioContext = new AudioContext({ sampleRate: _sampleRate });
    fetch(audioURL)
        .then((response) => {
            if (response.ok) {
                return response.arrayBuffer();
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        })
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
            const options = {
                audio_context: audioContext,
                audio_buffer: audioBuffer,
                scale: _audioScale,
                // PAIN: The worker somehow wrecks the audioBuffer object, then can't be played later.
                disable_worker: true,
            };

            WaveformData.createFromAudio(options, (err, waveform) => {
                if (err) throw new Error(err);
                else callback(audioBuffer, waveform);
                audioContext.close();
            });
        });
}

export function drawWaveform(canvas, waveform) {
    const scaleY = (amplitude, height) => {
        const range = 256;
        const offset = 128;
        return height - ((amplitude + offset) * height) / range;
    };
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // TODO: Get rid or support offset
    let offsetX = 0;
    if (offsetX > waveform.length - canvas.width) offsetX = waveform.length - canvas.width;

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
