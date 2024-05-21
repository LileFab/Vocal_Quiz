"use client"

import { useState, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import axios from 'axios'

const Record = () => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [voiceRecorder, setVoiceRecorder] = useState<MediaRecorder | null>(null);
    const [recordedData, setRecordedData] = useState<Blob | null>(null);

    const saveAudio = () => {
        if (voiceRecorder) {
            voiceRecorder.ondataavailable = (event) => {
                setRecordedData(new Blob([event.data]));
            };
        }
    }

    useEffect(() => {
        const initAudio = async () => {
            const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            setVoiceRecorder(new MediaRecorder(audioStream));
        };
        initAudio();
    }, []);

    useEffect(() => {
        saveAudio()
    }, [voiceRecorder]);

    const startRecording = () => {
        console.log("start");
        setIsRecording(true);
        voiceRecorder?.start();
    };

const stopRecording = () => {
    console.log("stop");
    setIsRecording(false);
    if (voiceRecorder) {
        voiceRecorder.stop();
    }

    if(voiceRecorder)
    voiceRecorder.onstop = () => {
        if (recordedData) {
            const formData = new FormData();
            formData.append('file', recordedData);
            console.log(recordedData)
            
            axios.post('http://localhost:5005/speech_to_text', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error uploading file:', error);
            });
        } else {
            console.error('No recorded data available');
        }
    };
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
