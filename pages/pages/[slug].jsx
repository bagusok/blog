import Script from 'next/script';
import { prismaOrm } from '../../lib/prisma';

export default function Pages(props) {
  console.log(props);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: props.pages?.body }}></div>

      <Script id="test">{props.pages?.script}</Script>
    </>
  );
}

export async function getServerSideProps() {
  const pages = await prismaOrm.Pages.findFirst({
    where: {
      id: 1,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      body: true,
      script: true,
      publishedAt: true,
    },
  });

  console.log(pages);

  return {
    props: {
      pages: { ...pages, publishedAt: pages.publishedAt.toISOString() },
    },
  };
}
