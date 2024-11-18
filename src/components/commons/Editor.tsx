'use client';

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

interface EditorComponentProps {
  editorRef: React.RefObject<Editor>;
  initialValue: string;
  previewStyle: 'vertical' | 'tab';
  height: string;
  initialEditType: 'markdown' | 'wysiwyg';
  useCommandShortcut: boolean;
  hideModeSwitch: boolean;
  onChange: () => void;
}

const EditorComponent = ({
  editorRef,
  initialValue,
  previewStyle,
  height,
  initialEditType,
  useCommandShortcut,
  hideModeSwitch,
  onChange,
}: EditorComponentProps) => {
  return (
    <Editor
      ref={editorRef}
      initialValue={initialValue}
      previewStyle={previewStyle}
      height={height}
      initialEditType={initialEditType}
      useCommandShortcut={useCommandShortcut}
      hideModeSwitch={hideModeSwitch}
      onChange={onChange}
    />
  );
};

export default EditorComponent;
