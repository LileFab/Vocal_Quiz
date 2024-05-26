"use server";

import { prisma } from "@/utils/prisma";
import { UsersResponse } from "@/app/interface/UserResponse";
import { currentUser } from "@clerk/nextjs/server";
import { UserData } from "@/app/interface/UserData";
import { QuestionCategory, Difficulte } from "@/app/constants/constants";

const getUserId = async () => {
  const user = await currentUser();
  return user?.id;
};

const getLastXDays = (nb: number) => {
  const result = [];
  for (let i = 0; i < nb; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().split("T")[0];
    result.push(date);
  }
  return result.reverse();
};

export async function getAllStats() {
  const userId = await getUserId();
  const last10Days = getLastXDays(10);
  const date = new Date().toISOString().split("T")[0];
  const categories = Object.values(QuestionCategory);
  const difficulties = Object.values(Difficulte);

  const [
    nbQuestions,
    nbQuestionCorrect,
    nbQuestionAnswered,
    nbQuestionCorrectToday,
    nbQuestionAnsweredToday,
    users,
    usersResponses,
  ] = await Promise.all([
    prisma.usersresponses.count({ where: { user_id: userId } }),
    prisma.usersresponses.count({
      where: { user_id: userId, is_correct: true },
    }),
    prisma.usersresponses.count({ where: { user_id: userId } }),
    prisma.usersresponses.count({
      where: {
        user_id: userId,
        is_correct: true,
        creation_date: {
          gte: new Date(date + "T00:00:00Z"),
          lte: new Date(date + "T23:59:59Z"),
        },
      },
    }),
    prisma.usersresponses.count({
      where: {
        user_id: userId,
        creation_date: {
          gte: new Date(date + "T00:00:00Z"),
          lte: new Date(date + "T23:59:59Z"),
        },
      },
    }),
    prisma.user.findMany({ orderBy: { averageScore: "desc" } }),
    prisma.usersresponses.findMany({
      include: {
        question: {
          select: {
            category: true,
            difficulty: true,
          },
        },
      },
    }),
  ]);

  const averageScore = nbQuestionCorrect / nbQuestionAnswered;
  const averageScoreOfTheDay = nbQuestionCorrectToday / nbQuestionAnsweredToday;

  let ser: number[] = [];
  let serPerso: number[] = [];
  categories.forEach((c) => {
    let bonnesRep = usersResponses.filter(
      (ur) => ur.question.category === c && ur.is_correct
    ).length;
    let totRep = usersResponses.filter(
      (ur) => ur.question.category === c
    ).length;
    ser.push(Number((bonnesRep / totRep).toFixed(1)) * 10);
    bonnesRep = usersResponses.filter(
      (ur) =>
        ur.question.category === c && ur.is_correct && ur.user_id === userId
    ).length;
    totRep = usersResponses.filter(
      (ur) => ur.question.category === c && ur.user_id === userId
    ).length;
    serPerso.push(Number((bonnesRep / totRep).toFixed(1)) * 10);
  });

  const dataForBarChart1 = [
    { name: "Général", data: ser },
    { name: "Vous", data: serPerso },
  ];

  ser = [];
  serPerso = [];
  difficulties.forEach((d) => {
    let bonnesRep = usersResponses.filter(
      (ur) => ur.question.difficulty === d && ur.is_correct
    ).length;
    let totRep = usersResponses.filter(
      (ur) => ur.question.difficulty === d
    ).length;
    ser.push(Number((bonnesRep / totRep).toFixed(1)) * 10);
    bonnesRep = usersResponses.filter(
      (ur) =>
        ur.question.difficulty === d && ur.is_correct && ur.user_id === userId
    ).length;
    totRep = usersResponses.filter(
      (ur) => ur.question.difficulty === d && ur.user_id === userId
    ).length;
    serPerso.push(Number((bonnesRep / totRep).toFixed(1)) * 10);
  });

  const dataForBarChart2 = [
    { name: "Général", data: ser },
    { name: "Vous", data: serPerso },
  ];

  const lineOptions = {
    chart: { id: "lineChart" },
    xaxis: {
      categories: last10Days,
      title: { text: "Date" },
    },
    yaxis: { title: { text: "Nombre de parties jouées" } },
    tooltip: {
      theme: "dark",
      onDatasetHover: { highlightDataSeries: true },
    },
  };

  let result: any[] = await prisma.$queryRaw`
    SELECT DATE_TRUNC('day', "creation_date") AS date, COUNT(*) AS count
    FROM "usersresponses"
    WHERE "user_id" = ${userId}
    GROUP BY DATE_TRUNC('day', "creation_date")
    ORDER BY date;
  `;

  const daysOfResult = result.map((e) => e.date.toISOString().split("T")[0]);
  let countDays: number[] = [];
  last10Days.forEach((e) => {
    const index = daysOfResult.indexOf(e);
    if (index !== -1) {
      countDays.push(Number(result[index].count));
    } else {
      countDays.push(0);
    }
  });

  const lineSeries = [{ name: "Vous", data: countDays }];

  const filteredUsers = users.filter((valeur) => valeur.averageScore !== null);

  return {
    nbQuestions,
    averageScore,
    averageScoreOfTheDay,
    usersData: filteredUsers,
    dataForBarChart1,
    dataForBarChart2,
    lineOptions,
    lineSeries,
  };
}

export async function getLastResponsesForHomepage(nb: number) {
  const userId = await getUserId();
  const Responses = await prisma.usersresponses.findMany({
    where: {
      user_id: userId,
    },
    take: nb,
    orderBy: {
      creation_date: "desc",
    },
  });

  return Responses as UsersResponse[];
}

export async function getLastResponsesForEndpage(nb: number) {
  const userId = await getUserId();
  const Responses = await prisma.usersresponses.findMany({
    where: {
      user_id: userId,
    },
    take: nb,
    orderBy: {
      creation_date: "desc",
    },
  });

  return Responses.reverse() as UsersResponse[];
}
