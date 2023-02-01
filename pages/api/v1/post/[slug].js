import { nanoid } from 'nanoid';
import parameterize from 'parameterize';
import rehypeParse from 'rehype-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import rehypeStringify from 'rehype-stringify';
import { prismaOrm } from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ status: false, message: 'Method not allowed' });

  const { slug } = req.query;
  if (!slug) return res.status(400).json({ status: false, message: 'Slug is required' });

  try {
    const post = await prismaOrm.Post.findUnique({
      where: { slug },
      select: {
        title: true,
        slug: true,
        metaTitle: true,
        metaDescription: true,
        body: true,
        publishedAt: true,
        thumbnail: true,
        author: {
          select: {
            fullName: true,
          },
        },
        categoriesName: true,
        tag: {
          select: {
            tagName: true,
          },
        },
      },
    });

    if (!post) return res.status(404).json({ status: false, message: 'Post not found' });

    let toc = [];

    const content = unified()
      .use(rehypeParse, {
        fragment: true,
      })
      .use(() => {
        return (tree) => {
          visit(tree, 'element', function (node) {
            const id = parameterize(node.children[0]?.value || nanoid());
            if (node.tagName == 'h2') {
              node.properties.id = id;

              toc.push({
                id,
                text: node.children[0].value || id,
                children: [],
              });
            }
            if (node.tagName == 'h3') {
              node.properties.id = id;
              const parent = toc[toc.length - 1];
              parent.children.push({
                id,
                text: node.children[0].value,
              });
            }
          });
          return;
        };
      })
      .use(rehypeStringify)
      .processSync(post.body)
      .toString();

    return res
      .status(200)
      .json({ status: true, table_of_contents: toc, data: { ...post, url: `${process.env.BASE_URL}/` } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: false, message: 'Something went wrong' });
  }
}
