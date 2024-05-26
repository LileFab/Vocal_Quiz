"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {getRespondedQuestionsLast10Days, getOptionsForLineChart, getNumberOfQuestionsResponded, getAverageScore, getAverageScoreOfTheDay, getDataForLeaderboard, getDataForBarChart1, getDataForBarChart2 } from "../actions/statsActions";
import { motion } from "framer-motion"
import { UserData} from "@/app/interface/UserData"
import LeaderboardCard from "@/app/components/LeaderboardCard"
import { barOptions1, barOptions2 } from "../constants/chartsOption";
 
const App = () => {
  const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

  const [nbQuestions, setNbQuestions] = useState(0);
  const [AverageScore, setAverageScore] = useState(0);
  const [AverageScoreOfTheDay, setAverageScoreOfTheDay] = useState(0);
  const [usersData, setusersData] = useState<undefined | UserData[]>(undefined);
  const [dataForBarChart1, setdataForBarChart1] = useState<any>(null);
  const [dataForBarChart2, setdataForBarChart2] = useState<any>(null);
  const [lineOptions, setLineOptions] = useState<any>(null);
  const [lineSeries, setLineSeries] = useState<any>(null);
  const [currentDate, setcurrentDate] = useState(new Date());


  useEffect(() => {
    const fetchData = async () => {
      setNbQuestions(await getNumberOfQuestionsResponded());
      setAverageScore(await getAverageScore());
      setAverageScoreOfTheDay(await getAverageScoreOfTheDay());
      setusersData(await getDataForLeaderboard())
      setdataForBarChart1(await getDataForBarChart1())
      setdataForBarChart2(await getDataForBarChart2())
      setcurrentDate(new Date())
      setLineOptions(await getOptionsForLineChart())
      setLineSeries(await getRespondedQuestionsLast10Days())
    };
    fetchData();
  }, []);

  return(
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-screen"
      >
        <div className="grid grid-cols-3 mt-10 border-4 border-black p-4 m-2 rounded-xl">
          <div className="border-r-4 border-black pl-2 text-center pr-2">
            <h3 className="text-s font-bold pb-2 text-2xl"><p>Score moyen du jour :</p></h3>
            <h3 className="flex items-center justify-center text-xl">{!Number.isNaN(AverageScoreOfTheDay) ? ((AverageScoreOfTheDay * 10).toFixed(2) + " / 10") : "Aucune partie enregistrée aujourd'hui"}</h3>
          </div>
          <div className="border-r-4 border-black pl-4 text-center text-2xl">
            <h3 className="text-s font-bold pb-2"><p>Score moyen :</p></h3>
            <h3 className="flex items-center justify-center text-xl">{!Number.isNaN(AverageScore) ? (AverageScore * 10).toFixed(2) + "/10": "Aucune partie enregistrée"}</h3>
          </div>
          <div className="text-center">
            <h3 className="text-s font-bold pb-2 text-xl"><p>Nombre de questions répondues :</p></h3>
            <h3 className="flex items-center justify-center text-xl">{nbQuestions}</h3>
          </div>

        </div>
        <div className="grid grid-cols-3 space-x-4 p-2">
          <div className="col-span-2 px-8 pt-8 border-4 border-black rounded-xl items-center place-content-between">
            <div className="grid grid-cols-2">
              <div className="text-center">
                <h3 className="text-s font-bold pb-2"><p>Score moyen par catégorie</p></h3>
                <ApexChart type="bar" options={barOptions1} series={dataForBarChart1} height={500} width={380} />
              </div>
              <div className="text-center">
                <h3 className="text-s font-bold pb-2"><p>Score moyen par difficulté</p></h3>
                <ApexChart type="bar" options={barOptions2} series={dataForBarChart2} height={430} width={400} />
              </div>
            </div>
            <div className="w-full text-center">
              <h3 className="text-s font-bold pb-2"><p>Nombres de parties jouées par jour</p></h3>
              <ApexChart type="line" options={lineOptions} series={lineSeries} height={300} width={870} />
            </div>
          </div>
          <div className="border-4 border-black rounded-xl px-3">
            <h1 className="text-4xl text-center">Leaderboard</h1>
            <div>{usersData &&
              (usersData.map((userData: UserData, index: number) => {
              return(
                <LeaderboardCard index={index} userData={userData}/>
              )
            }))}
            </div>
          </div>
        </div>
      </motion.div>
  
  )
};

export default App;
