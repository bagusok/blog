import Image from 'next/image';
import FeaturedPost from './FeaturedPost';

export default function Aside() {
  return (
    <>
      <aside className="lg:w-3/12 md:w-4/12 flex flex-col mt-5 px-5 lg:px-0 lg:pr-5 box-border">
        <div className="bg-[#414141] w-full rounded-md px-5 pt-5 pb-10">
          <h2 className="text-4xl md:text-2xl font-bold text-white">Newsletter</h2>
          <p className="text-md md:text-sm font-regular text-white mt-2">
            Join newsletter here, to receive update latest post
          </p>
          <input
            type="text"
            className="w-full rounded py-4 md:py-2 px-6 md:px-4 text-md md:text-sm font-regular bg-white mt-5"
            placeholder="admin@bagusok.com"
          />
          <button
            type="button"
            className="w-full rounded h-12 md:h-10 flex items-center justify-center font-medium text-white text-md bg-melrose-300 mt-3 hover:opacity-70"
          >
            Submit
          </button>
        </div>
        <div className="w-full h-48 flex items-center justify-center border border-dashed border-slate-500 rounded-md mt-3">
          <p className="text-sm font-regular text-slate-500">Ads</p>
        </div>
        <FeaturedPost />
      </aside>
    </>
  );
}
