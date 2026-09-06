"use client";

import { useEffect, type ReactNode } from "react";
import { useEditor, EditorContent, type Editor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle, FontFamily, FontSize } from "@tiptap/extension-text-style";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Highlighter,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FONT_FAMILIES = [
  { label: "Police par défaut", value: "" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Mono", value: "var(--font-mono)" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Trebuchet", value: "'Trebuchet MS', sans-serif" },
];

const FONT_SIZES = [
  { label: "Petit", value: "12px" },
  { label: "Normal", value: "" },
  { label: "Moyen", value: "18px" },
  { label: "Grand", value: "24px" },
  { label: "Très grand", value: "32px" },
];

const EMPTY_DOC: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

export function RichEditor({
  content,
  onChange,
}: {
  content: JSONContent;
  onChange: (json: JSONContent) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Highlight,
      TextStyle,
      FontFamily,
      FontSize,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: "Écris ton cours ici…" }),
    ],
    content: content && Object.keys(content).length > 0 ? content : EMPTY_DOC,
    editorProps: {
      attributes: {
        class: "tiptap-content min-h-[55vh] px-1 text-sm text-foreground",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });

  // Swap content when the caller switches to a different note.
  useEffect(() => {
    if (!editor) return;
    const next = content && Object.keys(content).length > 0 ? content : EMPTY_DOC;
    if (JSON.stringify(editor.getJSON()) === JSON.stringify(next)) return;
    editor.commands.setContent(next, { emitUpdate: false });
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-3">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-muted",
        active && "bg-accent text-accent-foreground"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-0.5 h-5 w-px shrink-0 bg-border/60" />;
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="glass shadow-soft sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-2xl p-1.5">
      <select
        onChange={(e) => {
          const v = e.target.value;
          if (v) editor.chain().focus().setFontFamily(v).run();
          else editor.chain().focus().unsetFontFamily().run();
        }}
        className="h-7 shrink-0 rounded-lg border border-border/60 bg-transparent px-1.5 text-xs text-foreground outline-none"
        defaultValue=""
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.label} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => {
          const v = e.target.value;
          if (v) editor.chain().focus().setFontSize(v).run();
          else editor.chain().focus().unsetFontSize().run();
        }}
        className="h-7 shrink-0 rounded-lg border border-border/60 bg-transparent px-1.5 text-xs text-foreground outline-none"
        defaultValue=""
      >
        {FONT_SIZES.map((f) => (
          <option key={f.label} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <Divider />

      <ToolbarButton
        title="Titre 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Titre 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Titre 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="size-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        title="Gras"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Italique"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Souligner"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Barrer"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Surligner"
        active={editor.isActive("highlight")}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="size-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        title="Liste à puces"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Liste numérotée"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Cases à cocher"
        active={editor.isActive("taskList")}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      >
        <CheckSquare className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Citation"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="Annuler" onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton title="Rétablir" onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="size-4" />
      </ToolbarButton>
    </div>
  );
}
