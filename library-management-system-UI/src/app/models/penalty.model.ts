export interface Penalty {
  id: number;
  bookId: number;
  studentId: number;
  student?: {
    email: string;
  };
  book: {
    title: string;
    author: string;
  };
  approvedOn: string;
  penaltyAmount: number;
}
