"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getNumberOfQuestionsResponded, getAverageScore, getAverageScoreOfTheDay, getDataForLeaderboard, getDataForBarChart1, getDataForBarChart2 } from "../actions/statsActions";
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
        <div className="grid grid-cols-4 mt-10 border-2 border-black p-8 m-2">
          <div className="border-r-4 border-black pl-8">Score moyen du jour : {AverageScoreOfTheDay * 10} / 10</div>
          <div className="border-r-4 border-black px-20">Score moyen : {(AverageScore * 10).toFixed(2)} / 10</div>
          <div className="border-r-4 border-black px-20">Nombre de questions répondues : {nbQuestions}</div>
          <div className="border-l-4 border-black px-20">theme avec le meilleur score</div>
        </div>
        <div className="grid grid-cols-3 space-x-4 p-2">
          <div className="col-span-2">
            <div className="grid grid-cols-2">
              <div>
                <ApexChart type="bar" options={barOptions1} series={dataForBarChart1} height={500} width={500} />
              </div>
              <div>
                <ApexChart type="bar" options={barOptions2} series={dataForBarChart2} height={500} width={500} />
              </div>
            </div>
            <div className="w-full">
              <ApexChart type="line" options={barOptions1} series={dataForBarChart1} height={300} width={1000} />
            </div>
          </div>
          <div>
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
