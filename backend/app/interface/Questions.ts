export interface Question {
  id: number;
  question: string;
  good_answer: string;
  bad_answer_1: string;
  bad_answer_2: string | null;
  bad_answer_3: string | null;
  creation_date: Date | null;
  category: String | null;
  difficulty: String | null;
}
