import { FaHackerNewsSquare } from 'react-icons/fa';
import { prismaOrm } from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ status: false, message: 'Method not allowed' });
  const { q } = req.query;

  const newQ = decodeURI(q).replaceAll(' ', '|');

  const search = await prismaOrm.Post.findMany({
    where: {
      title: {
        search: newQ,
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
    },
  });

  if (!search) return res.status(404).json({ status: false, message: 'Not found' });

  return res.status(200).json({ status: true, data: search });
}
