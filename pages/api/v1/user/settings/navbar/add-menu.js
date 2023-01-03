import { prismaOrm } from '../../../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ status: false, message: 'Method not allowed' });

  // Get the data from the request
  const { name, url } = req.body;

  // Validate the data
  if (!name || !url) return res.status(400).json({ status: false, message: 'All fields are required' });

  // Get the data from the database

  try {
    const data = await prismaOrm.navbar.findFirst({
      where: {
        name: name,
      },
    });

    if (data) return res.status(400).json({ status: false, message: 'Menu already exists' });
  } catch (err) {}

  // Add the data to the database
  try {
    const addMenu = await prismaOrm.navbar.create({
      data: {
        name: name,
        url: url,
      },
    });

    return res.status(200).json({ status: true, message: 'Menu added successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: 'Something went wrong' });
  }
}
