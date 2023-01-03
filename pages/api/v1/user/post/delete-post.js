import { Prisma } from '@prisma/client';
import { authentication } from '../../../../../lib/auth';
import { prismaOrm } from '../../../../../lib/prisma';
import { decodeJwt } from '../../../../../lib/decodeJwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Tidak Valid' });
  }

  let auth = await authentication(req, res);

  if (!auth) {
    return res.status(401).json({ status: false, message: 'Unauthorized' });
  }

  let { username } = decodeJwt(req);

  try {
    const { postId } = req.body;

    const checkPostUser = await prismaOrm.Post.findFirst({
      where: {
        id: Number(postId),
        authorUserName: username,
      },
    });

    if (!checkPostUser) {
      return res.status(401).json({
        status: false,
        message: 'You dont have permission to access this post',
      });
    }

    const createPost = await prismaOrm.Post.delete({
      where: {
        id: Number(postId),
      },
    });

    if (!createPost) {
      return res.status(403).json({
        status: true,
        message: 'Delete Post Failed',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Delete Post Success',
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
