import { isNumber } from 'lodash';
import { authentication } from '../../../../../lib/auth';
import { decodeJwt } from '../../../../../lib/decodeJwt';
import { prismaOrm } from '../../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') res.status(405).json({ status: false, message: 'request tidak valid' });

  const auth = await authentication(req, res);
  if (!auth) res.status(401).json({ status: false, message: 'unauthorized' });

  const { username } = decodeJwt(req);

  const { postId } = req.query;
  console.log('ini', isNumber(postId));

  try {
    const getPostDetail = await prismaOrm.Post.findFirst({
      where: {
        id: Number(postId),
        authorUserName: username,
      },
      include: {
        tag: true,
      },
    });

    if (!getPostDetail) return res.status(404).json({ status: false, message: 'post not found' });

    return res.status(200).json({ status: true, data: getPostDetail });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: false, message: 'error bang' });
  }
}
