import { useState } from 'react';
import ButtonHeading from './ButtonHeading';
import ButtonTextAlign from './ButtonTextAlign';
import { useAtom } from 'jotai';
import { openModalUpload } from './EditorForm';

export default function Button({ editor }) {
  const [value, setValue] = useState('1');
  const [showModalUplod, setShowModalUpload] = useAtom(openModalUpload);

  if (!editor) {
    return null;
  }

  const handleHeading = (e, editor) => {
    switch (e.target.value) {
      case '1':
        editor.chain().focus().setParagraph().run();
        setValue('1');
        break;
      case '2':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        setValue('2');
        break;
      case '3':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case '4':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case '5':
        editor.chain().focus().toggleHeading({ level: 4 }).run();
        break;
      case '6':
        editor.chain().focus().toggleHeading({ level: 5 }).run();
        break;
      case '7':
        editor.chain().focus().toggleHeading({ level: 6 }).run();
        break;
      default:
        editor.chain().focus().setParagraph().run();
        break;
    }
  };

  return (
    <>
      <div className="flex flex-row flex-wrap gap-2">
        <ButtonTextAlign editor={editor} />

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'tiptap-btn-active' : 'tiptap-btn'}
        >
          bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'tiptap-btn-active' : 'tiptap-btn'}
        >
          italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'tiptap-btn-active' : 'tiptap-btn'}
        >
          strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'tiptap-btn-active' : 'tiptap-btn'}
        >
          code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()} className="tiptap-btn">
          clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()} className="tiptap-btn">
          clear nodes
        </button>
        <ButtonHeading editor={editor} />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'tiptap-btn-active' : 'tiptap-btn'}
        >
          bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'tiptap-btn-active' : 'tiptap-btn'}
        >
          ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'tiptap-btn-active' : 'tiptap-btn'}
        >
          code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'tiptap-btn-active' : 'tiptap-btn'}
        >
          blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="tiptap-btn">
          horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()} className="tiptap-btn">
          hard break
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="tiptap-btn"
        >
          undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="tiptap-btn"
        >
          redo
        </button>
        <button onClick={() => setShowModalUpload({ ...showModalUplod, editor: true })} className="tiptap-btn">
          Img
        </button>
        <button onClick={() => editor.chain().focus().setCustom().run()} className="tiptap-btn">
          Custom
        </button>
      </div>
    </>
  );
}
