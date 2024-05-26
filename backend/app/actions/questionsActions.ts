"use server";

import {prisma} from "@/utils/prisma"
import {Question} from "@/app/interface/Questions"
import {UsersResponse} from"@/app/interface/UserResponse"
import { currentUser } from '@clerk/nextjs/server';

const getUserId = async () => {
  const user = await currentUser();
  return user?.id;
}

export async function shuffleArray(array: string[]) {
  console.log("Array action" + array);
  if (!array.includes("oui")){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array as string[];
  } else {
    return ["Oui", "Non"] as string[];
  }
}

export async function get10RandomQuestions(): Promise<Question[]> {
  const questions: Question[] = await prisma.$queryRaw`SELECT * FROM questions q ORDER BY random() LIMIT 10;`
  
  return questions as Question[];
}

export async function submitUserAnswer(userResponse: UsersResponse) {
  const userId = await getUserId();

    // Affectez userId à user_id dans l'objet userResponse
    if (userId)
    userResponse.user_id = userId;

    // Créez l'enregistrement dans la base de données
    const createdUserResponse = await prisma.usersresponses.create({
      data: {
        user_id: userResponse.user_id,
        question_id: userResponse.question_id,
        user_response: userResponse.user_response,
        is_correct: userResponse.is_correct,
        creation_date: userResponse.creation_date,
        time_to_respond: userResponse.time_to_respond
      }
    });

}

export async function getQuestionById(id: number) {
  return await prisma.questions.findFirst({
    where: {
      id: id
    }
  }) as Question;
}