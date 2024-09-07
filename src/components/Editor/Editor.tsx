import '@blocknote/core/fonts/inter.css';
import {
  BlockNoteView,
  darkDefaultTheme,
  lightDefaultTheme,
  Theme as BlockNoteTheme,
  useCreateBlockNote,
} from '@blocknote/react';

import '@blocknote/react/style.css';
import { useEffect } from 'react';
import './Editor.css';
type Props = {
  description: string;
  setNewDescription: React.Dispatch<React.SetStateAction<string>>;
};
const lightTheme = {
  colors: {
    editor: {
      text: '#d7d7d7',
      background: 'transparent',
    },
    menu: {
      text: '#ffffff',
      background: '#131818',
    },
    tooltip: {
      text: '#ffffff',
      background: '#131818',
    },
    hovered: {
      text: '#ffffff',
      background: '#131818',
    },
    selected: {
      text: '#ffffff',
      background: '#202222cf',
    },
    disabled: {
      text: 'grey',
      background: '#202222cf',
    },
    shadow: '#000000',
    border: '#1d2020cf',
    sideMenu: '#bababa',
    highlights: lightDefaultTheme.colors!.highlights,
  },
  borderRadius: 4,
  fontFamily: 'Inter, sans-serif',
} satisfies BlockNoteTheme;

const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    editor: {
      text: '#d7d7d7',
      background: 'transparent',
    },
    sideMenu: '#ffffff',
    highlights: darkDefaultTheme.colors!.highlights,
  },
} satisfies BlockNoteTheme;

const editorTheme = {
  light: lightTheme,
  dark: darkTheme,
};

const Editor = ({ description, setNewDescription }: Props) => {
  const editor = useCreateBlockNote();
  useEffect(() => {
    const fetchData = async () => {
      const blocks = await editor.tryParseHTMLToBlocks(description);
      editor.replaceBlocks(editor.document, blocks);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  const onChange = async () => {
    const html = await editor.blocksToHTMLLossy(editor.document);
    setNewDescription(html);
  };

  return (
    <BlockNoteView editor={editor} theme={editorTheme} onChange={onChange} data-theming-css-demo />
  );
};

export default Editor;
