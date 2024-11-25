// 'use client';

// import { Editor } from '@toast-ui/react-editor';
// import '@toast-ui/editor/dist/toastui-editor.css';

// interface EditorComponentProps {
//   editorRef: React.RefObject<Editor>;
//   initialValue: string;
//   previewStyle: 'vertical' | 'tab';
//   height: string;
//   initialEditType: 'markdown' | 'wysiwyg';
//   useCommandShortcut: boolean;
//   hideModeSwitch: boolean;
//   onChange: () => void;
// }

// const EditorComponent = ({
//   editorRef,
//   initialValue,
//   previewStyle,
//   height,
//   initialEditType,
//   useCommandShortcut,
//   hideModeSwitch,
//   onChange,
// }: EditorComponentProps) => {
//   return (
//     <Editor
//       ref={editorRef}
//       initialValue={initialValue}
//       previewStyle={previewStyle}
//       height={height}
//       initialEditType={initialEditType}
//       useCommandShortcut={useCommandShortcut}
//       hideModeSwitch={hideModeSwitch}
//       onChange={onChange}
//     />
//   );
// };

// export default EditorComponent;

'use client';

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'katex/dist/katex.min.css'; // KaTeX 스타일 추가
import katex from 'katex'; // KaTeX 라이브러리

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
  const customHTMLRenderer = {
    latex(node: any) {
      try {
        const renderedMath = katex.renderToString(node.literal || '', {
          throwOnError: false, // 잘못된 문법에 대한 에러 방지
        });

        return [
          { type: 'openTag', tagName: 'div', outerNewLine: true },
          { type: 'html', content: renderedMath },
          { type: 'closeTag', tagName: 'div', outerNewLine: true },
        ];
      } catch (error) {
        console.error('KaTeX 렌더링 에러:', error);
        return [
          { type: 'openTag', tagName: 'div', outerNewLine: true },
          { type: 'html', content: '잘못된 LaTeX 문법입니다.' },
          { type: 'closeTag', tagName: 'div', outerNewLine: true },
        ];
      }
    },
  };

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
      customHTMLRenderer={customHTMLRenderer} // KaTeX 렌더러 추가
    />
  );
};

export default EditorComponent;
