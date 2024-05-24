"use client"

import { Question } from "@/app/interface/Questions"
import { motion } from "framer-motion"
import { useState,useEffect, useRef } from "react";
import QuestionCell from "./QuestionCell";
import { UsersResponse } from"@/app/interface/UserResponse"
import { submitUserAnswer } from "../../actions/questionsActions";
import { currentUser } from "@clerk/nextjs/server";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import EndPage from "./EndPage";
import { StartPage } from "./StartPage";
import Button from "@/app/components/ui/Button";
import axios from "axios";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const QuestionsLayout = ({questionList}: {questionList: Question[]}) => {
    const [questionStep, setQuestionStep] = useState(-1);
    const [bonneRep, setBonneRep] = useState(0);
    const [userName, setUserName] = useState("");


    useEffect( () => {
        const getUser = async() => {
            const user = await currentUser();
            const userName = user?.firstName ?? "";
            setUserName(userName)
        }
        
    }, []);

    const stepSubmit = () => {
        setQuestionStep(questionStep + 1);
    };

    const handleResponseFromChild = async (resp: UsersResponse) => {
        console.log(resp);
        if (resp.is_correct) {
            setBonneRep(bonneRep + 1);
            toast.success('Bonne réponse !', {duration:1000});
        }
        else {toast.error(`Faux, la bonne réponse était ${questionList[questionStep].good_answer}`, {duration:2000});}
        await submitUserAnswer(resp);
        stepSubmit()
    }

    
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center p-24 space-x-6"
        >
            <Toaster />
             {questionStep === -1 &&(
                <>
                    <StartPage/>
                    <Button text="Commencer le quiz" onClick={stepSubmit}/>
                </>
            )
            }

            {questionStep === 0 &&(
                <>

                    <QuestionCell step={questionStep + 1} questionObject={questionList[0]} onSendResponse={handleResponseFromChild}/>
                </>
                
            )
            }

            {questionStep === 1 &&(
                <QuestionCell step={questionStep + 1} questionObject={questionList[1]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 2 &&(
                <QuestionCell step={questionStep + 1} questionObject={questionList[2]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 3 &&(
                <QuestionCell step={questionStep + 1} questionObject={questionList[3]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 4 &&(
                <QuestionCell step={questionStep + 1} questionObject={questionList[4]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 5 &&(
                <QuestionCell step={questionStep + 1} questionObject={questionList[5]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 6 &&(
                <QuestionCell step={questionStep + 1} questionObject={questionList[6]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 7 &&(
                <QuestionCell step={questionStep + 1} questionObject={questionList[7]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 8 &&(
                <QuestionCell step={questionStep + 1} questionObject={questionList[8]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 9 &&(
                <QuestionCell step={questionStep + 1} questionObject={questionList[9]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 10 && (
                <EndPage userName={userName} bonneRep={bonneRep}/>
            )}
        </motion.div>
    )
}

export default QuestionsLayout;