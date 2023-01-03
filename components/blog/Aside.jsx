import Image from 'next/image';

export default function Aside() {
  return (
    <>
      <aside className="lg:w-3/12 md:w-4/12 flex flex-col mt-5 px-5 lg:px-0 lg:pr-5 box-border">
        <div className="bg-[#414141] w-full rounded-md p-5">
          <h2 className="text-2xl font-bold text-white">Newsletter</h2>
          <p className="text-sm font-regular text-white">Join newsletter here, to receive update latest post</p>
          <input
            type="text"
            className="w-full rounded-full py-2 px-4 text-sm font-regular bg-white mt-5"
            placeholder="admin@bagusok.com"
          />
          <button
            type="button"
            className="w-full rounded-full h-8 flex items-center justify-center font-medium text-white text-md bg-melrose-300 mt-3 hover:opacity-70"
          >
            Submit
          </button>
        </div>
        <div className="w-full h-48 flex items-center justify-center border border-dashed border-slate-500 rounded-md mt-3">
          <p className="text-sm font-regular text-slate-500">Ads</p>
        </div>
        <div className="w-full mt-3 flex flex-col gap-3 md:sticky md:top-16 lg:top-3">
          <h2 className="text-md font-semibold text-black">Related Post</h2>
          <div className="inline-flex">
            <div className="w-1/4">
              <div className="h-full w-auto lg:w-14 lg:h-14 rounded-md overflow-hidden bg-melrose-300">
                <Image
                  src="https://bagusoks.nyc3.digitaloceanspaces.com/blog/BLyk7c-aLxNmOyPctleg_lf24SYLyA.webp"
                  alt="Image"
                  width={500}
                  height={500}
                  className="object-cover h-full w-auto"
                />
              </div>
            </div>

            <div className="w-3/4 flex flex-col ml-3">
              <h2 className="text-base lg:text-sm font-semibold text-black h-16 text-ellipsis max-w-full overflow-hidden">
                Jago Membuat Landing Page dengan Boostrap 5
              </h2>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
