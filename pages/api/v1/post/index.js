import { PrismaClient } from '@prisma/client';
import { prismaOrm } from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') res.status(405).json({ status: false, message: 'request tidak valid' });

  const query = req.query;
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalCount = await prismaOrm.Post.count();
  const totalPage = Math.ceil(totalCount / limit);

  let prevPage = page <= 1 ? null : page - 1;
  let nextPage = page >= totalPage ? null : page + 1;

  if (page < 0) return res.status(400).json({ status: false, message: 'page is not valid' });

  try {
    const getPost = await prismaOrm.post.findMany({
      skip: startIndex,
      take: limit,
      orderBy: {
        publishedAt: 'desc',
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
      const strippedHtml = a?.body?.replace(/<[^>]+>/g, '').slice(0, 300) + '...';

      return {
        ...a,
        title: a.title.length > 50 ? a.title.slice(0, 50) + '...' : a.title,
        body: strippedHtml,
        categories: a.categories.name,
        tag: a.tag.map((b, i) => {
          return b.tag.name;
        }),
      };
    });
    return res.status(200).json({
      status: true,
      page,
      limit,
      total_data: totalCount,
      total_page: totalPage,
      prev: prevPage,
      next: nextPage,
      data: newData,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ status: false, message: 'error bang' });
  }
}
