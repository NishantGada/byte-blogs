import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import {
  Box,
  ButtonGroup,
  Flex,
  IconButton,
  Select,
  Tooltip,
} from '@chakra-ui/react';
import type { ReactElement } from 'react';
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaFileCode,
  FaLink,
  FaImage,
  FaUndo,
  FaRedo,
} from 'react-icons/fa';
import './BlogEditor.css';

const lowlight = createLowlight(common);

const CODE_LANGUAGES = [
  'plaintext',
  'bash',
  'css',
  'html',
  'java',
  'javascript',
  'json',
  'markdown',
  'python',
  'rust',
  'sql',
  'typescript',
  'yaml',
];

interface BlogEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const BlogEditor = ({ value, onChange, placeholder }: BlogEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image,
      Placeholder.configure({
        placeholder: placeholder ?? 'Write your blog content...',
      }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <Box
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="md"
      overflow="hidden"
      w="full"
      bg="bg.surface"
    >
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </Box>
  );
};

interface ToolbarProps {
  editor: Editor;
}

const Toolbar = ({ editor }: ToolbarProps) => {
  const handleLink = () => {
    const previous = editor.getAttributes('link').href ?? '';
    const url = window.prompt('Enter URL (leave empty to remove link)', previous);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleImage = () => {
    const url = window.prompt('Enter image URL');
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const isCodeBlock = editor.isActive('codeBlock');
  const currentLang = (editor.getAttributes('codeBlock').language as string) || 'plaintext';

  const btn = (
    label: string,
    icon: ReactElement,
    onClick: () => void,
    active = false,
    disabled = false,
  ) => (
    <Tooltip label={label} hasArrow openDelay={300} key={label}>
      <IconButton
        aria-label={label}
        icon={icon}
        onClick={onClick}
        isActive={active}
        isDisabled={disabled}
        size="sm"
        variant="ghost"
      />
    </Tooltip>
  );

  const headingBtn = (level: 1 | 2 | 3) => (
    <Tooltip label={`Heading ${level}`} hasArrow openDelay={300} key={`h${level}`}>
      <IconButton
        aria-label={`Heading ${level}`}
        icon={<span style={{ fontWeight: 700, fontSize: '0.75rem' }}>H{level}</span>}
        onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
        isActive={editor.isActive('heading', { level })}
        size="sm"
        variant="ghost"
      />
    </Tooltip>
  );

  return (
    <Flex
      borderBottomWidth="1px"
      borderColor="border.default"
      p={2}
      gap={2}
      flexWrap="wrap"
      align="center"
      bg="bg.muted"
    >
      <ButtonGroup size="sm" spacing={0}>
        {btn('Bold', <FaBold />, () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
        {btn('Italic', <FaItalic />, () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
        {btn('Strikethrough', <FaStrikethrough />, () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'))}
      </ButtonGroup>

      <ButtonGroup size="sm" spacing={0}>
        {headingBtn(1)}
        {headingBtn(2)}
        {headingBtn(3)}
      </ButtonGroup>

      <ButtonGroup size="sm" spacing={0}>
        {btn('Bullet list', <FaListUl />, () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
        {btn('Numbered list', <FaListOl />, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
        {btn('Blockquote', <FaQuoteLeft />, () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'))}
      </ButtonGroup>

      <ButtonGroup size="sm" spacing={0}>
        {btn('Inline code', <FaCode />, () => editor.chain().focus().toggleCode().run(), editor.isActive('code'))}
        {btn('Code block', <FaFileCode />, () => editor.chain().focus().toggleCodeBlock().run(), isCodeBlock)}
      </ButtonGroup>

      {isCodeBlock && (
        <Select
          size="sm"
          maxW="140px"
          value={currentLang}
          onChange={(e) =>
            editor.chain().focus().updateAttributes('codeBlock', { language: e.target.value }).run()
          }
        >
          {CODE_LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
      )}

      <ButtonGroup size="sm" spacing={0}>
        {btn('Insert link', <FaLink />, handleLink, editor.isActive('link'))}
        {btn('Insert image', <FaImage />, handleImage)}
      </ButtonGroup>

      <ButtonGroup size="sm" spacing={0}>
        {btn('Undo', <FaUndo />, () => editor.chain().focus().undo().run(), false, !editor.can().undo())}
        {btn('Redo', <FaRedo />, () => editor.chain().focus().redo().run(), false, !editor.can().redo())}
      </ButtonGroup>
    </Flex>
  );
};

export default BlogEditor;
