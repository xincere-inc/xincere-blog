import 'react';

declare module '@uiw/react-markdown-editor' {
  interface IMarkdownEditor {
    onImageUpload?: (file: File) => Promise<string>;
    ref?: React.Ref<any>;
  }
}
