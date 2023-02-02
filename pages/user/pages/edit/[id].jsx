import Editor from '@monaco-editor/react';
import { Tab } from '@headlessui/react';
import SideBar from '../../../../components/user/Sidebar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { memo } from 'react';
import Preview from '../../../../components/user/pages/Preview';

export default function EditPages() {
  const [htmlValue, setHtmlValue] = useState('<!-- Write your HTML here -->');
  const [jsValue, setJsValue] = useState('// Write your Javascript here');

  function handleEditorHtml(value, event) {
    setHtmlValue(value);
    console.log('here is the current model value:', value);
  }

  function handleEditorJS(value, event) {
    setJsValue(value);
    console.log('here is the current model value:', value);
  }

  return (
    <>
      <SideBar />
      <div className="px-3 md:px-8 lg:px-16 flex justify-end mb-6">
        <button className="text-base font-medium px-6 py-2 rounded-sm bg-orange-400 text-white hover:opacity-70">
          Save
        </button>
      </div>
      <div className="px-3 md:px-8 lg:px-16 flex flex-col md:flex-row gap-3">
        <div className="w-full md:w-2/3">
          <Tab.Group>
            <Tab.List className="rounded overflow-hidden bg-slate-200 w-fit flex justify-between">
              <Tab className="w-24 h-10 text-sm font-semibold ui-selected:outline-none ui-selected:bg-[#1c1c1c] ui-not-selected:bg-gray-500 text-white">
                Html
              </Tab>
              <Tab className="w-24 h-10 text-sm font-semibold ui-selected:outline-none ui-selected:bg-[#1c1c1c] ui-not-selected:bg-gray-500 text-white">
                Javascript
              </Tab>
            </Tab.List>
            <Tab.Panels className="-mt-1 w-full rounded overflow-hidden">
              <Tab.Panel>
                <Editor
                  width="50rem"
                  className="h-96 rounded"
                  defaultLanguage="html"
                  theme="vs-dark"
                  defaultValue={htmlValue}
                  onChange={handleEditorHtml}
                />
              </Tab.Panel>
              <Tab.Panel>
                <Editor
                  width="50rem"
                  className="h-96 rounded"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  defaultValue={jsValue}
                  onChange={handleEditorJS}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        <div className="w-full md:w-1/3 overflow-hidden border border-black rounded">
          <div className="h-10 flex justify-between items-center border-b-2 px-3">
            <h2 className="text-base text-black font-medium">Preview</h2>
            <button className="text-base font-semibold">X</button>
          </div>
          <Preview />
        </div>
      </div>
    </>
  );
}
