import { authentication } from '../../../../../lib/auth';
import { decodeJwt } from '../../../../../lib/decodeJwt';
import { prismaOrm } from '../../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') res.status(405).json({ status: false, message: 'Method not allowed' });

  const auth = await authentication(req, res);
  if (!auth) res.status(401).json({ status: false, message: 'Unauthorized' });

  const { username } = decodeJwt(req);

  try {
    const { postId, isPublished } = req.body;
    const checkPost = await prismaOrm.Post.findFirst({
      where: { id: postId, authorUserName: username },
    });

    if (!checkPost) return res.status(400).json({ status: false, message: 'Post not found' });

    const updatePost = await prismaOrm.Post.update({
      data: {
        isPublished: isPublished,
      },
      where: {
        id: Number(postId),
      },
    });

    if (!updatePost) return res.status(400).json({ status: false, message: 'Failed Update Post' });

    return res.status(200).json({ status: true, message: 'Post Updated' });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ status: false, message: 'error bang' });
  }
}
