import Image from 'next/image';
import { useState } from 'react';
import { AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex self-center rounded py-2" onClick={() => setIsOpen((prev) => !prev)}>
        <Image
          alt="Profile"
          src="https://bagusoks.nyc3.digitaloceanspaces.com/blog/kjMEZifk1cccJgd1aBdO3JxxiEvthk.webp"
          width={50}
          height={50}
          className="rounded-md object-cover h-auto w-[50px]"
        />

        {isOpen && (
          <ul className="absolute z-50 right-2 top-16 flex flex-col p-2 rounded-md shadow-md bg-white">
            <li className="inline-flex gap-2 items-center text-center rounded px-2 py-1 font-semibold hover:bg-orange-400">
              <AiOutlineUser /> <span>Profile</span>
            </li>
            <li className="inline-flex gap-2 items-center text-center rounded px-2 py-1 font-semibold hover:bg-orange-400">
              <AiOutlineLogout /> <span>Logout</span>
            </li>
          </ul>
        )}
      </div>
    </>
  );
}
