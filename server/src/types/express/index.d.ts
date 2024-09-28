import { user, participant, photo } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      ctx: {
        user?: user & {
          isProfileComplete: boolean;
          isBioComplete: boolean;
          photos: photo[];
        };
        participant?: participant;
      };
    }
  }
}

