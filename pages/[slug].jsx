import Image from 'next/image';
import { useEffect } from 'react';
import BlogNavbar from '../components/blog/BlogNavbar';
import { CiShare1 } from 'react-icons/ci';
import BlogFooter from '../components/blog/BlogFooter';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ImageFallback from '../components/ImageFallback';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import { visit } from 'unist-util-visit';
import parameterize from 'parameterize';
import rehypeStringify from 'rehype-stringify';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import RelatedPost from '../components/blog/RelatedPost';
import { prismaOrm } from '../lib/prisma';

import hljs from 'highlight.js';
import 'highlight.js/styles/night-owl.css';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('html', html);
hljs.registerLanguage('css', css);
hljs.registerLanguage('js', js);
hljs.registerLanguage('ts', ts);

const AsideDynamic = dynamic(() => import('../components/blog/Aside'), { ssr: false });
const BlogSidebar = dynamic(() => import('../components/blog/BlogSidebar'), { ssr: false });

export default function PostDetail(props) {
  const { post } = props;

  const router = useRouter();

  useEffect(() => {
    const a = hljs.highlightAll();
    console.log('higlight success', a);
  }, [props]);

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  const readTime = Math.ceil(post.body?.replace(/<[^>]+>/g, '').split(' ').length / 255);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />

        <title>{post.title}</title>
        <meta name="robots" content="all" />
        <meta name="author" content={post.author.fullName} />
        <meta name="keywords" content={post.tag.map((tag) => tag.tagName)} />
        <link rel="canonical" href={post.url} />

        <meta name="title" content={post.title} />
        <meta name="description" content={post.metaDescription} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={post.url} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:image" content={post.thumbnail} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={post.url} />
        <meta property="twitter:title" content={post.title} />
        <meta property="twitter:description" content={post.metaDescription} />
        <meta property="twitter:image" content={post.thumbnail} />
      </Head>

      <div className="flex flex-col relative">
        <BlogNavbar />
        <main className="w-full min-h-screen flex flex-col md:flex-row lg:flex-row lg:justify-between lg:gap-2 relative">
          <BlogSidebar sidebar={props.sidebar} />
          <article className="lg:w-7/12 md:w-8/12 mt-5 px-4 lg:px-5 relative overflow-hidden">
            <h1 className="text-3xl font-bold">{post?.title}</h1>
            <div className="w-full inline-flex justify-between items-center mt-4">
              <div className="max-w-2/3 inline-flex gap-3 my-4">
                <div className="image">
                  <Image
                    src="https://2.bp.blogspot.com/-2PZPj-nkDgo/YCdqQ1Q5N5I/AAAAAAAAEWg/F3vZ0LxxBTgtXTuuexlRw06AXGKea8y8wCK4BGAYYCw/w40-h40-p-k-no-nu/20191121_085121.jpg"
                    alt="profile"
                    width={200}
                    height={200}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <p className="text-base font-semibold text-black">{post?.author?.fullName}</p>
                  <p className="text-sm font-regular text-slate-500">
                    {new Date(post?.publishedAt).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-3">
                <div className="rounded-full font-light italic text-sm text-gray-400">{readTime} min read</div>
                <CiShare1 className="text-melrose-300 w-6 h-6 cursor-pointer" />
              </div>
            </div>
            <div className="w-full h-fit lg:pr-20 mt-4 mb-3">
              <ImageFallback
                src={post?.thumbnail}
                loading="lazy"
                placeholder="blur"
                blurDataURL="LEHC4WWB2yk8pyoJadR*.7kCMdnj"
                alt="Image"
                width={500}
                height={500}
                className="object-cover w-full"
              />
            </div>

            <div className="prose lg:prose-lg prose-p:text-base prose-pre:bg-[#011627] w-full">
              {/* Table Of Contents */}

              <details className="cursor-pointer bg-slate-100 p-2 rounded-lg mt-10 w-full">
                <summary>Table Of Contents</summary>
                <ul className="list-disc" id="tableOfContents">
                  {post?.table_of_contents?.map((toc, i) => {
                    return (
                      <li key={i} className="text-sm text-slate-500">
                        <Link href={'#' + toc.id} className="no-underline hover:underline">
                          {toc.text}
                        </Link>
                        {toc.children?.map((child, i) => {
                          return (
                            <ul key={i} className="list-disc ml-4">
                              <li className="text-sm">
                                <Link className="no-underline hover:underline" href={'#' + child.id}>
                                  {child.text}
                                </Link>
                              </li>
                            </ul>
                          );
                        })}
                      </li>
                    );
                  })}
                </ul>
              </details>

              {/* Post Body */}

              <div
                className="mt-2 w-full"
                dangerouslySetInnerHTML={{
                  __html: post?.body?.toString(),
                }}
              />
            </div>

            <div className="flex flex-row flex-wrap gap-2 my-10">
              {post?.tag?.map((tag, i) => {
                return (
                  <button
                    key={i}
                    className="py-1 px-3 text-sm text-regular rounded-sm border border-slate-300 hover:bg-slate-300/50"
                  >
                    {tag.tagName}
                  </button>
                );
              })}
            </div>

            <div className="w-full inline-flex gap-4 my-4">
              <div className="image w-20 h-fit">
                <Image
                  src="https://2.bp.blogspot.com/-2PZPj-nkDgo/YCdqQ1Q5N5I/AAAAAAAAEWg/F3vZ0LxxBTgtXTuuexlRw06AXGKea8y8wCK4BGAYYCw/w40-h40-p-k-no-nu/20191121_085121.jpg"
                  alt="profile"
                  width={500}
                  height={500}
                  className="w-14 h-14 rounded-full"
                />
              </div>
              <div className="w-full">
                <h3 className="text-base font-semibold text-black">{post?.author?.fullName}</h3>
                <p className="text-sm font-regular text-slate-500 lg:w-2/3">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga nam quas voluptas quos quidem
                  perferendis impedit, sit in cupiditate possimus.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-regular text-black my-2">Berbagi ke: </h3>
            <div className="flex gap-3">
              <button className="flex justify-center items-center h-10 w-auto px-3 text-sm font-regular rounded-sm text-white bg-blue-600 hover:opacity-70">
                Facebook
              </button>
              <button className="flex justify-center items-center h-10 w-auto px-3 text-sm font-regular rounded-sm text-white bg-blue-400 hover:opacity-70">
                Twitter
              </button>
              <button className="flex justify-center items-center h-10 w-auto px-3 text-sm font-regular rounded-sm text-white bg-pink-400 hover:opacity-70">
                Instagram
              </button>
              <button className="flex justify-center items-center h-10 w-auto px-3 text-sm font-regular rounded-sm text-white bg-green-600 hover:opacity-70">
                Whatsapp
              </button>
              <button className="flex justify-center items-center h-10 w-10 px-3 text-sm font-regular rounded-sm text-white bg-slate-400 hover:opacity-70">
                +
              </button>
            </div>
            <RelatedPost tags={post.tag || ''} postId={post.id} />
            <div className="mt-10">
              <button className="h-12 bg-transparent text-base font-medium border border-slate-400 hover:bg-slate-200 flex justify-center items-center w-full rounded-sm">
                Berikan Komentar
              </button>
            </div>
          </article>
          <AsideDynamic />
        </main>
        <BlogFooter />
      </div>
    </>
  );
}

export async function getStaticProps({ params }) {
  const [post, sidebar] = await prismaOrm.$transaction([
    prismaOrm.Post.findFirst({
      where: {
        slug: params.slug,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        body: true,
        thumbnail: true,
        metaTitle: true,
        metaDescription: true,
        author: {
          select: {
            fullName: true,
          },
        },
        tag: {
          select: {
            tagName: true,
          },
        },
        publishedAt: true,
      },
    }),
    prismaOrm.NavbarCategory.findMany({
      select: {
        name: true,
        menu: {
          select: {
            name: true,
            url: true,
            icon: true,
            navbarItemChild: {
              select: {
                name: true,
                url: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    }),
  ]);

  const newSidebar = sidebar.map((a, i) => {
    const newMenu = a.menu.map((b, j) => {
      const newNavbarItemChild = b.navbarItemChild.map((c, k) => {
        return {
          name: c.name,
          url: c.url,
        };
      });
      return {
        name: b.name,
        url: b.url,
        icon: b.icon,
        isOpen: false,
        child: newNavbarItemChild,
      };
    });

    if (!post?.slug)
      return {
        notFound: true,
      };

    return {
      name: a.name,
      child: newMenu,
    };
  });

  if (!sidebar) return { notFound: true };

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
              text: node.children[0]?.value || id,
              children: [],
            });
          }
          if (node.tagName == 'h3' && toc.length > 0) {
            node.properties.id = id;
            const parent = toc[toc.length - 1];
            parent.children?.push({
              id,
              text: node.children[0]?.value || '',
            });
          }
        });
        return;
      };
    })
    .use(() => {
      return (tree) => {
        let countAll = 0;
        let countH = 0;
        visit(tree, 'element', function (node) {
          countAll += 1;
          if (node.tagName == 'h2') {
            countH += 1;
            if (countH % 4 == 0 || countH == 1) {
              tree.children.splice(countAll - 1, 0, {
                type: 'element',
                tagName: 'div',
                properties: {
                  className:
                    'w-full h-64 max-h-96 border-2 border-slate-500 border-dashed flex justify-center items-center rounded mt-5',
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'ins',
                    properties: {
                      className: 'adsbygoogle w-full h-full flex justify-center items-center',
                      style: { display: 'block' },
                      'data-ad-client': '123456789',
                      'data-ad-slot': '123456789',
                      'data-ad-format': '123456789',
                    },
                    children: [
                      {
                        type: 'text',
                        value: 'Adsense Here',
                      },
                    ],
                  },
                ],
              });
            }
          }
        });

        return;
      };
    })
    .use(rehypeStringify)
    .processSync(post?.body)
    .toString();

  return {
    props: {
      post: {
        ...post,
        body: content,
        table_of_contents: toc,
        url: `${process.env.BASE_URL}/${post.slug}`,
        publishedAt: post.publishedAt?.toISOString() || null,
      },
      sidebar: newSidebar,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths(params) {
  const post = await prismaOrm.Post.findMany({
    skip: 0,
    take: 1,
    select: {
      slug: true,
    },
    where: {
      isPublished: true,
    },
  });

  const paths = post?.map((post) => {
    return {
      params: {
        slug: post?.slug,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}
