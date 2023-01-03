-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorUserName_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_categoriesName_fkey";

-- DropForeignKey
ALTER TABLE "TagOnPost" DROP CONSTRAINT "TagOnPost_postID_fkey";

-- DropForeignKey
ALTER TABLE "TagOnPost" DROP CONSTRAINT "TagOnPost_tagName_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorUserName_fkey" FOREIGN KEY ("authorUserName") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoriesName_fkey" FOREIGN KEY ("categoriesName") REFERENCES "Categories"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnPost" ADD CONSTRAINT "TagOnPost_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnPost" ADD CONSTRAINT "TagOnPost_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES "Tag"("name") ON DELETE CASCADE ON UPDATE CASCADE;
