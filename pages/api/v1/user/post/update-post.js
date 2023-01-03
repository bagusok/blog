import { Prisma } from '@prisma/client';
import { authentication } from '../../../../../lib/auth';
import { prismaOrm } from '../../../../../lib/prisma';
import { decodeJwt } from '../../../../../lib/decodeJwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Tidak Valid' });
  }

  let auth = await authentication(req, res);

  if (!auth) return res.status(401).json({ status: false, message: 'Unauthorized' });

  let { username } = decodeJwt(req);

  try {
    const { title, slug, body, thumbnail, description, category, tags, postId } = req.body;

    if (!title || !slug || !body || !thumbnail || !description || !category || !tags || !postId)
      return res.status(403).json({ status: false, message: 'Please fill all field' });

    const checkPostUser = await prismaOrm.Post.findFirst({
      where: {
        id: Number(postId),
        authorUserName: username,
      },
    });

    if (!checkPostUser)
      res.status(401).json({
        status: false,
        message: 'You dont have permission to access this post',
      });

    const tagQuery = tags?.map((tag) => {
      return {
        tag: {
          connectOrCreate: {
            create: { name: tag },
            where: { name: tag },
          },
        },
      };
    });

    const deleteTag = await prismaOrm.tagOnPost.deleteMany({
      where: {
        postID: Number(postId),
      },
    });

    console.log(deleteTag);

    console.log(tags);

    const createPost = await prismaOrm.Post.update({
      data: {
        title,
        slug,
        thumbnail,
        body,
        metaTitle: title,
        metaDescription: description,
        categories: {
          connectOrCreate: {
            create: { name: category },
            where: { name: category },
          },
        },
        tag: {
          create: tagQuery || [],
        },
        isPublished: req.body.isPublished ? true : false,
        publishedAt: req.body.isPublished ? new Date() : null,
      },

      where: {
        id: Number(postId),
      },
    });

    if (!createPost) {
      return res.status(403).json({
        status: true,
        message: 'Save Post Failed',
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Save Post Success',
      data: createPost,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002' && e.meta?.target?.includes('slug')) {
        return res.status(403).json({
          status: false,
          message: 'Slug is already exist',
        });
      }
      return res.status(500).json({
        status: false,
        message: 'Eror ajah',
      });
    }

    return res.status(500).json({ status: false, message: 'Error Bangsat' });
  }
}
