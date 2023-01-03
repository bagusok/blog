import Paragraph from '@tiptap/extension-paragraph';
import { useEffect, useState } from 'react';

export default function ButtonHeading({ editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [textHeading, setTextHeading] = useState('P');

  const handleChange = (e) => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex bg-black text-white rounded-sm">
      <button className="tiptap-btn-active" onClick={() => setIsOpen(!isOpen)}>
        {editor?.isActive('paragraph')
          ? 'P '
          : editor.isActive('heading', { level: 1 })
          ? 'H1'
          : editor.isActive('heading', { level: 2 })
          ? 'H2'
          : editor.isActive('heading', { level: 3 })
          ? 'H3'
          : editor.isActive('heading', { level: 4 })
          ? 'H4'
          : editor.isActive('heading', { level: 5 })
          ? 'H5'
          : editor.isActive('heading', { level: 6 })
          ? 'H6'
          : 'P'}
      </button>
      <div className={isOpen ? 'block absolute z-50' : 'hidden'}>
        <div className="rounded-md bg-white shadow-md p-2 w-full flex flex-row gap-2">
          <button
            onClick={() => {
              editor.chain().focus().setParagraph().run();
              handleChange('P');
            }}
            className={
              editor.isActive('paragraph') ? 'tiptap-btn-active' : 'tiptap-btn'
            }
          >
            paragraph
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
              handleChange('H1');
            }}
            className={
              editor.isActive('heading', { level: 1 })
                ? 'tiptap-btn-active'
                : 'tiptap-btn'
            }
          >
            h1
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
              handleChange('H2');
            }}
            className={
              editor.isActive('heading', { level: 2 })
                ? 'tiptap-btn-active'
                : 'tiptap-btn'
            }
          >
            h2
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
              handleChange('H3');
            }}
            className={
              editor.isActive('heading', { level: 3 })
                ? 'tiptap-btn-active'
                : 'tiptap-btn'
            }
          >
            h3
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 4 }).run();
              handleChange('H$');
            }}
            className={
              editor.isActive('heading', { level: 4 })
                ? 'tiptap-btn-active'
                : 'tiptap-btn'
            }
          >
            h4
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 5 }).run();
              handleChange('H5');
            }}
            className={
              editor.isActive('heading', { level: 5 })
                ? 'tiptap-btn-active'
                : 'tiptap-btn'
            }
          >
            h5
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 6 }).run();
              handleChange('H6');
            }}
            className={
              editor.isActive('heading', { level: 6 })
                ? 'tiptap-btn-active'
                : 'tiptap-btn'
            }
          >
            h6
          </button>
        </div>
      </div>
    </div>
  );
}
