const CHORD_REGEX =
  /\[([A-G][b#]?(?:m|maj|dim|aug|sus[24]|\d)?(?:\/[A-G][b#]?)?)\]/g;
const DASH_REGEX = /_/g;

export function parseChords(text: string): string {
  // First replace chords
  const withChords = text.replace(CHORD_REGEX, (match, chord) => {
    return `<span class="chord"><span class="inner"><i class="name">${chord}</i></span></span>`;
  });

  // Then replace dashes with spaces (3 spaces per dash)
  return withChords.replace(DASH_REGEX, "&nbsp;&nbsp;&nbsp;");
}
