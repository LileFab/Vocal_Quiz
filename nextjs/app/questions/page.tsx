import { get10RandomQuestions } from "../actions/questionsActions"
import { currentUser } from "@clerk/nextjs/server";
import {Question} from "@/app/interface/Questions"
import QuestionsLayout from "@/app/components/QuestionsLayout";

const page = async () => {
    const user = await currentUser();
    const questions: Question[] = await get10RandomQuestions();

    return (
        <>
            <QuestionsLayout questionList={questions}/>
        </>
    )
}

export default page