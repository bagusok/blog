import { EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import Button from './button';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { checkedValue } from './image-modal/ListedImages';
import ListedImages from './image-modal/ListedImages';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { editorContent } from '../../pages/user/post/edit/[postId]';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { mergeAttributes, Node } from '@tiptap/core';

import { lowlight } from 'lowlight/lib/core';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import CodeBlock from './extension/CodeBlock';

lowlight.registerLanguage('html', html);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('js', js);
lowlight.registerLanguage('ts', ts);

export const openModalUpload = atom({
  editor: false,
  thumbnail: false,
  profile: false,
}); //Set Upload Modal true or false from editor, thumbnail, and profile image

export const editorValue = atom('');

export default function EditorForm() {
  const [showModalUpload, setShowModalUpload] = useAtom(openModalUpload);

  const getEditorContent = useAtomValue(editorContent);

  const getUrl = useSetAtom(checkedValue);

  const setEditor = useSetAtom(editorValue);

  const CustomNode = Node.create({
    name: 'customNode',
    priority: 1000,
    content: 'inline*',
    group: 'block',
    addOptions() {
      return {
        HTMLAttributes: {},
      };
    },
    parseHTML() {
      return [
        {
          tag: 'div',
          style: '',
        },
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addCommands() {
      return {
        setCustom:
          () =>
          ({ commands }) => {
            return commands.setNode(this.name);
          },
      };
    },

    // Your code goes here.
  });

  const editor = useEditor({
    extensions: [
      CustomNode,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlock);
        },
      }).configure({ lowlight }),
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignment: ['left', 'center', 'right', 'justify'],
      }),
      Image,
    ],
    content: `<toc></toc>
    <h2>1 heading</h2>
    <p>paragraph</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    setEditor(editor?.getHTML());
  }, [editor?.chain()]);

  const onAddImage = (url, alt = 'image-blog') => {
    editor.chain().focus().setImage({ src: url, alt }).run();
    setTimeout(() => {
      setShowModalUpload(false);
    }, 500);
    getUrl({});
    editor.commands.enter();
  };

  useEffect(() => {
    editor?.commands?.setContent(getEditorContent);
    console.log('ini editor', editor?.getHTML());
  }, [getEditorContent, editor]);

  return (
    <>
      <div className="border-b-2 py-2 sticky top-0 z-20 bg-gray-200 p-2">
        <Button editor={editor} />
      </div>
      <div className="px-3">
        <EditorContent editor={editor} />
      </div>

      {showModalUpload?.editor && <ListedImages onAddImage={onAddImage} />}
    </>
  );
}
