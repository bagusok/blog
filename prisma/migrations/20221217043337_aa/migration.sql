/*
  Warnings:

  - You are about to drop the column `tagName` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `tagID` on the `TagOnPost` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagName` to the `TagOnPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TagOnPost" DROP CONSTRAINT "TagOnPost_tagID_fkey";

-- DropIndex
DROP INDEX "Tag_tagName_key";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "tagName",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TagOnPost" DROP COLUMN "tagID",
ADD COLUMN     "tagName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "TagOnPost" ADD CONSTRAINT "TagOnPost_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES "Tag"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
