export const adjustSaturation = (hex: string, percentage: number) => {
  // Remove the hash (#) character if present
  hex = hex.replace(/^#/, "");

  // Parse the hex string into separate R, G, B components
  const bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  // Convert RGB to HSL
  const rRatio = r / 255;
  const gRatio = g / 255;
  const bRatio = b / 255;
  const max = Math.max(rRatio, gRatio, bRatio);
  const min = Math.min(rRatio, gRatio, bRatio);
  const lightness = (max + min) / 2;
  let saturation;
  let delta = 0;

  if (max === min) {
    saturation = 0; // achromatic
  } else {
    delta = max - min;
    saturation =
      lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  }

  // Adjust the saturation
  saturation *= 1 - percentage / 100;

  // Convert HSL back to RGB
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const hue =
    60 *
    (max === rRatio
      ? ((gRatio - bRatio) / delta + 6) % 6
      : max === gRatio
        ? (bRatio - rRatio) / delta + 2
        : (rRatio - gRatio) / delta + 4);

  r = Math.round(
    (chroma * Math.cos(((hue % 360) * Math.PI) / 180) +
      lightness -
      chroma / 2) *
      255,
  );
  g = Math.round(
    (chroma * Math.cos(((hue % 360) * Math.PI) / 180 - (2 * Math.PI) / 3) +
      lightness -
      chroma / 2) *
      255,
  );
  b = Math.round(
    (chroma * Math.cos(((hue % 360) * Math.PI) / 180 + (2 * Math.PI) / 3) +
      lightness -
      chroma / 2) *
      255,
  );

  const a = 0.6;

  // Create and return the adjusted color
  return "rgba(" + r + ", " + g + ", " + b + "," + a + ")";
};

export const stringToColor = (seed: string) => {
  // Convert the string to a numerical value
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate a hex color code
  const color = (hash & 0x00ffffff).toString(16).toUpperCase();

  // Pad the color code with zeros if needed
  return "#" + "00000".substring(0, 6 - color.length) + color;
};

export const getContrastTextColor = (hexColor: string) => {
  // Convert hex color to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Choose text color based on luminance
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};
