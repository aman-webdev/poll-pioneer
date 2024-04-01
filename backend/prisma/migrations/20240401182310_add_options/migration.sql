/*
  Warnings:

  - You are about to drop the column `value` on the `Option` table. All the data in the column will be lost.
  - Added the required column `questionId` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surveyId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Option" DROP COLUMN "value",
ADD COLUMN     "questionId" TEXT NOT NULL,
ADD COLUMN     "totalVotes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "surveyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_OptionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OptionToUser_AB_unique" ON "_OptionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_OptionToUser_B_index" ON "_OptionToUser"("B");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionToUser" ADD CONSTRAINT "_OptionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionToUser" ADD CONSTRAINT "_OptionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
