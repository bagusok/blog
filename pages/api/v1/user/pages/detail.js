import { authentication } from '../../../../../lib/auth';
import { prismaOrm } from '../../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') res.status(405).json({ status: false, message: 'Method not alowed' });

  const auth = await authentication(req, res);
  if (!auth) res.status(401).json({ status: false, message: 'unauthorized' });

  const { pageId } = req.query;

  try {
    const getPageDetail = await prismaOrm.Pages.findFirst({
      where: {
        id: parseInt(pageId),
      },
    });

    if (!getPageDetail) return res.status(404).json({ status: false, message: 'Pages not found' });

    return res.status(200).json({ status: true, data: getPageDetail });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: false, message: 'error bang' });
  }
}
