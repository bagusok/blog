import { prismaOrm } from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ status: false, message: 'Method not allowed' });
  try {
    const relatedPosts = await prismaOrm.Post.findMany({
      skip: 0,
      take: 5,
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
      },
    });

    if (!relatedPosts) return res.status(404).json({ status: false, message: 'Post not found' });

    return res.status(200).json({ status: true, data: relatedPosts });
  } catch (e) {
    console.log(e.message);
  }
}
