import { prismaOrm } from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ status: false, message: 'Method not allowed' });

  const data = req.query;

  const id = data.id || 1;

  const newTagsQuery = data.tags.split(',').join(' | ').replace(' ', '') || '';

  try {
    const relatedPosts = await prismaOrm.Tag.findMany({
      skip: 0,
      take: 5,
      where: {
        name: {
          search: newTagsQuery,
        },
      },
      select: {
        post: {
          select: {
            post: true,
          },
        },
      },
    });

    const newData = relatedPosts[0]?.post?.map((a, i) => {
      return {
        id: a.post.id,
        title: a.post.title,
        slug: a.post.slug,
        thumbnail: a.post.thumbnail,
        isPublished: a.post.isPublished,
        publishedAt: a.post.publishedAt.toISOString(),
      };
    });

    const filteredData = newData.filter((a) => a.id != id && a.isPublished == true);

    if (!relatedPosts) return res.status(404).json({ status: false, message: 'Post not found' });

    return res.status(200).json({
      status: true,
      data: filteredData,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(200).json({
      status: true,
      data: [],
    });
  }
}
