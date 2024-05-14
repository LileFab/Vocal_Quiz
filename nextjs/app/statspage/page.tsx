"use client";

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

};

export default App;
