import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import slugify from 'slugify';
import EditorForm, { editorValue, openModalUpload } from '../../../../components/text-editor/EditorForm';
import useSWR from 'swr';
import { fetcher } from '../../../../lib/fetcher';
import ListedImages from '../../../../components/text-editor/image-modal/ListedImages';
import { checkedValue } from '../../../../components/text-editor/image-modal/ListedImages';
import { toast, Toaster } from 'react-hot-toast';
import SideBar from '../../../../components/user/Sidebar';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

export const editorContent = atom('jaja');

export default function EditPost({ token }) {
  const [showModalUplod, setShowModalUpload] = useAtom(openModalUpload);
  const getUrlThumbnail = useAtomValue(checkedValue);
  const editorHtml = useAtomValue(editorValue);
  const { register, handleSubmit, getValues, setValue, onChange } = useForm();

  const setEditorContent = useSetAtom(editorContent);

  const router = useRouter();
  const [publishButtonIsLoading, setPublishButtonIsLoading] = useState({
    isPublished: false,
    isSave: false,
  });

  const { data: categoryValue } = useSWR('/api/v1/user/post/get-category', fetcher);

  const { data: tagsValue } = useSWR('/api/v1/user/post/get-tags', fetcher);

  const [category, setCategory] = useState(categoryValue?.data);
  const [tags, setTags] = useState(tagsValue?.data);

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

  const savePost = async (e, params) => {
    if (!params?.isPublished) {
      setPublishButtonIsLoading((prev) => ({ ...prev, isSave: true }));
    } else {
      setPublishButtonIsLoading((prev) => ({ ...prev, isPublished: true }));
    }

    const selectedTags = tags?.map((a, i) => a.value);
    const isPublished = params?.isPublished ? true : false;

    const data = {
      ...e,
      postId: router.query.postId,
      category: category.value || 'all',
      tags: selectedTags || [],
      body: editorHtml,
      isPublished,
    };
    console.log(data);

    const save = await fetch('/api/v1/user/post/update-post', {
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
        isPublished && router.push('/user/post/', undefined, { shallow: true });
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error(e.message);
    }
    setPublishButtonIsLoading({ isPublished: false, isSave: false });
  };

  const addThumbnail = (e) => {
    setValue('thumbnail', getUrlThumbnail.url);
    console.log(getUrlThumbnail);
    setShowModalUpload((prev) => ({ ...prev, thumbnail: false }));
  };

  const getPostDetail = async (postId) => {
    const getPost = await fetch(`/api/v1/user/post/get-post-detail?postId=${postId}`, {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
    });
    try {
      const res = await getPost.json();

      console.log(res);
      if (!res.status) {
        router.push('/user/post/', undefined, { shallow: true });
      }
      setEditorContent(res.data.body);
      setCategory({ value: res.data.categoriesName, label: res.data.categoriesName });
      setTags(res?.data?.tag?.map((a, i) => ({ value: a.tagName, label: a.tagName })));
      console.log('ini taf', tags);
      setValue('title', res.data.title);
      setValue('slug', res.data.slug);
      setValue('thumbnail', res.data.thumbnail);
      setValue('description', res.data.metaDescription);
    } catch (e) {
      router.push('/user/post/', undefined, { shallow: true });
    }
  };

  useEffect(() => {
    if (router.query.postId) {
      getPostDetail(router.query.postId).then(() => {
        console.log('success');
      });
    }
  }, [router.query.postId]);
  return (
    <>
      <SideBar />
      <Toaster />
      {showModalUplod.thumbnail && <ListedImages onAddImage={addThumbnail} />}

      <div className="w-full flex flex-col-reverse md:flex-row md:flex-row px-4 md:p-4 md:gap-4 relative">
        <div className="md:w-3/4 border-4 border-gray-200 rounded-sm min-h-screen ">
          <EditorForm />
        </div>
        <div className="md:w-1/4">
          <form className="flex flex-col gap-2" onSubmit={handleSubmit(savePost)}>
            <div className="inline-flex gap-2 place-items-end">
              <div className="form-group col-span-1">
                <label htmlFor="title">Thumbnail</label>
                <input
                  type="url"
                  name="thumbnail"
                  className="bg-white border border-slate-500 p-1 rounded-sm text-sm font-normal w-full"
                  placeholder="https://example.com"
                  {...register('thumbnail')}
                />
              </div>
              <button
                type="button"
                className="px-2 text-sm bg-green-500 text-white rounded-sm h-8"
                onClick={() => setShowModalUpload((prev) => ({ ...prev, thumbnail: true }))}
              >
                Upload
              </button>
            </div>

            <div className="form-group">
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
            <div className="form-group">
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
            <div className="form-group">
              <label htmlFor="title">Category</label>
              <CreatableSelect
                className="text-sm border border-slate-500 rounded-sm"
                id="category"
                instanceId="kiioaoao"
                onChange={(e) => setCategory(e)}
                options={categoryValue?.data}
                value={category}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Tags</label>
              <CreatableSelect
                isMulti
                className="text-sm border border-slate-500 rounded-sm"
                id="Tags"
                instanceId="aakkaka"
                onChange={(e) => {
                  setTags(e);
                  console.log(tags);
                }}
                options={tagsValue?.data}
                value={tags}
              />
            </div>
            <button
              type="submit"
              name="save"
              className="px-2 py-1 text-sm bg-blue-500 rounded-md text-white disabled:opacity-60"
              disabled={publishButtonIsLoading.isSave}
            >
              {publishButtonIsLoading.isSave ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="px-2 py-1 text-sm bg-orange-500 rounded-md text-white disabled:opacity-60"
              disabled={publishButtonIsLoading.isPublished}
              onClick={handleSubmit((e) => savePost(e, { isPublished: true }))}
            >
              {publishButtonIsLoading.isPublished ? 'Publishing...' : 'Publish'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = await parseCookies(ctx);

  const { postId } = ctx.query;

  if (!cookies.token) {
    return {
      redirect: {
        destination: '/user/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: { token: cookies?.token },
  };
}
