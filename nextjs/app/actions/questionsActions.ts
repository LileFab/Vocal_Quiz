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

export async function submitUserAnswer(userResponse: UsersResponse) {
  try {
    // Assurez-vous que userId n'est pas null avant de procéder
    if (!userId) {
      throw new Error("User ID is null");
    }

    // Affectez userId à user_id dans l'objet userResponse
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

    console.log("User response created:", createdUserResponse);
  } catch (error) {
    console.error("Error submitting user answer:", error);
    throw error; // Rejetez l'erreur pour une gestion supplémentaire
  }
}

