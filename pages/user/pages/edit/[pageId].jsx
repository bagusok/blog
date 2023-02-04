import Editor from '@monaco-editor/react';
import { Tab } from '@headlessui/react';
import SideBar from '../../../../components/user/Sidebar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { parseCookies } from 'nookies';
import useSWR, { mutate } from 'swr';
import { fetchWithToken } from '../../../../lib/fetcher';
import { useForm } from 'react-hook-form';
import slugify from 'slugify';
import { toast, Toaster } from 'react-hot-toast';
import useDebounce from '../../../../hooks/useDebounce';

export default function EditPages({ token, pageId }) {
  const [htmlValue, setHtmlValue] = useState('');
  const [cssValue, setCssValue] = useState('');
  const [jsValue, setJsValue] = useState('');
  const [slug, setSlug] = useState('');
  const [publishButtonIsLoading, setPublishButtonIsLoading] = useState({ isSave: false, isPublished: false });
  const [iframeKey, setIframeKey] = useState(0);

  const { register, handleSubmit, getValues, setValue, onChange } = useForm();

  const createSlug = (e) => {
    const slug = slugify(e.target.value, {
      replacement: '-',
      lower: true,
      strict: false,
      locale: 'id',
      trim: true,
    });
    setValue('slug', slug);
  };

  const savePage = async (e, params, isDebounced = false) => {
    if (!params?.isPublished) {
      setPublishButtonIsLoading((prev) => ({ ...prev, isSave: true }));
    } else {
      setPublishButtonIsLoading((prev) => ({ ...prev, isPublished: true }));
    }

    const data = {
      ...e,
      body: htmlValue,
      script: jsValue,
      style: cssValue,
      id: pageId,
    };

    const save = await fetch('/api/v1/user/pages/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(data),
    });

    try {
      const res = await save.json();
      if (res.status) {
        // isPublished && router.push('/user/post/', undefined, { shallow: true });
        !isDebounced && toast.success(res.message);
      } else {
        !isDebounced && toast.error(res.message);
      }
    } catch (e) {
      toast.error(e.message);
    }
    setIframeKey((prev) => prev + 1);
    setPublishButtonIsLoading({ isPublished: false, isSave: false });
  };

  // const debouncedHtmlValue = useDebounce(() => {
  //   savePage(getValues(), { isPublished: false }, true);
  // }, 4000);

  const getDetailPage = async ({ page, auth }) => {
    const res = await fetch(`/api/v1/user/pages/detail?pageId=${page}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer ' + auth,
      },
    });
    const resJson = await res.json();

    console.log(resJson);
    setHtmlValue(resJson.data.body);
    setCssValue(resJson.data.style);
    setJsValue(resJson.data.script);
    setSlug(resJson.data.slug);
    setValue('title', resJson.data.title);
    setValue('slug', resJson.data.slug);
  };

  useEffect(() => {
    getDetailPage({ page: pageId, auth: token });
  }, [pageId, token]);

  // useEffect(
  //   () => {
  //     if (debouncedHtmlValue) {
  //     } else {
  //       console.log('gagal debounce');
  //     }
  //   },
  //   [debouncedHtmlValue] // Only call effect if debounced search term changes
  // );

  function handleEditorHtml(value, event) {
    setHtmlValue(value);
    // debouncedHtmlValue;
  }

  function handleEditorCss(value, event) {
    setCssValue(value);
    // debouncedHtmlValue;
  }

  function handleEditorJS(value, event) {
    setJsValue(value);
    // debouncedHtmlValue;
  }

  return (
    <>
      <SideBar />
      <Toaster />
      <div className="px-3 md:px-8 lg:px-16 flex justify-end mb-6"></div>
      <form className="flex flex-col gap-2 px-3 md:px-8 lg:px-16" onSubmit={handleSubmit(savePage)}>
        <button className="text-base ml-auto font-medium w-fit px-6 py-2 rounded-sm bg-orange-400 text-white hover:opacity-70">
          Save
        </button>
        <div className="form-group flex flex-col md:flex-row gap-3">
          <div className="w-full md:w-1/2">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              className="bg-white border border-slate-500 p-1 rounded-sm text-sm font-normal w-full"
              placeholder="My Blog is Awesome"
              {...register('title')}
              onChange={(e) => createSlug(e)}
              required
            />
          </div>
          <div className="w-full md:w-1/2">
            <label htmlFor="title">Slug</label>
            <input
              type="text"
              name="slug"
              className="bg-white border border-slate-500 p-1 rounded-sm text-sm font-normal w-full"
              placeholder="my-blog-is-awesome"
              {...register('slug')}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Description</label>
          <textarea
            type="text"
            name="description"
            className="bg-white border border-slate-500 p-1 rounded-sm text-sm font-normal w-full"
            placeholder="This is Description"
            {...register('description')}
          />
        </div>
      </form>
      <div className="px-3 mt-6 pb-60 md:px-8 lg:px-16 flex flex-col md:flex-row gap-3 ">
        <div className="w-full md:w-2/3">
          {htmlValue !== '' && (
            <Tab.Group>
              <Tab.List className="rounded overflow-hidden bg-slate-200 w-fit flex justify-between">
                <Tab className="w-24 h-10 text-sm font-semibold ui-selected:outline-none ui-selected:bg-[#1c1c1c] ui-not-selected:bg-gray-500 text-white">
                  Html
                </Tab>
                <Tab className="w-24 h-10 text-sm font-semibold ui-selected:outline-none ui-selected:bg-[#1c1c1c] ui-not-selected:bg-gray-500 text-white">
                  Css
                </Tab>
                <Tab className="w-24 h-10 text-sm font-semibold ui-selected:outline-none ui-selected:bg-[#1c1c1c] ui-not-selected:bg-gray-500 text-white">
                  Javascript
                </Tab>
              </Tab.List>
              <Tab.Panels className="-mt-1 w-full rounded overflow-hidden">
                <Tab.Panel>
                  <Editor
                    width="50rem"
                    className="h-96 rounded"
                    defaultLanguage="html"
                    theme="vs-dark"
                    defaultValue={htmlValue}
                    onChange={handleEditorHtml}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <Editor
                    width="50rem"
                    className="h-96 rounded"
                    defaultLanguage="css"
                    theme="vs-dark"
                    defaultValue={cssValue}
                    onChange={handleEditorCss}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <Editor
                    width="50rem"
                    className="h-96 rounded"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    defaultValue={jsValue}
                    onChange={handleEditorJS}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          )}
        </div>

        <div className="w-full md:w-1/3 overflow-hidden border border-black rounded">
          <div className="h-10 flex justify-between items-center border-b-2 px-3">
            <h2 className="text-base text-black font-medium">Preview</h2>
            <button className="text-base font-semibold">X</button>
          </div>

          <iframe
            key={iframeKey}
            src={`/pages/${slug}`}
            className="w-full h-80 md:h-full pt-2"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = parseCookies(ctx);

  if (!cookies.token) {
    return {
      redirect: {
        destination: '/user/auth/login',
        permanent: false,
      },
    };
  }

  const checkPage = await fetch(`${process.env.BASE_URL}/api/v1/user/pages/detail?pageId=${ctx.params.pageId}`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${cookies.token}`,
    },
  });

  try {
    const res = await checkPage.json();
    if (!res.status) {
      return {
        redirect: {
          destination: '/user/pages',
          permanent: false,
        },
      };
    }
  } catch (e) {
    return {
      redirect: {
        destination: '/user/pages',
        permanent: false,
      },
    };
  }

  return {
    props: { token: cookies?.token, pageId: ctx.params.pageId },
  };
}
