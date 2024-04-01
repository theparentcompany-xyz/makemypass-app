export const convertWebmToWav = async (webmBlob: Blob): Promise<Blob> => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(await webmBlob.arrayBuffer());

    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length * numberOfChannels * 2;

    const buffer = new ArrayBuffer(44 + length);
    const view = new DataView(buffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 4, true); // byte rate (sampleRate * bytesPerSample * numberOfChannels)
    view.setUint16(32, numberOfChannels * 2, true); // block align (bytesPerSample * numberOfChannels)
    view.setUint16(34, 16, true); // bits per sample
    writeString(view, 36, 'data');
    view.setUint32(40, length, true);

    // Merge channels and write audio data to the buffer
    const offset = 44;
    const channelData = audioBuffer.getChannelData(0);
    const writeInt16 = (pos: number, value: number) => {
        view.setInt16(pos, value, true);
    };
    for (let i = 0; i < channelData.length; i++) {
        writeInt16(offset + i * 2, Math.max(-1, Math.min(1, channelData[i])) * 0x7fff);
    }

    return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
    }
}
