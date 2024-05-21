"use client";

import { UserData } from "@/app/interface/UserData";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { useEffect, useState } from "react";

export const LeaderboardCard = ({ index, userData }: { index: number, userData: UserData }) => {
  const [currentUserId, setCurrentUserId] = useState<string>("No user Id");

  useEffect(() => {
    const getUser = async () => {
      const user = await currentUser();
      if (user) {
        setCurrentUserId(user.id);
        console.log(user.id)
        console.log(userData.clerkUserId)
      }
    };
    getUser();
  }, []);

  return (
    <div key={index} className="border p-2 my-4 bg-slate-500 flex items-center">
      <Image
        src={userData.imgPath}
        width={50}
        height={30}
        alt="UserImage"
        className="block"
      />
      {/* WIP */}
      <p className={currentUserId === userData.clerkUserId ? "text-green-500" : ""}>
        {userData.username} score moyen : {userData.averageScore == null ? "Pas de score" : userData.averageScore}
      </p>
    </div>
  );
};

export default LeaderboardCard;
