-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('TEXT', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'NUMBER', 'DATE', 'IMAGE');

-- CreateTable
CREATE TABLE "public"."form_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "form_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."questions" (
    "id" TEXT NOT NULL,
    "formTemplateId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."QuestionType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."question_options" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "value" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."form_responses" (
    "id" TEXT NOT NULL,
    "formTemplateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."question_answers" (
    "id" TEXT NOT NULL,
    "formResponseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "textAnswer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."question_answer_options" (
    "id" TEXT NOT NULL,
    "questionAnswerId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "questions_formTemplateId_order_idx" ON "public"."questions"("formTemplateId", "order");

-- CreateIndex
CREATE INDEX "question_options_questionId_order_idx" ON "public"."question_options"("questionId", "order");

-- CreateIndex
CREATE INDEX "form_responses_userId_formTemplateId_completedAt_idx" ON "public"."form_responses"("userId", "formTemplateId", "completedAt");

-- CreateIndex
CREATE INDEX "question_answers_formResponseId_idx" ON "public"."question_answers"("formResponseId");

-- CreateIndex
CREATE INDEX "question_answers_questionId_idx" ON "public"."question_answers"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "question_answers_formResponseId_questionId_key" ON "public"."question_answers"("formResponseId", "questionId");

-- CreateIndex
CREATE INDEX "question_answer_options_questionAnswerId_idx" ON "public"."question_answer_options"("questionAnswerId");

-- CreateIndex
CREATE UNIQUE INDEX "question_answer_options_questionAnswerId_optionId_key" ON "public"."question_answer_options"("questionAnswerId", "optionId");

-- AddForeignKey
ALTER TABLE "public"."form_templates" ADD CONSTRAINT "form_templates_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_formTemplateId_fkey" FOREIGN KEY ("formTemplateId") REFERENCES "public"."form_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_options" ADD CONSTRAINT "question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."form_responses" ADD CONSTRAINT "form_responses_formTemplateId_fkey" FOREIGN KEY ("formTemplateId") REFERENCES "public"."form_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."form_responses" ADD CONSTRAINT "form_responses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_answers" ADD CONSTRAINT "question_answers_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "public"."form_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_answers" ADD CONSTRAINT "question_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_answer_options" ADD CONSTRAINT "question_answer_options_questionAnswerId_fkey" FOREIGN KEY ("questionAnswerId") REFERENCES "public"."question_answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_answer_options" ADD CONSTRAINT "question_answer_options_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "public"."question_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
