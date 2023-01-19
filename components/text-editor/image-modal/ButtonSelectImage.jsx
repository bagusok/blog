import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { mutate } from 'swr';
import { fetcher } from '../../../lib/fetcher';
import { checkedValue } from './ListedImages';

export default function ButtonSelectImage({ onAddImage, onDeleteImage }) {
  const getUrl = useAtomValue(checkedValue);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingSubmit, setLoadinggSubmit] = useState(false);
  const [altImage, setAltImage] = useState('aaaa');

  const handleDeleteImage = async () => {
    setLoadingDelete(true);
    const get = await fetch('http://localhost:3000/api/v1/user/post/delete-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: getUrl.path, type: getUrl.type }),
    });

    try {
      const res = await get.json();
      setLoadingDelete(false);
      window.alert(res.message);
    } catch (e) {
      setLoadingDelete(false);
      window.alert(e);
    }
    mutate('/api/v1/user/post/get-images?type=s3', fetcher);
    mutate('/api/v1/user/post/get-images?type=cloudinary', fetcher);
  };

  const handleSelectImage = async () => {
    setLoadinggSubmit(true);
    onAddImage(getUrl.url, altImage);
  };

  return (
    <>
      <div className="flex justify-between items-center px-4 w-full h-12 bg-blue-500 absolute bottom-0 right-0">
        <div className="form-alt ">
          <input
            className="text-sm font-normal p-2 rounded-sm h-8 w-32 md:w-48"
            placeholder="Alt Image"
            onInput={(e) => setAltImage(e.target.value)}
            value={altImage}
          />
        </div>
        <div className="inline-flex gap-2 items-center">
          <button
            type="button"
            className="flex items-center  px-4 h-8 rounded-md text-sm bg-red-400 text-white"
            onClick={() => handleDeleteImage()}
            disabled={loadingDelete ? 'disabled' : ''}
          >
            {loadingDelete ? 'Loading...' : 'Delete'}
          </button>
          <button
            type="button"
            className="flex items-center px-4 h-8 rounded-md text-sm bg-green-500 text-white disabled:opacity-60"
            onClick={() => handleSelectImage()}
            disabled={loadingSubmit ? 'disabled' : ''}
          >
            {loadingSubmit ? 'Loading...' : 'Select'}
          </button>
        </div>
      </div>
    </>
  );
}
