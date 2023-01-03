import { prismaOrm } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') res.status(405).json({ status: false, message: 'request tidak valid' });

  try {
    const getMenu = await prismaOrm.navbar.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
        url: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    if (!getMenu) return res.status(400).json({ status: false, message: 'Menu does not exists' });

    return res.status(200).json({ status: true, data: getMenu });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: false, message: 'error bang' });
  }
}
