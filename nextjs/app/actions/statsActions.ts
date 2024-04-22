"use server";

import {prisma} from "@/utils/prisma"
import {auth} from "@clerk/nextjs/server"

const {userId}: {userId: string | null} = auth()


export async function getNumberOfQuestionsResponded() {
    const nbQuestion = await prisma.usersresponses.count({
        where: {
            user_id: userId
        }
    })

    return nbQuestion
}

export async function getNumberOfQuestionsRespondedCorrectly() {
    const nbQuestionCorrect = await prisma.usersresponses.count({
        where: {
            user_id: userId,
            is_correct: true
        }
    })

    return nbQuestionCorrect
}