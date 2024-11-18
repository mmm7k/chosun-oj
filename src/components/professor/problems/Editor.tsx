'use client';

import React, { forwardRef } from 'react';
import { Editor as TuiEditor } from '@toast-ui/react-editor';

interface EditorComponentProps {
  initialValue: string;
  previewStyle: 'vertical' | 'tab';
  height: string;
  initialEditType: 'markdown' | 'wysiwyg';
  useCommandShortcut: boolean;
  hideModeSwitch: boolean;
  onChange: () => void;
}

const EditorComponent = forwardRef<TuiEditor, EditorComponentProps>(
  (
    {
      initialValue,
      previewStyle,
      height,
      initialEditType,
      useCommandShortcut,
      hideModeSwitch,
      onChange,
    },
    ref,
  ) => {
    return (
      <TuiEditor
        ref={ref}
        initialValue={initialValue}
        previewStyle={previewStyle}
        height={height}
        initialEditType={initialEditType}
        useCommandShortcut={useCommandShortcut}
        hideModeSwitch={hideModeSwitch}
        onChange={onChange}
      />
    );
  },
);

EditorComponent.displayName = 'EditorComponent';
export default EditorComponent;
