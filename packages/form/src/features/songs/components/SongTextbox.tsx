"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { SongFormState } from "../types";
import Button from "@/features/shared/components/ui/Button";
import { SongTitle, SongLyrics, SongChords } from "../lib/SongTextboxNode";

interface SongTextboxProps {
  formData: SongFormState;
  onFormDataChange: React.Dispatch<React.SetStateAction<SongFormState>>;
}

const SongTextbox = ({ formData, onFormDataChange }: SongTextboxProps) => {
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
    onUpdate: ({ editor }) => {
      onFormDataChange((prev) => ({
        ...prev,
        lyrics: editor.getHTML(),
      }));
      console.log("Updated lyrics:", editor.getHTML());
    },
  });

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
            className=""
            onClick={() => {
              editor.chain().focus().setNode("songLyrics").run();
            }}
          >
            Lyrics
          </Button>

          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => {
              editor.chain().focus().setNode("songTitle").run();
            }}
          >
            Title
          </Button>

          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => {
              editor.chain().focus().setNode("songChords").run();
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
