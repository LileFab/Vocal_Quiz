"use server";

import {prisma} from "@/utils/prisma"
import {auth} from "@clerk/nextjs/server"
import { UsersResponse } from"@/app/interface/UserResponse"


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

export async function getLastResponses(nb: number) {
    const Responses = await prisma.usersresponses.findMany({
        where: {
            user_id: userId
        },
        take: nb,
        orderBy: {
            creation_date: "desc"
        }
    })

    return Responses as UsersResponse[];
}