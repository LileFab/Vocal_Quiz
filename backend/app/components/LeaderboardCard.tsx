"use client";

import { UserData } from "@/app/interface/UserData";
import Image from "next/image";
import { useEffect, useState } from "react";

export const LeaderboardCard = ({ index, userData }: { index: number, userData: UserData }) => {


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
      <p className={"p-3"}>
        {userData.username} score moyen : {userData.averageScore == null ? "Pas de score" : (userData.averageScore * 10).toFixed(2) + " / 10"}
      </p>
    </div>
  );
};

export default LeaderboardCard;
