import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../prisma";
import { UserOmitArgs } from "../../controller/matching-event";

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
                omit: UserOmitArgs,
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
                omit: UserOmitArgs,
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

