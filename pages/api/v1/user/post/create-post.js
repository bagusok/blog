import { Prisma } from '@prisma/client';
import { authentication } from '../../../../../lib/auth';
import { prismaOrm } from '../../../../../lib/prisma';
import { decodeJwt } from '../../../../../lib/decodeJwt';
import { nanoid } from 'nanoid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ status: false, message: 'Method Tidak Valid' });
  }

  let auth = await authentication(req, res);

  if (!auth)
    return res.status(401).json({ status: false, message: 'Unauthorized' });

  let { username } = decodeJwt(req);

  try {
    // const { title, slug, body, thumbnail, description, category, tags } =
    //   req.body;

    // const tagQuery = tags?.map((tag) => {
    //   return {
    //     tag: {
    //       connectOrCreate: {
    //         create: { name: tag },
    //         where: { name: tag },
    //       },
    //     },
    //   };
    // });

    const createPost = await prismaOrm.Post.create({
      data: {
        title: 'My Awesome Post',
        slug: nanoid(10),
        thumbnail: 'https://picsum.photos/200/300',
        body: 'This is my awesome post content',
        metaTitle: 'My Awesome Post',
        metaDescription: 'This is my awesome post description',
        author: {
          connect: {
            username,
          },
        },
        categories: {
          connectOrCreate: {
            create: { name: 'MyPost' },
            where: { name: 'MyPost' },
          },
        },
        // tag: {
        //   create: tagQuery || [],
        // },
      },
      select: {
        id: true,
      },
    });

    if (createPost) {
      return res.status(200).json({
        status: true,
        message: 'Create Post Success',
        data: createPost,
      });
    }
    return res.status(403).json({
      status: true,
      message: 'Create Post Failed',
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
