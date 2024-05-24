"use client";

import React, { useEffect, useState } from 'react';
import { UsersResponse } from "@/app/interface/UserResponse"
import { getQuestionById } from "@/app/actions/questionsActions"
import { Question } from "@/app/interface/Questions"

const QuestionCard = ({index, resp} : {index: number, resp: UsersResponse}) => {
    const [question, setQuestion] = useState<Question | null>(null);

    useEffect(() => {
        const fetchQuestion = async () => {
            const fetchedQuestion: Question = await getQuestionById(resp.question_id);
            setQuestion(fetchedQuestion);
        };
        
        fetchQuestion();
    }, [resp.question_id]);

    return (
        <div className="border p-2 my-4 bg-slate-500">
            {question ? (
                <p key={`${index}`}><b>Question :</b> "{question.question}" <br/><b>Réponse :</b> <span className={`${resp.is_correct ? "text-green-500": "text-red-500"}`}>"{resp.user_response}" </span> <br/> <b>Temps de réponse :</b> {resp.time_to_respond / 1000}s.</p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default QuestionCard;
