"use server";

import { revalidatePath } from "next/cache"
import {prisma} from "@/utils/prisma"
import {auth} from "@clerk/nextjs/server"
import {Question} from "@/app/interface/Questions"
import {UsersResponse} from"@/app/interface/UserResponse"

const {userId}: {userId: string | null} = auth()

export async function get10RandomQuestions(): Promise<Question[]> {
  const questions: Question[] = await prisma.questions.findMany({
    take: 10, // Limite de 10 éléments
  });

  // Assurez-vous que les données sont correctement typées avant de les retourner
  return questions as Question[];
}

export async function submitUserAnswer(userResponse : UsersResponse) {
  userResponse.user_id = userId;
  prisma.usersresponses.create({
    data: {
      user_id: userResponse.user_id,
      question_id: userResponse.question_id,
      user_response: userResponse.user_response,
      is_correct: userResponse.is_correct,
      creation_date: userResponse.creation_date,
      time_to_respond: userResponse.time_to_respond
    }
  })
}
