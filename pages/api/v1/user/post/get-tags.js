import { prismaOrm } from '../../../../../lib/prisma';

prismaOrm;

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res
      .status(405)
      .json({ status: false, message: 'Method not allowed' });

  try {
    const getCategory = await prismaOrm.Tag.findMany({
      select: {
        name: true,
      },
    });

    const data = getCategory.map((a, i) => {
      return {
        value: a.name,
        label: a.name,
      };
    });

    return res.status(200).json({ status: true, data });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}
