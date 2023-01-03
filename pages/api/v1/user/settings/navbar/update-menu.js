import { prismaOrm } from '../../../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ status: false, message: 'Method not allowed' });

  // Get the data from the request
  const { name, url, id } = req.body;

  // Validate the data
  if (!name || !url || !id) return res.status(400).json({ status: false, message: 'All fields are required' });

  // Get the data from the database

  try {
    const data = await prismaOrm.navbar.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!data) return res.status(400).json({ status: false, message: 'Menu does not exists' });
  } catch (err) {
    return res.status(400).json({ status: false, message: 'Something went wrong' });
  }

  // Add the data to the database
  try {
    const updateMenu = await prismaOrm.navbar.update({
      data: {
        name: name,
        url: url,
      },
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json({ status: true, message: 'Update menu successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: 'Something went wrong' });
  }
}
