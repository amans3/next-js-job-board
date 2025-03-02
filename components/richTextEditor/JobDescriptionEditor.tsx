"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";


interface JobDescriptionEditorProps {
  field: any;
}

export function JobDescriptionEditor({ field }: JobDescriptionEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 max-w-none focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : ""
  });

    // Update editor content when form value changes externally
    useEffect(() => {
        if (editor && field.value && editor.getHTML() !== field.value) {
          editor.commands.setContent(JSON.parse(field.value));
        }
      }, [editor, field.value]);

  return (
    <div className="w-full border rounded-lg overflow-hidden bg-card">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
