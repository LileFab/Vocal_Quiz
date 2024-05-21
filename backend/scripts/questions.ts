import {prisma} from "../utils/prisma"

enum QuestionType {
  tv_cinema = "tv_cinema",
  art_litterature = "art_litterature",
  musique = "musique",
  actu_politique = "actu_politique",
  culture_generale = "culture_generale",
  sport = "sport",
  jeux_videos = "jeux_videos"
}

enum Difficulte {
 facile = "facile",
 normal = "normal",
 difficile = "difficile"
}

interface Question {
  id?: number;
  question: string;
  good_answer: string;
  bad_answer_1: string;
  bad_answer_2: string | null;
  bad_answer_3: string | null;
  creation_date: Date | null;
  category: string | null;
  difficulty: string | null;
}


interface QuestionFromAPI {
  id: string;
  question: string;
  answer: string;
  badAnswers: string[];
  category: string;
  difficulty: string;
}

async function importNewQuestions(nb: number, type: QuestionType, diff: Difficulte) {
  const response = await fetch(`https://quizzapi.jomoreschi.fr/api/v1/quiz?limit=${nb}&category=${type}&difficulty=${diff}`);
  const questions = await response.json();
  console.log(questions); // Ajoutez cette ligne pour inspecter les données
questions.quizzes.forEach(async (apiQuestion: QuestionFromAPI) => {
    if ('badAnswers' in apiQuestion) {
        const { question, answer, badAnswers, category, difficulty } = apiQuestion;
        const Question: Question = {
            question,
            good_answer: answer,
            bad_answer_1: badAnswers[0],
            bad_answer_2: badAnswers[1],
            bad_answer_3: badAnswers[2] || null,
            creation_date: new Date(),
            category: category,
            difficulty: difficulty

        };
        await prisma.questions.create({
        data: {
          question: Question.question,
          good_answer: Question.good_answer,
          bad_answer_1: Question.bad_answer_1,
          bad_answer_2: Question.bad_answer_2,
          bad_answer_3: Question.bad_answer_3,
          creation_date: Question.creation_date,
          category: Question.category,
          difficulty: Question.difficulty
        }
      });
    }
});
}

// enum QuestionType {
//   tv_cinema = "tv_cinema",
//   art_litterature = "art_litterature",
//   musique = "musique",
//   actu_politique = "actu_politique",
//   culture_generale = "culture_generale",
//   sport = "sport",
//   jeux_videos = "jeux_videos"
// }

// enum Difficulte {
//  facile = "facile",
//  normal = "normal",
//  difficile = "difficile"
// }

importNewQuestions(10, QuestionType.sport, Difficulte.facile);
importNewQuestions(10, QuestionType.sport, Difficulte.normal);
importNewQuestions(10, QuestionType.jeux_videos, Difficulte.facile);
importNewQuestions(10, QuestionType.jeux_videos, Difficulte.normal);
importNewQuestions(10, QuestionType.culture_generale, Difficulte.facile);
importNewQuestions(10, QuestionType.culture_generale, Difficulte.normal);
importNewQuestions(10, QuestionType.actu_politique, Difficulte.facile);
importNewQuestions(10, QuestionType.actu_politique, Difficulte.normal);
importNewQuestions(10, QuestionType.musique, Difficulte.facile);
importNewQuestions(10, QuestionType.musique, Difficulte.normal);
importNewQuestions(10, QuestionType.art_litterature, Difficulte.facile);
importNewQuestions(10, QuestionType.art_litterature, Difficulte.normal);
importNewQuestions(10, QuestionType.tv_cinema, Difficulte.facile);
importNewQuestions(10, QuestionType.tv_cinema, Difficulte.normal);
