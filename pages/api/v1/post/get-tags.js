import { prismaOrm } from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const getTags = await prismaOrm.tag.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  if (!getTags) return res.status(404).json({ message: 'No tags found' });

  return res.status(200).json({ status: true, data: getTags });
}
