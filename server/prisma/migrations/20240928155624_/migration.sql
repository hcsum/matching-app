-- CreateTable
CREATE TABLE "event_admin" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "eventId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "event_admin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_admin" ADD CONSTRAINT "event_admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_admin" ADD CONSTRAINT "event_admin_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "matching_event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
