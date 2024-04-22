"use client"

import { Question } from "@/app/interface/Questions"
import { motion } from "framer-motion"
import QuestionButton from "@/app/components/ui/QuestionButton"
import Button from "@/app/components/ui/Button"
import { useState, useEffect } from "react"
import {UsersResponse} from"@/app/interface/UserResponse"

const QuestionCell = ({ questionObject, onSendResponse }: { questionObject: Question, onSendResponse:(resp: UsersResponse) => void }) => {

    const [response, setResponse] = useState("Réponse par défaut");
    const [pageLoadTime, setPageLoadTime] = useState<Date | null>(null);

    useEffect(() => {
        // Stocker l'heure de chargement de la page
        setPageLoadTime(new Date());
    }, []); // Exécuter une seule fois lors du chargement initial de la page

    const validateResponse = (resp: string | null) => {
        resp !== null ? setResponse(resp) : setResponse("Réponse par défaut")
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

            <h1>{questionObject.question}</h1>
            <div className="grid grid-cols-2">
                <QuestionButton text={questionObject.good_answer} onClick={() => validateResponse(questionObject.good_answer)}/>
                <QuestionButton text={questionObject.bad_answer_1} onClick={() => validateResponse(questionObject.bad_answer_1)}/>
                <QuestionButton text={questionObject.bad_answer_2} onClick={() => validateResponse(questionObject.bad_answer_2)}/>
                <QuestionButton text={questionObject.bad_answer_3} onClick={() => validateResponse(questionObject.bad_answer_3)}/>
            </div>
            <Button text="Envoyer la réponse" onClick={sendResponse}/>
        </motion.div>
            
    )
}

export default QuestionCell;