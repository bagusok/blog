import { prismaOrm } from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ status: false, message: 'Method not allowed' });

  const { slug } = req.query;
  if (!slug) return res.status(400).json({ status: false, message: 'Slug is required' });

  try {
    const post = await prismaOrm.Post.findUnique({
      where: { slug },
      select: {
        title: true,
        slug: true,
        metaTitle: true,
        metaDescription: true,
        body: true,
        publishedAt: true,
        thumbnail: true,
        author: {
          select: {
            fullName: true,
          },
        },
        categoriesName: true,
        tag: {
          select: {
            tagName: true,
          },
        },
      },
    });

    if (!post) return res.status(404).json({ status: false, message: 'Post not found' });

    return res.status(200).json({ status: true, data: { ...post, url: `${process.env.BASE_URL}/` } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: false, message: 'Something went wrong' });
  }
}
