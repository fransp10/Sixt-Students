import { useRoleType } from "./User.js";
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: useRoleType;
      };
    }
  }
}
