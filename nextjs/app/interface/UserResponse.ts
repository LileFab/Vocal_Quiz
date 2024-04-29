export interface UsersResponse {
  question_id: number;
  user_id: string | null;
  user_response: string;
  is_correct: boolean;
  time_to_respond: number;
  creation_date: Date | null;
}

