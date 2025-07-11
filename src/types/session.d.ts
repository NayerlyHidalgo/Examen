declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    isAdmin?: boolean;
  }
}
