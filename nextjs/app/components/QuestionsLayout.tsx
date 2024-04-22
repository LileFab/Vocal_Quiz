"use client"

import { Question } from "@/app/interface/Questions"
import { motion } from "framer-motion"
import { useState,useEffect } from "react";
import QuestionCell from "./QuestionCell";
import { UsersResponse } from"@/app/interface/UserResponse"
import { submitUserAnswer } from "../actions/questionsActions";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import Button from "./ui/Button";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const QuestionsLayout = ({questionList}: {questionList: Question[]}) => {
    const [questionStep, setQuestionStep] = useState(0);
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
        if (resp.is_correct) setBonneRep(bonneRep + 1);
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
            {questionStep === 0 &&(
                <QuestionCell questionObject={questionList[0]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 1 &&(
                <QuestionCell questionObject={questionList[1]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 2 &&(
                <QuestionCell questionObject={questionList[2]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 3 &&(
                <QuestionCell questionObject={questionList[3]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 4 &&(
                <QuestionCell questionObject={questionList[4]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 5 &&(
                <QuestionCell questionObject={questionList[5]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 6 &&(
                <QuestionCell questionObject={questionList[6]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 7 &&(
                <QuestionCell questionObject={questionList[7]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 8 &&(
                <QuestionCell questionObject={questionList[8]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 9 &&(
                <QuestionCell questionObject={questionList[9]} onSendResponse={handleResponseFromChild}/>
            )
            }

            {questionStep === 10 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex-col items-center justify-between p-24">
                        <h1 className="text-3xl capitalize font-bold mb-20">GG {userName} vous avez {bonneRep}/10</h1>
                        <Link href="/homepage" passHref>
                            <Button text="Home Page"/>
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}

export default QuestionsLayout;