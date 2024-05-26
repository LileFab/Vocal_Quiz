"use client";

import { Question } from "@/app/interface/Questions";
import { motion } from "framer-motion";
import QuestionButton from "@/app/components/ui/QuestionButton";
import Button from "@/app/components/ui/Button";
import { useState, useEffect, useRef } from "react";
import { UsersResponse } from "@/app/interface/UserResponse";
import { shuffleArray } from "../../actions/questionsActions";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import axios from "axios";

const QuestionCell = ({
    step,
    questionObject,
    onSendResponse,
}: {
    step: number;
    questionObject: Question;
    onSendResponse: (resp: UsersResponse) => void;
}) => {
    const [response, setResponse] = useState("Réponse par défaut");
    const [pageLoadTime, setPageLoadTime] = useState<Date | null>(null);
    const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [voiceRecorder, setVoiceRecorder] = useState<MediaRecorder | null>(null);
    const [respFromModel, setRespFromModel] = useState<any>(null);
    const [recordingStopped, setRecordingStopped] = useState<boolean>(false);
    const recordedChunks = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioStreamRef = useRef<MediaStream | null>(null);

    const flaskApiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL as string;


    useEffect(() => {
        setPageLoadTime(new Date());
        setShuffle();
        const initAudio = async () => {
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioStreamRef.current = audioStream;
                audioContextRef.current = new (window.AudioContext)();
                const recorder = new MediaRecorder(audioStream);
                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunks.current.push(event.data);
                    }
                };
                recorder.onstop = async () => {
                    if (recordedChunks.current.length > 0) {
                        const audioBlob = new Blob(recordedChunks.current, { type: "audio/webm" });
                        const arrayBuffer = await audioBlob.arrayBuffer();
                        const audioBuffer = await audioContextRef.current?.decodeAudioData(arrayBuffer);
                        if (audioBuffer) {
                            const wavBlob = create16BitWavBlob(audioBuffer);
                            await sendAudioToAPI(wavBlob);
                        }
                    } else {
                        console.error("No recorded data available");
                    }
                    setRecordingStopped(true);
                };
                setVoiceRecorder(recorder);
                startRecording(recorder);
            } catch (error) {
                console.error("Error accessing microphone:", error);
            }
        };
        initAudio();
    }, []);

    useEffect(() => {
        if (recordingStopped && respFromModel !== null) {
            sendResponse();
        }
    }, [recordingStopped, respFromModel]);

    const validateResponse = (resp: string | null) => {
        setResponse(resp !== null ? resp : "Réponse par défaut");
    };

    const setShuffle = async () => {
        const answersToShuffle = [questionObject.good_answer, questionObject.bad_answer_1];
        if (questionObject.bad_answer_2 && questionObject.bad_answer_3) {
            answersToShuffle.push(questionObject.bad_answer_2, questionObject.bad_answer_3);
        }
        setShuffledAnswers(await shuffleArray(answersToShuffle));
    };

    const sendResponse = () => {
        let tempsPris = 0;
        if (pageLoadTime) tempsPris = new Date().getTime() - pageLoadTime.getTime();
        let respFromModelInt = null;

        switch(respFromModel) {
            case "un":respFromModelInt = shuffledAnswers[0]?.toString();
            break;
            case "deux":respFromModelInt = shuffledAnswers[1]?.toString();
            break;
            case "trois":respFromModelInt = shuffledAnswers[2]?.toString();
            break;
            case "quatre":respFromModelInt = shuffledAnswers[3]?.toString();
            break;
            case "oui":respFromModelInt = "oui";
            break;
            case "non":respFromModelInt = "non";
            break;
            default: respFromModelInt = "Réponse par défaut";

        }

        respFromModelInt === undefined ? respFromModelInt="Réponse par défaut" : respFromModelInt;

        const newResponse: UsersResponse = {
            question_id: questionObject.id,
            user_id: "",
            user_response: respFromModelInt ? respFromModelInt : "Réponse par défaut",
            is_correct: respFromModelInt.toLowerCase() === questionObject.good_answer.toLowerCase(),
            time_to_respond: tempsPris,
            creation_date: new Date(),
        };
        onSendResponse(newResponse);
    };

    const startRecording = (recorder: MediaRecorder) => {
        setIsRecording(true);
        recordedChunks.current = [];
        recorder.start();
    };

    const stopRecording = () => {
        setIsRecording(false);
        if (voiceRecorder) {
            voiceRecorder.stop();
        }
    };

    const create16BitWavBlob = (audioBuffer: AudioBuffer): Blob => {
        const numOfChan = audioBuffer.numberOfChannels;
        const length = audioBuffer.length * 2 * numOfChan;
        const buffer = new ArrayBuffer(44 + length);
        const view = new DataView(buffer);

        writeString(view, 0, "RIFF");
        view.setUint32(4, 36 + length, true);
        writeString(view, 8, "WAVE");

        writeString(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numOfChan, true);
        view.setUint32(24, audioBuffer.sampleRate, true);
        view.setUint32(28, audioBuffer.sampleRate * 2 * numOfChan, true);
        view.setUint16(32, numOfChan * 2, true);
        view.setUint16(34, 16, true);

        writeString(view, 36, "data");
        view.setUint32(40, length, true);

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

        return new Blob([view], { type: "audio/wav" });
    };

    const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    const sendAudioToAPI = async (blob: Blob) => {
        const formData = new FormData();
        formData.append("file", blob, "recording.wav");

        try {
            const response = await axios.post(flaskApiUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", 
                    "Access-Control-Allow-Origin": "*",
                },
            });
            setRespFromModel(response.data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col">
                <div className="absolute left-0 ml-44">                
                    <CountdownCircleTimer
                    isPlaying
                    duration={8}
                    colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                    colorsTime={[7, 5, 2, 0]}
                    size={50}
                    onComplete={() => {
                        stopRecording();
                    }}
                /></div>

                <h2 className="mb-4 font-bold text-3xl underline">Question {step} sur 10</h2>
                <h1 className="justify-content mb-10 text-lg">{questionObject.question}</h1>
            </div>
            <div className="grid grid-cols-1 items-center text-center">
                {shuffledAnswers.map((answer, index) => (
                    <div className="px-4" key={index}>
                        <QuestionButton text={(answer.toLowerCase() == "oui" || answer.toLowerCase() == "non") ? answer : ((index+1) + " - " + answer)} onClick={() => validateResponse(answer)} />
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default QuestionCell;
