CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CreateTable
CREATE TABLE "matching_event" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "phase" VARCHAR NOT NULL DEFAULT 'inactive',
    "choosingStartsAt" TIMESTAMP(6) NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "PK_65624d28d02d4d1e9d01e227776" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participant" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "hasConfirmedPicking" BOOLEAN NOT NULL DEFAULT false,
    "postMatchingAction" VARCHAR,
    "userId" UUID NOT NULL,
    "matchingEventId" UUID NOT NULL,
    "hasUpdatedProfile" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "url" VARCHAR NOT NULL,
    "userId" UUID,

    CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "picking" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "matchingEventId" UUID NOT NULL,
    "madeByUserId" UUID NOT NULL,
    "pickedUserId" UUID NOT NULL,
    "isInsisted" BOOLEAN NOT NULL DEFAULT false,
    "isReverse" BOOLEAN NOT NULL DEFAULT false,
    "isInsistResponded" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_ca69806eaffe87469fec16ad0b1" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR,
    "gender" VARCHAR,
    "phoneNumber" VARCHAR,
    "age" INTEGER,
    "jobTitle" VARCHAR,
    "wechatId" VARCHAR,
    "bio" JSONB NOT NULL DEFAULT '{}',
    "loginToken" VARCHAR,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wechatOpenId" VARCHAR,

    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_b421dfc701991352786fd102baa" ON "participant"("userId", "matchingEventId");

-- AddForeignKey
ALTER TABLE "participant" ADD CONSTRAINT "FK_74c88acd49c4572ed56ba7b31bc" FOREIGN KEY ("matchingEventId") REFERENCES "matching_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participant" ADD CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "FK_4494006ff358f754d07df5ccc87" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picking" ADD CONSTRAINT "FK_0e6c0767733d3dc7d0cd32591bc" FOREIGN KEY ("pickedUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picking" ADD CONSTRAINT "FK_941fab583d61f8f58ad038118d9" FOREIGN KEY ("madeByUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picking" ADD CONSTRAINT "FK_c810aa9c2884f17395d27ea6f82" FOREIGN KEY ("matchingEventId") REFERENCES "matching_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

