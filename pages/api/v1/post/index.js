import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default async function handler(req, res) {
  if (req.method !== 'GET') res.status(405).json({ status: false, message: 'request tidak valid' });

  try {
    const getPost = await prisma.post.findMany({
      skip: 0,
      take: 9,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        title: true,
        thumbnail: true,
        slug: true,
        body: true,
        author: {
          select: {
            fullName: true,
          },
        },
        categories: true,
        tag: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
        publishedAt: true,
      },
      where: {
        isPublished: true,
        author: {
          isBanned: false,
        },
      },
    });

    const newData = getPost.map((a, i) => {
      const strippedHtml = a?.body?.replace(/<[^>]+>/g, '').slice(0, 200) + '...';

      return {
        ...a,
        body: strippedHtml,
        categories: a.categories.name,
        tag: a.tag.map((b, i) => {
          return b.tag.name;
        }),
      };
    });
    return res.status(200).json({ status: true, data: newData });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ status: false, message: 'error bang' });
  }
}
