import { PrismaClient } from '@prisma/client';
import { authentication } from '../../../../../lib/auth';
import { decodeJwt } from '../../../../../lib/decodeJwt';

const prisma = new PrismaClient();
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ status: false, message: 'request tidak valid' });

  const auth = await authentication(req, res);
  if (!auth) return res.status(401).json({ status: false, message: 'unauthorized' });

  const { username } = decodeJwt(req);

  try {
    const getPost = await prisma.post.findMany({
      skip: 0,
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        slug: true,
        author: {
          select: {
            fullName: true,
          },
        },
        categories: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
      },
      where: {
        author: {
          username,
        },
      },
    });

    const newData = getPost.map((a, i) => {
      return {
        ...a,
        categories: a.categories.name,
      };
    });
    return res.status(200).json({ status: true, data: newData });
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ status: false, message: 'error bang' });
  }
}
