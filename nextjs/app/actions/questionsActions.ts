"use server";

import {prisma} from "@/utils/prisma"
import {auth} from "@clerk/nextjs/server"
import {Question} from "@/app/interface/Questions"
import {UsersResponse} from"@/app/interface/UserResponse"
import { FaQuestion } from "react-icons/fa";

const {userId}: {userId: string | null} = auth()

export async function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array as string[];
}

export async function get10RandomQuestions(): Promise<Question[]> {
  const questions: Question[] = await prisma.$queryRaw`SELECT * FROM questions q ORDER BY random() LIMIT 10;`
  
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

