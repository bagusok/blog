import { nanoid } from 'nanoid';
import { authentication } from '../../../../../lib/auth';
import { decodeJwt } from '../../../../../lib/decodeJwt';
import { prismaOrm } from '../../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ status: false, message: 'Method not allowed' });

  let auth = await authentication(req, res);

  if (!auth) return res.status(401).json({ status: false, message: 'Unauthorized' });

  let { username } = decodeJwt(req);

  try {
    const createPages = await prismaOrm.Pages.create({
      data: {
        slug: nanoid(10),
        body: '<!-- Write your HTML here -->',
        style: '/* Write your CSS here */',
        script: '// Write your JavaScript here',
      },
      select: {
        id: true,
      },
    });

    if (!createPages) return res.status(403).json({ status: false, message: 'Failed to create page' });

    return res.status(200).json({ status: true, message: 'Page created successfully', data: { id: createPages.id } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: false, message: 'Internal server error' });
  }
}
