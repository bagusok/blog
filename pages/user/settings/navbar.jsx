import SideBar from '../../../components/user/Sidebar';
import { BsTrash } from 'react-icons/bs';

export default function NavbarSetting() {
  return (
    <>
      <SideBar />
      <div className="w-full flex justify-end md:px-16 mt-5">
        <button className="p-2 h-10 rounded-sm text-xs w-2/8 bg-orange-500 text-white">Add Menu</button>
      </div>
      <div className="px-2 mt-10 flex flex-col md:flex-row justify-center flex-wrap gap-2">
        <div className="card bg-white rounded-sm shadow-md p-2 border border-slate-200 flex flex-col gap-2 w-fit h-fit">
          <div className="inline-flex w-full gap-2">
            <input
              type="text"
              className="p-2 h-8 rounded-sm border border-slate-500 text-xs w-3/8 disabled:bg-slate-100"
              disabled
            />
            <input
              type="text"
              className="p-2 h-8 rounded-sm border border-slate-500 text-xs w-3/8 disabled:bg-slate-100"
              disabled
            />
            <button className="p-2 h-8 rounded-sm border border-slate-500 text-xs w-2/8 bg-red-500 text-white">
              <BsTrash className="text-lg" />
            </button>
          </div>
          <div className="inline-flex gap-2">
            <button className="p-2 h-8 rounded-sm border border-slate-500 text-xs w-2/8 bg-red-500 text-white">
              <BsTrash className="text-lg" />
            </button>
            <input
              type="text"
              className="p-2 h-8 rounded-sm border border-slate-500 text-xs w-3/8 disabled:bg-slate-100"
              disabled
            />
            <input
              type="text"
              className="p-2 h-8 rounded-sm border border-slate-500 text-xs w-3/8 disabled:bg-slate-100"
              disabled
            />
          </div>
          <div className="inline-flex gap-2">
            <button className="p-2 h-8 rounded-sm border border-slate-500 text-xs w-2/8 bg-red-500 text-white">
              <BsTrash className="text-lg" />
            </button>
            <input
              type="text"
              className="p-2 h-8 rounded-sm border border-slate-500 text-xs w-3/8 disabled:bg-slate-100"
              disabled
            />
            <input
              type="text"
              className="p-2 h-8 rounded-sm border border-slate-500 text-xs w-3/8 disabled:bg-slate-100"
              disabled
            />
          </div>
          <button className="p-2 h-8 rounded-sm border border-slate-500 text-xs w-fit bg-blue-500 text-white mt-2">
            Add Child
          </button>
        </div>
      </div>
    </>
  );
}
