import { prismaOrm } from '../../../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ status: false, message: 'Method not allowed' });

  // Get the data from the request
  const { name } = req.body;

  // Validate the data
  if (!name) return res.status(400).json({ status: false, message: 'All fields are required' });

  // Get the data from the database

  try {
    const data = await prismaOrm.navbar.findFirst({
      where: {
        name: name,
      },
    });
    if (!data) return res.status(400).json({ status: false, message: 'Menu does not exists' });
  } catch (err) {
    return res.status(400).json({ status: false, message: 'Menu does not exists' });
  }

  // Add the data to the database
  try {
    const deleteMenu = await prismaOrm.navbar.delete({
      where: {
        name: name,
      },
    });

    return res.status(200).json({ status: true, message: 'Delete menu successfully' });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ status: false, message: 'Something went wrong' });
  }
}
