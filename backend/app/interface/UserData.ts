export interface UserData {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  clerkUserId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  imgPath: string;
  averageScore: number | null;
}
