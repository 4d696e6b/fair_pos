export interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  notifyEmail?: boolean;
  notifySalesSummary?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
