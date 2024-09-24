import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../prisma";

const pickingExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      picking: {
        async getPickedUsersByUserIdAndEventId(params: {
          madeByUserId: string;
          matchingEventId: string;
        }) {
          return client.picking.findMany({
            where: {
              madeByUserId: params.madeByUserId,
              matchingEventId: params.matchingEventId,
            },
            include: {
              pickedUser: {
                include: {
                  photos: true,
                },
              },
            },
          });
        },
        async getPickingUsersByUserIdAndEventId(params: {
          pickedUserId: string;
          matchingEventId: string;
        }) {
          return client.picking.findMany({
            where: {
              pickedUserId: params.pickedUserId,
              matchingEventId: params.matchingEventId,
            },
            include: {
              madeByUser: {
                include: {
                  photos: true,
                },
              },
            },
          });
        },
      },
    },
  });
});

export default prisma.$extends(pickingExtension).picking;

