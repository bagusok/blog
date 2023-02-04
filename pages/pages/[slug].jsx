import Head from 'next/head';
import Script from 'next/script';
import Aside from '../../components/blog/Aside';
import BlogFooter from '../../components/blog/BlogFooter';
import BlogNavbar from '../../components/blog/BlogNavbar';
import BlogSidebar from '../../components/blog/BlogSidebar';
import { prismaOrm } from '../../lib/prisma';

export default function Pages({ pages, sidebar }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        {/* <link rel="preload" href="/images/no-image.png" as="image" /> */}

        <title>{pages.title}</title>
        <meta name="robots" content="all" />

        <meta name="title" content={pages.title} />
        <meta name="description" content={pages.metaDescription} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={pages.url} />
        <meta property="og:title" content={pages.title} />
        <meta property="og:description" content={pages.metaDescription} />
        <meta property="og:image" content={pages.thumbnail} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={pages.url} />
        <meta property="twitter:title" content={pages.title} />
        <meta property="twitter:description" content={pages.metaDescription} />
        <meta property="twitter:image" content={pages.thumbnail} />
      </Head>

      <div className="flex flex-col relative">
        <BlogNavbar />
        <main className="w-full min-h-screen flex flex-col md:flex-row lg:flex-row lg:justify-between lg:gap-2 relative">
          <BlogSidebar sidebar={sidebar} />
          <article className="lg:w-7/12 md:w-8/12 mt-5 px-4 lg:px-5 relative overflow-hidden">
            <style jsx global>
              {`
                ${pages.style}
              `}
            </style>
            <div className="" dangerouslySetInnerHTML={{ __html: pages?.body }}></div>
          </article>

          <Aside />
        </main>
        <BlogFooter />
      </div>

      <Script id="test" type="module">
        {pages?.script}
      </Script>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { slug } = ctx.params;
  const pages = await prismaOrm.Pages.findFirst({
    where: {
      slug,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      body: true,
      script: true,
      style: true,
    },
  });

  if (!pages) return { notFound: true };

  const sideBar = await prismaOrm.NavbarCategory.findMany({
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
  });

  const newSidebar = sideBar.map((a, i) => {
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
    return {
      name: a.name,
      child: newMenu,
    };
  });

  return {
    props: {
      pages: { ...pages },
      sidebar: newSidebar,
    },
  };
}
