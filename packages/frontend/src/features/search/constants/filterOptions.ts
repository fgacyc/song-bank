import type { FilterOption } from "../types";

export const LANGUAGE_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Languages" },
  { value: "en", label: "English" },
  { value: "cn", label: "Chinese" },
  { value: "bm", label: "Bahasa Melayu" },
];

export const KEY_SIGNATURE_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Keys" },
  { value: ["C", "Am"], label: "C" },
  { value: ["C#", "Db", "A#m", "Bbm"], label: "C♯/D♭" },
  { value: ["D", "Bm"], label: "D" },
  { value: ["D#", "Eb", "Cm"], label: "D♯/E♭" },
  { value: ["E", "C#m", "Dbm"], label: "E" },
  { value: ["F", "Dm"], label: "F" },
  { value: ["F#", "Gb", "D#m", "Ebm"], label: "F♯/G♭" },
  { value: ["G", "Em"], label: "G" },
  { value: ["G#", "Ab", "Fm"], label: "G♯/A♭" },
  { value: ["A", "F#m", "Gbm"], label: "A" },
  { value: ["A#", "Bb", "Gm"], label: "A♯/B♭" },
  { value: ["B", "G#m", "Abm"], label: "B" },
];
