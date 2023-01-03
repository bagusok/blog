/*
  Warnings:

  - You are about to drop the `_CategoriesToPost` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoriesName` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CategoriesToPost" DROP CONSTRAINT "_CategoriesToPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoriesToPost" DROP CONSTRAINT "_CategoriesToPost_B_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "categoriesName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "_CategoriesToPost";

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "tagName" TEXT NOT NULL,
    "postID" INTEGER[],

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagOnPost" (
    "id" SERIAL NOT NULL,
    "postID" INTEGER NOT NULL,
    "tagID" INTEGER NOT NULL,

    CONSTRAINT "TagOnPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tagName_key" ON "Tag"("tagName");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoriesName_fkey" FOREIGN KEY ("categoriesName") REFERENCES "Categories"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnPost" ADD CONSTRAINT "TagOnPost_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnPost" ADD CONSTRAINT "TagOnPost_tagID_fkey" FOREIGN KEY ("tagID") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
