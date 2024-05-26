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

async function insertQuestions() {
  const query = `
    INSERT INTO questions (category, difficulty, bad_answer_1, bad_answer_2, bad_answer_3, creation_date, good_answer, question) VALUES
    ('culture_generale', 'facile', 'Non', NULL, NULL, NOW(), 'Oui', 'Est-ce que la Terre est ronde?'),
    ('culture_generale', 'facile', 'Non', NULL, NULL, NOW(), 'Oui', 'Est-ce que le ciel est bleu?'),
    ('culture_generale', 'facile', 'Oui', NULL, NULL, NOW(), 'Non', 'Est-ce que les poissons volent?'),
    ('culture_generale', 'facile', 'Oui', NULL, NULL, NOW(), 'Non', 'Est-ce que le feu est froid?'),
    ('actu_politique', 'normal', 'Non', NULL, NULL, NOW(), 'Oui', 'Est-ce que l''eau gèle à 0°C?'),
    ('actu_politique', 'normal', 'Non', NULL, NULL, NOW(), 'Oui', 'Est-ce que le soleil est une étoile?'),
    ('actu_politique', 'normal', 'Oui', NULL, NULL, NOW(), 'Non', 'Est-ce que les humains peuvent respirer sous l''eau sans équipement?'),
    ('actu_politique', 'normal', 'Oui', NULL, NULL, NOW(), 'Non', 'Est-ce que les arbres produisent de l''oxygène la nuit?'),
    ('art_litterature', 'difficile', 'Non', NULL, NULL, NOW(), 'Oui', 'Est-ce que Napoléon a été empereur de France?'),
    ('art_litterature', 'difficile', 'Non', NULL, NULL, NOW(), 'Oui', 'Est-ce que la Révolution française a eu lieu en 1789?'),
    ('art_litterature', 'difficile', 'Oui', NULL, NULL, NOW(), 'Non', 'Est-ce que Christophe Colomb a découvert l''Amérique en 1492?'),
    ('art_litterature', 'difficile', 'Oui', NULL, NULL, NOW(), 'Non', 'Est-ce que la Première Guerre mondiale a commencé en 1939?'),
    ('musique', 'facile', 'Non', NULL, NULL, NOW(), 'Oui', 'Est-ce que les pyramides d''Égypte sont des tombes?'),
    ('musique', 'facile', 'Non', NULL, NULL, NOW(), 'Oui', 'Est-ce que la Joconde est un tableau de Léonard de Vinci?'),
    ('musique', 'facile', 'Oui', NULL, NULL, NOW(), 'Non', 'Est-ce que le Taj Mahal est en France?'),
    ('musique', 'facile', 'Oui', NULL, NULL, NOW(), 'Non', 'Est-ce que le mont Everest est la plus haute montagne du monde?'),
    ('tv_cinema', 'normal', 'Non', NULL, NULL, NOW(), 'Oui', 'Est-ce que la programmation est une compétence informatique?'),
    ('tv_cinema', 'normal', 'Non', NULL, NULL, NOW(), 'Oui', 'Est-ce que les ordinateurs utilisent des processeurs?'),
    ('tv_cinema', 'normal', 'Oui', NULL, NULL, NOW(), 'Non', 'Est-ce que HTML est un langage de programmation?'),
    ('tv_cinema', 'normal', 'Oui', NULL, NULL, NOW(), 'Non', 'Est-ce que les téléphones portables n''ont pas besoin de batteries?');
  `;

  await prisma.$executeRawUnsafe(query);
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

importNewQuestions(20, QuestionType.sport, Difficulte.facile);
importNewQuestions(20, QuestionType.sport, Difficulte.normal);
importNewQuestions(20, QuestionType.jeux_videos, Difficulte.facile);
importNewQuestions(20, QuestionType.jeux_videos, Difficulte.normal);
importNewQuestions(20, QuestionType.culture_generale, Difficulte.facile);
importNewQuestions(20, QuestionType.culture_generale, Difficulte.normal);
importNewQuestions(20, QuestionType.actu_politique, Difficulte.facile);
importNewQuestions(20, QuestionType.actu_politique, Difficulte.normal);
importNewQuestions(20, QuestionType.musique, Difficulte.facile);
importNewQuestions(20, QuestionType.musique, Difficulte.normal);
importNewQuestions(20, QuestionType.art_litterature, Difficulte.facile);
importNewQuestions(20, QuestionType.art_litterature, Difficulte.normal);
importNewQuestions(20, QuestionType.tv_cinema, Difficulte.facile);
importNewQuestions(20, QuestionType.tv_cinema, Difficulte.normal);
insertQuestions();
