"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { getNumberOfQuestionsResponded, getNumberOfQuestionsRespondedCorrectly } from "../actions/statsActions";

const App = () => {
  const [nbQuestions, setNbQuestions] = useState(0);
  const [nbCorrectAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setNbQuestions(await getNumberOfQuestionsResponded());
      setCorrectAnswers(await getNumberOfQuestionsRespondedCorrectly());
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-between p-4">
        <h1 className="text-3xl capitalize font-bold mb-10">Statistiques</h1>
    
        <div className="flex flex-row w-full">
          <div className="w-1/4 border p-4">
            <p><u>Meilleur score du jour :</u></p>
            <h3 className="flex items-center justify-center text-4xl font-bold">7/10</h3>
          </div>
          <div className="w-1/4 border p-4">
            <p><u>Score Moyen :</u></p>
            <h3 className="flex items-center justify-center text-4xl font-bold">4.35/10</h3>
          </div>
          <div className="w-1/4 border p-4">
            <p><u>Nombre de parties :</u></p>
            <h3 className="flex items-center justify-center text-4xl font-bold">32</h3>
          </div>
          <div className="w-1/4 border p-4">
            <p><u>Thème préféré :</u></p>
            <h3 className="flex items-center justify-center text-4xl font-bold">Sport</h3>
          </div>
        </div>

        <div className="flex flex-row w-full">
            <div className="w-1/2 border p-4">
                <p><u>Score moyen par thème :</u></p>
            </div>
            <div className="w-1/2 border p-4">
                <p><u>Nombre de question répondu par thème :</u></p>
            </div>
        </div>

        <div className="flex flex-row w-full">
            <div className="w-2/3 border p-4">
                <p><u>Evolution des scores :</u></p>
            </div>
            <div className="w-1/3 border p-4">
                <p><u>Tableau des scores :</u></p>
                <table className="w-full">
                <thead>
                    <tr>
                        <th className="border p-2">#</th>
                        <th className="border p-2">Nom</th>
                        <th className="border p-2">Score moyen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border p-2 flex items-center justify-center">
                          <Image
                                src={"/medaille_or.png"}
                                width={50}
                                height={50}
                                alt="First Place Image"
                                className="block"
                          />
                        </td>
                        <td className="border p-2">Andrea Joly</td>
                        <td className="border p-2">8.8</td>
                    </tr>
                    <tr>
                        <td className="border p-2 flex items-center justify-center">
                          <Image
                                  src={"/medaille_argent.png"}
                                  width={40}
                                  height={40}
                                  alt="Second Place Image"
                                  className="block"
                            />
                        </td>
                        <td className="border p-2">Loick Ramadier</td>
                        <td className="border p-2">8.2</td>
                    </tr>
                    <tr>
                        <td className="border p-2 flex items-center justify-center">
                          <Image
                                  src={"/medaille_bronze.png"}
                                  width={35}
                                  height={35}
                                  alt="Third Place Image"
                                  className="block"
                            />
                        </td>
                        <td className="border p-2">Fabien Fleisch</td>
                        <td className="border p-2">8</td>
                    </tr>
                    <tr>
                        <td className="border p-2 flex items-center justify-center">4</td>
                        <td className="border p-2">Adrien Jouve</td>
                        <td className="border p-2">7.4</td>
                    </tr>
                    <tr>
                        <td className="border p-2 flex items-center justify-center">5</td>
                        <td className="border p-2">Bla bla bla</td>
                        <td className="border p-2">7.2</td>
                    </tr>
                    <tr>
                        <td className="border p-2 flex items-center justify-center">6</td>
                        <td className="border p-2">Bob</td>
                        <td className="border p-2">6.8</td>
                    </tr>
                    <tr>
                        <td className="border p-2 flex items-center justify-center">7</td>
                        <td className="border p-2">Peter John</td>
                        <td className="border p-2">6.5</td>
                    </tr>
                    <tr>
                        <td className="border p-2 flex items-center justify-center">8</td>
                        <td className="border p-2">Toto</td>
                        <td className="border p-2">6</td>
                    </tr>
                    <tr>
                        <td className="border p-2 flex items-center justify-center">9</td>
                        <td className="border p-2">Bla bla</td>
                        <td className="border p-2">5</td>
                    </tr>
                    <tr>
                        <td className="border p-2 flex items-center justify-center">10</td>
                        <td className="border p-2">Adam</td>
                        <td className="border p-2">0</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>

    </div>
  
  )

};

export default App;
