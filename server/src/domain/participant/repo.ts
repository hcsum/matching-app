import { prisma } from "../../prisma";
import { Prisma } from "@prisma/client";

const ParticipantExtension = Prisma.defineExtension((client) => {
  return client;
});

export default prisma.participant;

