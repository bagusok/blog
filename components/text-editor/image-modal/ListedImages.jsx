import { atom, useAtom } from 'jotai';
import ButtonSelectImage from './ButtonSelectImage';
import { openModalUpload } from '../EditorForm';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export const checkedValue = atom({});

export default function ListedImages({ onAddImage }) {
  const [value, setValue] = useAtom(checkedValue);
  const [, setShowModalUpload] = useAtom(openModalUpload);

  const [listLoading, setListLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [listImagesResult, setListImagesResult] = useState({});

  const [imageValue, setImageValue] = useState(null);

  const handleUploadImage = async () => {
    setUploadLoading(true);
    const formData = new FormData();
    formData.append('image', imageValue);
    const post = await fetch('/api/v1/user/post/upload-image', {
      method: 'POST',
      body: formData,
    });
    try {
      const resJson = await post.json();
      if (resJson.status) {
        getListImages();
      }
      setUploadLoading(false);
    } catch (e) {
      setUploadLoading(false);
      console.log('Eror Upload');
    }
  };

  const getListImages = async () => {
    setListLoading(true);
    const get = await fetch('/api/v1/user/post/get-images');
    try {
      const resJson = await get.json();
      if (resJson.status) {
        setListImagesResult(resJson);
      }
      if (!resJson.data) {
        setValue({});
      }
      setListLoading(false);
    } catch (e) {
      console.log('Eror Fetch');
    }
  };

  useEffect(() => {
    getListImages();
    console.log('aa');
  }, []);

  const handleRadio = (e) => {
    setValue({ url: e.url, path: e.path });
  };
  return (
    <div className="w-screen px-3 min-h-screen max-h-full bg-slate-300/50 fixed top-0 flex justify-center items-center z-30 fixed right-0">
      <button
        className="absolute top-2 right-2"
        onClick={() =>
          setShowModalUpload({
            editor: false,
            thumbnail: false,
            profile: false,
          })
        } // must be same with openModalUpload initial value
      >
        x
      </button>
      <div className="md:w-2/3 md:h-2/3 bg-white rounded-md p-3 h-96 relative overflow-hidden z-40">
        <div className="flex items-center justify-between mb-3">
          <div className="form-upload inline-flex gap-2 items-center">
            <form>
              <input
                className="block w-48 p-1 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none "
                type="file"
                accept="image/*"
                onChange={(e) => setImageValue(e.target.files[0])}
              />
            </form>
            <button
              type="button"
              className="flex items-center px-4 h-8 rounded-md text-sm bg-green-500 text-white"
              disabled={uploadLoading}
              onClick={() => handleUploadImage()}
            >
              {uploadLoading ? 'Loading' : 'Upload'}
            </button>
          </div>
          <button
            type="button"
            className="text-lg font-bold mr-3"
            onClick={() => setShowModalUpload(false)}
          >
            X
          </button>
        </div>
        <hr className="h-[2px] bg-slate-200 rounded-full" />
        <div className="w-full overflow-y-scroll h-full mt-2">
          <ul className="flex flex-row flex-wrap gap-2 w-full h-full pb-5">
            {listLoading ? (
              <p>Loading</p>
            ) : listImagesResult.data?.length < 1 ? (
              <p>Tidak ada gambar</p>
            ) : (
              listImagesResult?.data?.map((a, i) => {
                return (
                  <li key={i} className="relative">
                    <input
                      type="radio"
                      id={'images' + i}
                      name="image"
                      value="radio 2"
                      className="hidden peer"
                      onChange={(e) => handleRadio(a)}
                    />
                    <label
                      htmlFor={'images' + i}
                      className="card flex justify-center rounded-md shadow-sm h-20 w-30 bg-white border overflow-hidden peer-checked:border-4 peer-checked:border-red-500 peer-checked:scale-90 transition ease-in-out delay-50"
                    >
                      <Image
                        src={a.url}
                        alt="image"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAFkAhcDASIAAhEBAxEB/8QAGgABAQEBAQEBAAAAAAAAAAAAAAIBAwYEBf/EABwQAQEBAQEBAAMAAAAAAAAAAAABEQISAyExQf/EABgBAQEBAQEAAAAAAAAAAAAAAAABAgME/8QAGREBAQEBAQEAAAAAAAAAAAAAAAEREgIx/9oADAMBAAIRAxEAPwD0wDLs0Y0BrGgNY0GgA0ARoANGNEAFAAAABjWIDGsFGAKmsraygmsramgypqqigmpqqmiJqKuooJqKuooJqKuooiairqKompqqmiJqaqpoJrK2poMBggxrAAAAAaAA1jQAAaMaAAD1YwRtoArRjQa1LQa1gDWsaA1gI1rARoxoAAAMAAFGADGVrKKypraygypraygmpqqmiJqa2poJqaqooJqaqpoIqaqooiamqqaomoqqmiJqaqpoMqa2soMY1gjAYDWADRgDWpaDRjQaMAaAAAD1YwRtowBQwBTUtBrUtFa1gChjRBrAGjGgAAAwGsABgCsZWpAqa2soMqa2pojKmtqaDKmtqaCamtqaCamqqKImpqqiqJqaqooMqKqpoiamtrKDKmtqaIMGADAAYKNaloNGAKGANawBowBowB6sZprLbRmmgoZoCmpAU1LQVpqWgpqTQU1OmgoZpoNGaaDRmmg1hrNBrGazQammsArKVlBlTW1NoMqa21NBlTW1NBlRVVFEZUVVRVGVFVaigyoqqi0RlTW1NBNZSptELU1tTaAzS1gAzWaqNGaaDWp00FDNNBQnW6DWp00FDNNBozQHqtGaay2rROt0GtTrdBut1Ot0VWt1Gt0Fa3U6aCxOt0FCdboNanTQUM00GidNBozWaDWGs0BlpqbQbam0tZQLU0rLRGVNbU2gyptbai1Rlqa2ptBlRa21NETU1tqbQTamtqbQZUWttTaIy1Nbam0GWstLU2qhazTWaBprNZoitZrNNBWmp00FaanW6CtNTrdBWmp00FaazTQbozQHqtbqdNR0VpqdNBemp00F6anTQXrdRrdBWt1Gt1Bemp00F6anTQVrdTpoK01OmgrTU6aDdNZrNBus1mmgazTU2g21Npay1QtTaWptAtTa21NoMtTaWptELUWttTaDLUWttRaBai1tqbRGWotbai0C1FrbUWgWptLU2qham0tTaI21mstZoN1ms1miK01OmgrTU6aqK1uo00F63UaaC9NTpoavTUa3Q1WidAer01OmsuqtNTrdBWmp00F63Ua3QVrdRrdBemp00F63UaaC9bqNNFXpqdNBWmp00FaanTQVrNZrNBump00Rus1ms0C1lrLWWgWstZay0C1Npam0C1FrbU2gy1Npam0GWptbai0RlqbS1NoMtTaWptEZam0tTaoy1Npam0QtTaWptEbam1lrNVG6ajTRNVpqNNDV6ajTRNXrdc9boavW6563RNXrdc9boavTUaaLq9EaBr1ump01l3VpqdNBemp00F6anTQXrdRrdBWt1Gt0F6anTQXpqdNBemp00FaanTQVpqdNBWs1Omg3TU6zQVrLWanQbay1lrLQLWWs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"
                        width={50}
                        height={50}
                        className="w-auto h-auto"
                      />
                    </label>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {value?.url && (
          <ButtonSelectImage
            onAddImage={onAddImage}
            onDeleteImage={getListImages}
          />
        )}
      </div>
    </div>
  );
}
