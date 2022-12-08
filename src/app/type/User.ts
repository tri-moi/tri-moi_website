export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  birthDate: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  role: [string];
  password: string;
  createdAt: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  updatedAt: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  isLoggedIn?: boolean;
}
