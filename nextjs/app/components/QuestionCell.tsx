"use client"

import { Question } from "@/app/interface/Questions"
import { motion } from "framer-motion"
import QuestionButton from "@/app/components/ui/QuestionButton"
import Button from "@/app/components/ui/Button"
import { useState, useEffect } from "react"
import {UsersResponse} from"@/app/interface/UserResponse"
import { shuffleArray } from "../actions/questionsActions"

const QuestionCell = ({ questionObject, onSendResponse }: { questionObject: Question, onSendResponse:(resp: UsersResponse) => void }) => {

    const [response, setResponse] = useState("Réponse par défaut");
    const [pageLoadTime, setPageLoadTime] = useState<Date | null>(null);
    const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);


    useEffect(() => {
        // Stocker l'heure de chargement de la page
        setPageLoadTime(new Date());
        if (questionObject.bad_answer_2 && questionObject.bad_answer_3)
        setShuffle()
    }, [questionObject]); 

    const validateResponse = (resp: string | null) => {
        resp !== null ? setResponse(resp) : setResponse("Réponse par défaut")
    }

    const setShuffle = async () => {
        if (questionObject.bad_answer_2 && questionObject.bad_answer_3)
            setShuffledAnswers( await shuffleArray([
            questionObject.good_answer,
            questionObject.bad_answer_1,
            questionObject.bad_answer_2,
            questionObject.bad_answer_3,
        ]));
    }

    const sendResponse = () => {
        let tempsPris = 0;
        if(pageLoadTime) tempsPris = new Date().getTime() - pageLoadTime.getTime();
        
        const newResponse: UsersResponse = {
            question_id: questionObject.id,
            user_id: "",
            user_response: response,
            is_correct: response == questionObject.good_answer,
            time_to_respond: tempsPris, // a mettre en place
            creation_date: new Date()
        };
        onSendResponse(newResponse);
    }
    
    return(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >

            <h1 className="justify-content mb-10">{questionObject.question}</h1>
            <div className="grid grid-cols-2">
                {shuffledAnswers.map((answer, index) => (
                    <div className="px-4">
                        <QuestionButton key={index} text={answer} onClick={() => validateResponse(answer)}/>
                    </div>
                ))}
            </div>
            <Button text="Envoyer la réponse" onClick={sendResponse}/>
        </motion.div>
            
    )
}

export default QuestionCell;