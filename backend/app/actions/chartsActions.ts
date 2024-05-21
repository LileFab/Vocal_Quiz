"use server";

import {prisma} from "@/utils/prisma"
import {Question} from "@/app/interface/Questions"
import {UsersResponse} from"@/app/interface/UserResponse"
import { currentUser } from '@clerk/nextjs/server';

const getUserId = async () => {
  const user = await currentUser();
  return user?.id;
}

