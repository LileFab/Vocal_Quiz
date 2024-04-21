"use client"

import { Question } from "@/app/interface/Questions"
import { motion } from "framer-motion"
import { useState } from "react";
import QuestionCell from "./QuestionCell";
import { UsersResponse } from"@/app/interface/UserResponse"

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const QuestionsLayout = ({questionList, onSendUserReponse}: {questionList: Question[], onSendUserReponse: (resp: UsersResponse) => void}) => {
    const [questionStep, setQuestionStep] = useState(0);
    const stepSubmit = () => {
        setQuestionStep(questionStep + 1);
    };

    const handleResponseFromChild = (resp: UsersResponse) => {
        onSendUserReponse(resp)
        stepSubmit()
    }

    
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5 }}
        >
            {questionStep === 0 &&(
                <QuestionCell questionObject={questionList[0]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 1 &&(
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    
                </motion.div>
            )
            }
        </motion.div>
    )
}

export default QuestionsLayout;