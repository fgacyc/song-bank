/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Node, mergeAttributes } from "@tiptap/core";

export const SongTitle = Node.create({
  name: "songTitle",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      {
        tag: 'h3[data-type="title"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "h3",
      mergeAttributes(HTMLAttributes, {
        "data-type": "title",
        class: "song-title",
      }),
      0,
    ];
  },
});

export const SongLyrics = Node.create({
  name: "songLyrics",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      {
        tag: 'p[data-type="lyrics"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        "data-type": "lyrics",
        class: "song-lyrics",
      }),
      0,
    ];
  },
});

export const SongChords = Node.create({
  name: "songChords",
  group: "block",
  content: "inline*",

  parseHTML() {
    return [
      {
        tag: 'p[data-type="chords"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        "data-type": "chords",
        class: "song-chords",
      }),
      0,
    ];
  },
});
