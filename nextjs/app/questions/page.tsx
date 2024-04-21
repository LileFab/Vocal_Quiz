import { get10RandomQuestions } from "../actions/questionsActions"
import { currentUser } from "@clerk/nextjs/server";
import {Question} from "@/app/interface/Questions"
import QuestionsLayout from "./components/QuestionsLayout";
import {UsersResponse} from"@/app/interface/UserResponse"
import { submitUserAnswer } from "../actions/questionsActions";

const page = async () => {
    const user = await currentUser();
    const questions: Question[] = await get10RandomQuestions();
    console.log(questions);

    const addUserResponseToDB = async (resp: UsersResponse) => {
        await submitUserAnswer(resp);
    }

    return (
        <div className="flex-col items-center justify-between p-24">
            <h1 className="text-3xl capitalize font-bold">Question</h1>
            <div className="grid grid-cols-2">
                <QuestionsLayout questionList={questions} onSendUserReponse={()=>{addUserResponseToDB}}/>
            </div>
        </div>
    )
}

export default page