"use client";

import React, { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { SongFormState } from "../types";
import Button from "@/features/shared/components/ui/Button";
import { SongTitle, SongLyrics, SongChords } from "../lib/SongTextboxNode";

interface SongTextboxProps {
  formData: SongFormState;
  onFormDataChange: React.Dispatch<React.SetStateAction<SongFormState>>;
}

const SongTextbox = ({ formData, onFormDataChange }: SongTextboxProps) => {
  const getActiveStyle = (editor: Editor | null) => {
    if (!editor) return "lyrics";
    if (editor.isActive("songTitle")) return "title";
    if (editor.isActive("songChords")) return "chords";
    if (editor.isActive("songLyrics")) return "lyrics";

    return "lyrics";
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      SongTitle,
      SongLyrics,
      SongChords,
    ],
    content: formData.lyrics || "",
    immediatelyRender: false,
    parseOptions: {
      preserveWhitespace: "full",
    },
    onUpdate: ({ editor }) => {
      onFormDataChange((prev) => ({
        ...prev,
        lyrics: editor.getHTML(),
      }));
    },

    onSelectionUpdate: ({ editor }) => {
      setActiveBtn(getActiveStyle(editor));
    },
  });

  const [activeBtn, setActiveBtn] = useState<string>("lyrics");

  if (!editor) return null;

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-text-primary">
        Lyrics/Chords <span className="text-destructive">*</span>
      </label>

      <div className="space-y-2">
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            size="xs"
            className={activeBtn === "lyrics" ? "bg-gray-200" : ""}
            onClick={() => {
              editor.chain().focus().setNode("songLyrics").run();
              setActiveBtn("lyrics");
            }}
          >
            Lyrics
          </Button>

          <Button
            type="button"
            variant="outline"
            size="xs"
            className={activeBtn === "title" ? "bg-gray-200" : ""}
            onClick={() => {
              editor.chain().focus().setNode("songTitle").run();
              setActiveBtn("title");
            }}
          >
            Title
          </Button>

          <Button
            type="button"
            variant="outline"
            size="xs"
            className={activeBtn === "chords" ? "bg-gray-200" : ""}
            onClick={() => {
              editor.chain().focus().setNode("songChords").run();
              setActiveBtn("chords");
            }}
          >
            Chords
          </Button>
        </div>

        <EditorContent
          editor={editor}
          className="rounded-xl border px-3 py-2 text-[0.875rem] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
};

export default SongTextbox;
