"use client"

import { Question } from "@/app/interface/Questions"
import { motion } from "framer-motion"
import QuestionButton from "@/app/components/ui/QuestionButton"
import Button from "@/app/components/ui/Button"
import { useState, useEffect } from "react"
import {UsersResponse} from"@/app/interface/UserResponse"
import { shuffleArray } from "../../actions/questionsActions"

const QuestionCell = ({ step, questionObject, onSendResponse }: { step: number, questionObject: Question, onSendResponse:(resp: UsersResponse) => void }) => {

    const [response, setResponse] = useState("Réponse par défaut");
    const [pageLoadTime, setPageLoadTime] = useState<Date | null>(null);
    const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);


    useEffect(() => {
        // Stocker l'heure de chargement de la page
        setPageLoadTime(new Date());
        setShuffle()
    }, [questionObject]); 

    const validateResponse = (resp: string | null) => {
        resp !== null ? setResponse(resp) : setResponse("Réponse par défaut")
    }

const setShuffle = async () => {
    const answersToShuffle = [questionObject.good_answer, questionObject.bad_answer_1];

    if (questionObject.bad_answer_2 && questionObject.bad_answer_3) {
        answersToShuffle.push(questionObject.bad_answer_2, questionObject.bad_answer_3);
    }
    setShuffledAnswers(await shuffleArray(answersToShuffle));
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
            <div className="flex flex-col">
                <h2><u>Question {step} sur 10 : </u></h2>
                <h1 className="justify-content mb-10 pt-4">{questionObject.question}</h1>
            </div>
            
            <div className="container flex justify-center items-center">
                {shuffledAnswers.map((answer, index) => (
                    <div className="p-4">
                        <QuestionButton key={index} text={`${index+1}. ${answer}`} onClick={() => validateResponse(answer)}/>
                    </div>
                ))}
            </div>
            <div className="container flex justify-center items-center">
                <Button text="Envoyer la réponse" onClick={sendResponse}/>
            </div>
        </motion.div>
            
    )
}

export default QuestionCell;