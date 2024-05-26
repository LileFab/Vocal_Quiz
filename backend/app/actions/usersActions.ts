"use server";

import { prisma } from "@/utils/prisma";
import { UserData } from "@/app/interface/UserData";
import { currentUser } from "@clerk/nextjs/server";
import { getAllStats } from "@/app/actions/statsActions";

const getUserId = async () => {
  const user = await currentUser();
  return user?.id;
};

export async function insertNewUserInDB(_userData: any) {
  var userData: UserData = {
    clerkUserId: _userData.id,
    username: _userData.username,
    firstName: _userData.first_name,
    lastName: _userData.last_name,
    imgPath: _userData.image_url,
    averageScore: 0,
    id: "",
    createdAt: null,
    updatedAt: null,
  };

  const user = await prisma.user.create({
    data: {
      clerkUserId: userData.clerkUserId,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      imgPath: userData.imgPath,
    },
  });
}

export async function updateAverageScoreForUser() {
  const userId = await getUserId();
  const averageScore = (await getAllStats()).averageScore;
  await prisma.user.update({
    where: {
      clerkUserId: userId,
    },
    data: {
      averageScore: averageScore,
    },
  });
}
