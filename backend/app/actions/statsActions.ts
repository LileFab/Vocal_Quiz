"use server";

import {prisma} from "@/utils/prisma"
import { UsersResponse } from"@/app/interface/UserResponse"
import { currentUser } from '@clerk/nextjs/server';
import {UserData} from "@/app/interface/UserData"
import { QuestionCategory, Difficulte } from "@/app/constants/constants"

const getUserId = async () => {
  const user = await currentUser();
  return user?.id;
}

const getAllUsersInDB = async () => {
    const users = await prisma.user.findMany({
        orderBy: {
            averageScore: 'desc'
        }
    });

    return users as UserData[] | undefined;
}


export async function getNumberOfQuestionsResponded() {
    const userId = await getUserId();
    const nbQuestion = await prisma.usersresponses.count({
        where: {
            user_id: userId
        }
    })

    return nbQuestion as number;
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

export async function getAverageScore () {
    const userId = await getUserId();
    const nbQuestionCorrect = await prisma.usersresponses.count({
        where: {
            user_id: userId,
            is_correct: true
        }
    })
    const nbQuestionAnswered = await prisma.usersresponses.count({
        where: {
            user_id: userId
        }
    })

    return (nbQuestionCorrect / nbQuestionAnswered) as number;
}


export async function getAverageScoreOfTheDay () {
    const userId = await getUserId();
    const date = new Date().toISOString().split('T')[0]
    const nbQuestionCorrectToday = await prisma.usersresponses.count({
        where: {
            user_id: userId,
            is_correct: true,
            creation_date: {
                gte: new Date(date + 'T00:00:00Z'),
                lte: new Date(date + 'T23:59:59Z')  
            }
        }
    })
    const nbQuestionAnsweredToday = await prisma.usersresponses.count({
        where: {
            user_id: userId,
            creation_date: {
                gte: new Date(date + 'T00:00:00Z'),
                lte: new Date(date + 'T23:59:59Z')  
            }
        }
    })

    return (nbQuestionCorrectToday / nbQuestionAnsweredToday) as number;
}

export async function getDataForLeaderboard() {
    const users = await getAllUsersInDB();
    if (users !== undefined){
        return users as UserData[];
    }
}

export async function getDataForBarChart1() {
    const userId = await getUserId();
    const categories = Object.values(QuestionCategory);
    let ser: number[] = [];
    let serPerso: number[] =[];

  const usersResponses = await prisma.usersresponses.findMany({
    include: {
      question: {
        select: {
          category: true,
          difficulty: true,
        },
      },
    },
  });

  categories.forEach(c => {
    let bonnesRep: number = usersResponses.filter( (ur) => (ur.question.category === c && ur.is_correct)).length
    let totRep: number = usersResponses.filter( (ur) => (ur.question.category === c)).length
    ser.push(Number((bonnesRep / totRep).toFixed(1)))
    bonnesRep = usersResponses.filter( (ur) => (ur.question.category === c && ur.is_correct && ur.user_id === userId)).length
    totRep = usersResponses.filter( (ur) => (ur.question.category === c && ur.user_id === userId)).length
    serPerso.push(Number((bonnesRep / totRep).toFixed(1)))
  })

  const series = [{
    name: 'Général',
    data: ser
  },
  {
    name: 'Vous',
    data: serPerso
  }
    ]
  return series
}

export async function getDataForBarChart2() {
    const userId = await getUserId();
    const diff = Object.values(Difficulte);
    let ser: number[] = [];
    let serPerso: number[] =[];

  const usersResponses = await prisma.usersresponses.findMany({
    include: {
      question: {
        select: {
          category: true,
          difficulty: true,
        },
      },
    },
  });

  diff.forEach(d => {
    let bonnesRep: number = usersResponses.filter( (ur) => (ur.question.difficulty === d && ur.is_correct)).length
    let totRep: number = usersResponses.filter( (ur) => (ur.question.difficulty === d)).length
    ser.push(Number((bonnesRep / totRep).toFixed(1)))
    bonnesRep = usersResponses.filter( (ur) => (ur.question.difficulty === d && ur.is_correct && ur.user_id === userId)).length
    totRep = usersResponses.filter( (ur) => (ur.question.difficulty === d && ur.user_id === userId)).length
    serPerso.push(Number((bonnesRep / totRep).toFixed(1)))
  })

  const series = [{
    name: 'Général',
    data: ser
  },
  {
    name: 'Vous',
    data: serPerso
  }
    ]
  return series
}