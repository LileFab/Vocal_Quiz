import { QuestionCategory, Difficulte } from "./constants";

export const barOptions1 = {
  chart: {
    id: "barChart",
  },
  xaxis: {
    categories: Object.values(QuestionCategory),
    title: {
      text: "Thèmes",
    },
  },
  yaxis: {
    title: {
      text: "Score moyen",
    },
  },
  tooltip: {
    theme: "dark",
    onDatasetHover: {
      highlightDataSeries: true,
    },
  },
};

export const barOptions2 = {
  chart: {
    id: "barChart",
  },
  xaxis: {
    categories: Object.values(Difficulte),
    title: {
      text: "Difficultée",
    },
  },
  yaxis: {
    title: {
      text: "Score moyen",
    },
  },
  tooltip: {
    theme: "dark",
    onDatasetHover: {
      highlightDataSeries: true,
    },
  },
};
