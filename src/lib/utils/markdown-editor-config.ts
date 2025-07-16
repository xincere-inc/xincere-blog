import type { ICommand } from '@uiw/react-markdown-editor';
import type { Commands } from '@uiw/react-markdown-editor/cjs/components/ToolBar';

const defaultCommands: Commands[] = [
  'undo',
  'redo',
  'bold',
  'italic',
  'header',
  'strike',
  'quote',
  'olist',
  'ulist',
  'todo',
  'link',
  'code',
  'codeBlock',
];

export const getMarkdownToolbarCommands = (commands: ICommand[]) => {
  return [...defaultCommands, ...commands];
};
