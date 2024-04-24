import { UsersResponse } from"@/app/interface/UserResponse"
import { getQuestionById } from "@/app/actions/questionsActions"
import { Question } from "@/app/interface/Questions"

const CardForHomepage = async ({index, resp} : {index: number, resp: UsersResponse}) => {
  const question: Question = await getQuestionById(resp.question_id);

  return (
    <div className="border p-2 my-4 bg-slate-500">
        <p id={`${index}`}>A la question "{question.question}" vous avez répondu <span className={`${resp.is_correct ? "text-green-500": "text-red-500"}`}>"{resp.user_response}" </span> en {resp.time_to_respond / 1000}s.</p>
    </div>
  )
}

export default CardForHomepage

  // user_id: string | null;
  // user_response: string;
  // is_correct: boolean;
  // time_to_respond: number;
  // creation_date: Date | null;

  //   id: number;
  // question: string;
  // good_answer: string;
  // bad_answer_1: string;
  // bad_answer_2: string | null;
  // bad_answer_3: string | null;
  // creation_date: Date | null;