import { user, participant } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      ctx: {
        user?: user & {
          hasValidProfile: boolean;
        };
        participant?: participant;
      };
    }
  }
}

