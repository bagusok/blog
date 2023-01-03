import Paragraph from '@tiptap/extension-paragraph';
import { useEffect, useState } from 'react';

export default function ButtonTextAlign({ editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [textAlign, setTextAlign] = useState('Left');

  const handleChange = (e) => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex bg-black text-white rounded-sm">
      <button className="tiptap-btn-active" onClick={() => setIsOpen(!isOpen)}>
        {editor?.isActive({ textAlign: 'left' })
          ? 'Left'
          : editor.isActive({ textAlign: 'center' })
          ? 'Center'
          : editor.isActive({ textAlign: 'right' })
          ? 'Right'
          : editor.isActive({ textAlign: 'justify' })
          ? 'Justify'
          : 'Left'}
      </button>
      <div className={isOpen ? 'block absolute z-50' : 'hidden'}>
        <div className="rounded-md bg-white shadow-md p-2 w-full flex flex-row gap-2">
          <button
            onClick={() => {
              editor.chain().focus().setTextAlign('left').run();
              handleChange();
            }}
            className={
              editor.isActive({ textAlign: 'left' })
                ? 'tiptap-btn-active'
                : 'tiptap-btn'
            }
          >
            left
          </button>
          <button
            onClick={() => {
              editor.chain().focus().setTextAlign('center').run();
              handleChange();
            }}
            className={
              editor.isActive({ textAlign: 'center' })
                ? 'tiptap-btn-active'
                : 'tiptap-btn'
            }
          >
            center
          </button>
          <button
            onClick={() => {
              editor.chain().focus().setTextAlign('right').run();
              handleChange();
            }}
            className={
              editor.isActive({ textAlign: 'right' })
                ? 'tiptap-btn-active'
                : 'tiptap-btn'
            }
          >
            right
          </button>
          <button
            onClick={() => {
              editor.chain().focus().setTextAlign('justify').run();
              handleChange();
            }}
            className={
              editor.isActive({ textAlign: 'justify' })
                ? 'tiptap-btn-active'
                : 'tiptap-btn'
            }
          >
            justify
          </button>
        </div>
      </div>
    </div>
  );
}
