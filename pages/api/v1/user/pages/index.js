import { PrismaClient } from '@prisma/client';
import { authentication } from '../../../../../lib/auth';
import { decodeJwt } from '../../../../../lib/decodeJwt';

const prisma = new PrismaClient();
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ status: false, message: 'Method not allowed' });

  const auth = await authentication(req, res);
  if (!auth) return res.status(401).json({ status: false, message: 'Unauthorized' });

  try {
    const getPages = await prisma.Pages.findMany({
      skip: 0,
      take: 9,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        slug: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
      },
    });
    return res.status(200).json({ status: true, data: getPages });
  } catch (e) {
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
}
