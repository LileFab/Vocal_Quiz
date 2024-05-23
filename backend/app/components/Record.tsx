"use client"

import { useState, useEffect, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";
import axios from 'axios';

const Record = () => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [voiceRecorder, setVoiceRecorder] = useState<MediaRecorder | null>(null);
    const recordedChunks = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const initAudio = async () => {
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioStreamRef.current = audioStream;
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                const recorder = new MediaRecorder(audioStream);
                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunks.current.push(event.data);
                    }
                };
                setVoiceRecorder(recorder);
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        };
        initAudio();
    }, []);

    const startRecording = () => {
        console.log("start");
        setIsRecording(true);
        recordedChunks.current = []; // Clear previously recorded chunks
        voiceRecorder?.start();
    };

    const stopRecording = async () => {
        console.log("stop");
        setIsRecording(false);
        if (voiceRecorder) {
            voiceRecorder.stop();
            voiceRecorder.onstop = async () => {
                if (recordedChunks.current.length > 0) {
                    const audioBlob = new Blob(recordedChunks.current, { type: 'audio/webm' });
                    const arrayBuffer = await audioBlob.arrayBuffer();
                    const audioBuffer = await audioContextRef.current?.decodeAudioData(arrayBuffer);
                    if (audioBuffer) {
                        const wavBlob = create16BitWavBlob(audioBuffer);
                        sendAudioToAPI(wavBlob);
                    }
                } else {
                    console.error('No recorded data available');
                }
            };
        }
    };

    const create16BitWavBlob = (audioBuffer: AudioBuffer): Blob => {
        const numOfChan = audioBuffer.numberOfChannels;
        const length = audioBuffer.length * 2 * numOfChan;
        const buffer = new ArrayBuffer(44 + length);
        const view = new DataView(buffer);

        // RIFF chunk descriptor
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + length, true);
        writeString(view, 8, 'WAVE');

        // FMT sub-chunk
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numOfChan, true);
        view.setUint32(24, audioBuffer.sampleRate, true);
        view.setUint32(28, audioBuffer.sampleRate * 2 * numOfChan, true);
        view.setUint16(32, numOfChan * 2, true);
        view.setUint16(34, 16, true);

        // data sub-chunk
        writeString(view, 36, 'data');
        view.setUint32(40, length, true);

        // Write the PCM samples
        const channels = [];
        for (let i = 0; i < numOfChan; i++) {
            channels.push(audioBuffer.getChannelData(i));
        }

        let offset = 44;
        for (let i = 0; i < audioBuffer.length; i++) {
            for (let channel = 0; channel < numOfChan; channel++) {
                const sample = Math.max(-1, Math.min(1, channels[channel][i]));
                view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
                offset += 2;
            }
        }

        return new Blob([view], { type: 'audio/wav' });
    };

    const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    const sendAudioToAPI = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'recording.wav');

        try {
            const response = await axios.post('http://localhost:5000/speech_to_text', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            console.log('Response from API:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleClick = () => {
        isRecording ? stopRecording() : startRecording();
    };

    return (
        <>
            <button onClick={handleClick}>
                <FaMicrophone className={`${isRecording ? "bg-green-600" : "bg-red-600"}`} />
            </button>
        </>
    );
};

export default Record;
