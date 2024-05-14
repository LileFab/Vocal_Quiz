"use server";

import {prisma} from "@/utils/prisma"
import { UsersResponse } from"@/app/interface/UserResponse"
import { currentUser } from '@clerk/nextjs/server';

const getUserId = async () => {
  const user = await currentUser();
  return user?.id;
}


export async function getNumberOfQuestionsResponded() {
    const userId = await getUserId();
    const nbQuestion = await prisma.usersresponses.count({
        where: {
            user_id: userId
        }
    })

    return nbQuestion
}

export async function getNumberOfQuestionsRespondedCorrectly() {
    const userId = await getUserId();
    const nbQuestionCorrect = await prisma.usersresponses.count({
        where: {
            user_id: userId,
            is_correct: true
        }
    })

    return nbQuestionCorrect
}

export async function getLastResponses(nb: number) {
    const userId = await getUserId();
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