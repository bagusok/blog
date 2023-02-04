import { prismaOrm } from '../../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ status: false, message: 'Method not allowed' });

  const { id, title, slug, description, body, script, style } = req.body;
  let isPublished = req.body.isPublished == 'true' ? true : false;

  if (!id || !title || !slug || !body) return res.status(400).json({ status: false, message: 'All field is required' });

  try {
    const chekPages = await prismaOrm.pages.findFirst({
      where: { id: parseInt(id) },
    });

    if (!chekPages) return res.status(401).json({ status: false, message: 'Page not found' });

    const editPage = await prismaOrm.pages.update({
      where: { id: parseInt(id) },
      data: {
        title: title,
        slug: slug,
        metaTitle: title,
        metaDescription: description,
        body: body,
        script: script,
        style,
        isPublished: isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        metaTitle: true,
        metaDescription: true,
        body: true,
        script: true,
        style: true,
        isPublished: true,
      },
    });

    if (!editPage) return res.status(403).json({ status: false, message: 'Failed to edit page' });

    return res.status(200).json({ status: true, message: 'Page edited successfully', editPage });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Internal server error' });
  }
}
