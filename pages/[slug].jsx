import Image from 'next/image';
import xss from 'xss';
import Aside from '../components/blog/Aside';
import BlogNavbar from '../components/blog/BlogNavbar';
import BlogSidebar from '../components/blog/BlogSidebar';
import { CiShare1 } from 'react-icons/ci';
import BlogFooter from '../components/blog/BlogFooter';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import Head from 'next/head';

const prisma = new PrismaClient();

export default function PostDetail(props) {
  const { post } = props;
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        <title>{post.title}</title>
        <meta name="robots" content="all" />
        <meta name="author" content={post.author.fullName} />
        <meta name="keywords" content={post.tag.map((tag) => tag.tagName).toString()} />

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
          <BlogSidebar menuItem={props.menuItem} />
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
                  <h3 className="text-base font-semibold text-black">{post?.author?.fullName}</h3>
                  <p className="text-sm font-regular text-slate-500">Last Update: 1 Januari 2023</p>
                </div>
              </div>
              <div className="inline-flex">
                <CiShare1 className="text-melrose-300 w-6 h-6 cursor-pointer" />
              </div>
            </div>
            <div className="w-full h-fit lg:pr-20 mt-4 mb-3">
              <Image
                src={post?.thumbnail}
                alt="thumbnail"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              {...props}
              className="prose"
              dangerouslySetInnerHTML={{
                __html: xss(post?.body?.toString()),
              }}
            />

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
            <h3 className="text-lg font-regular text-black mt-8">Postingan yang mungkin anda suka</h3>
            <div className="w-full overflow-x-auto mt-2">
              <div className="inline-flex gap-3">
                <div className="flex flex-col" style={{ width: '12rem' }}>
                  <div className="h-full">
                    <Image
                      alt="thumbnail"
                      src={post?.thumbnail}
                      width={500}
                      height={500}
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-base font-semibold text-black">{post?.title}</h3>
                    <p className="text-sm font-regular text-slate-500">Last Update: 1 Januari 2023</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <button className="h-12 bg-transparent text-base font-medium border border-slate-400 hover:bg-slate-200 flex justify-center items-center w-full rounded-sm">
                Berikan Komentar
              </button>
            </div>
          </article>
          <Aside />
        </main>
        <BlogFooter />
      </div>
    </>
  );
}

export async function getStaticProps({ params }) {
  const post = await prisma.Post.findUnique({
    where: {
      slug: params.slug,
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
    },
  });

  if (!post?.slug)
    return {
      notFound: true,
    };

  const menuItem = await fetch(`${process.env.BASE_URL}/api/v1/list-menu`).then((res) => res.json());

  return {
    props: {
      post: { ...post, url: `${process.env.BASE_URL}/${post.slug}` },
      menuItem: menuItem.data,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths(params) {
  const post = await prisma.Post.findMany({
    select: {
      slug: true,
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
