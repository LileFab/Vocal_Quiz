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

  const series = [((nbCorrectAnswers / nbQuestions) * 100).toFixed(2)];
  const options = {
  chart: {
    type: 'radialBar', // Change the type to 'bar' for radialBar chart
    offsetY: -20,
    sparkline: {
      enabled: true
    }
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: "#e7e7e7",
        strokeWidth: '97%',
        margin: 5, // margin is in pixels
        dropShadow: {
          enabled: true,
          top: 2,
          left: 0,
          color: '#999',
          opacity: 1,
          blur: 2
        }
      },
      dataLabels: {
        name: {
          show: false
        },
        value: {
          offsetY: -2,
          fontSize: '22px'
        }
      }
    }
  },
  grid: {
    padding: {
      top: -10
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      shadeIntensity: 0.4,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 53, 91]
    },
  },
  labels: ['Average Results']
};

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <h1>Pourcentage de bonne rep</h1>
          <Chart
            type="radialBar"
            options={options}
            series={series}
            width="500"
          />
          <h1 className="text-2xl">Nombre de questions répondues : {nbQuestions}</h1>
          <h1 className="text-2xl">Nombre de questions répondues correctement : {nbCorrectAnswers}</h1>
        </div>
      </div>
    </div>
  );
};

export default App;
