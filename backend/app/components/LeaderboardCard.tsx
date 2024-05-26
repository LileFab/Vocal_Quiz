"use client";

import { UserData } from "@/app/interface/UserData";
import Image from "next/image";

export const LeaderboardCard = ({ index, userData }: { index: number, userData: UserData }) => {


  return (
    <div key={index} className="border p-2 my-4 bg-slate-500 flex items-center w-full">
      <Image
        src={userData.imgPath}
        width={50}
        height={30}
        alt="UserImage"
        className="block"
      />
      {/* WIP */}
      <div className="px-2">
        <p className={`font-bold`}>{userData.username}</p>
        <p className="pt-2">Score moyen : {userData.averageScore == null ? "Pas de score" : (userData.averageScore * 10).toFixed(2) + " / 10"}</p>
      </div>
    </div>
  );
};

export default LeaderboardCard;

