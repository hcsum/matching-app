import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient().$extends({
  result: {
    user: {
      hasValidProfile: {
        compute(data) {
          return Boolean(data.age && data.name && data.jobTitle && data.gender);
        },
      },
    },
  },
});

