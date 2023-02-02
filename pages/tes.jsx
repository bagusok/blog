import parameterize from 'parameterize';
import { useEffect } from 'react';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

export const AdSense = ({ client, slot, format }) => {
  useEffect(() => {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  }, []);

  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
      />
    </>
  );
};

export default function Tes() {
  const insertAdsense = (tree) => {
    let counter = 0;
    let options = {
      client: 'ca-pub-1234567890123456',
      slot: '1234567890',
      format: 'auto',
      frequency: 2,
    };

    console.log(tree);

    // tree.children.forEach((node, index) => {
    //   if (node.tagName === 'h2') {
    //     counter += 1;
    //     if (counter === options.frequency) {
    //       // memasukkan AdSense setelah subjudul ke-frequency
    //   tree.children.splice(index + 1, 0, {
    //     type: 'element',
    //     tagName: 'div',
    //     properties: {},
    //     children: [
    //       {
    //         type: 'element',
    //         tagName: 'ins',
    //         properties: {
    //           className: 'adsbygoogle',
    //           style: { display: 'block' },
    //           'data-ad-client': options.client,
    //           'data-ad-slot': options.slot,
    //           'data-ad-format': options.format,
    //         },
    //         children: [],
    //       },
    //     ],
    //   });
    //       counter = 0;
    //     }
    //   }
    // });

    return tree;
  };

  const content = `<h1>Ini adalah judul artikel</h1><h2>Subjudul 1</h2><p>Ini adalah paragraf pertama.</p><p>Ini adalah paragraf kedua.</p><h2>Subjudul 2</h2><p>Ini adalah paragraf ketiga.</p><p>Ini adalah paragraf keempat.</p><h2>Subjudul 3</h2><p>Ini adalah paragraf kelima.</p><p>Ini adalah paragraf keenam.</p>`;

  let toc = [];

  const tree = unified()
    .use(rehypeParse, {
      fragment: true,
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
                    'w-full h-64 max-h-96 border-2 border-slate-500 border-dashed flex justify-center items-center rounded',
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'ins',
                    properties: {
                      className: 'adsbygoogle w-full h-full flex justify-center items-center',
                      style: { display: 'block' },
                      'data-ad-client': 'aaaa',
                      'data-ad-slot': 'asaaa',
                      'data-ad-format': 'ssss',
                    },
                    children: [
                      {
                        type: 'text',
                        value: 'Adsense Here',
                      },
                    ],
                    // children: [
                    //   {
                    //     type: 'element',
                    //     tagName: 'h2',
                    //     properties: {
                    //       className: 'text-base italic text-center',
                    //     },
                    //     children: [
                    //       {
                    //         type: 'text',
                    //         value: 'Adsense Here',
                    //       },
                    //     ],
                    //   },
                    // ],
                  },
                ],
              });
            }
          }
        });
        console.log(tree);
        return;
      };
    })
    .use(rehypeStringify)
    .processSync(content)
    .toString();

  console.log(tree);

  return (
    <>
      <div className="prose" dangerouslySetInnerHTML={{ __html: tree }}></div>
    </>
  );
}
