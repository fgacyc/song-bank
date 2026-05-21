import Image from "next/image";
import React from "react";
import { CiImageOff } from "react-icons/ci";

interface PolaroidProps {
  imageSrc?: string | null;
  imageAlt?: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  imageHeight?: number | string;
  imgRatio?: number;
  children?: React.ReactNode;
  className?: string;
  imageContainerClassName?: string;
  imageClassName?: string;
  contentClassName?: string;
  style?: React.CSSProperties;
}

const toSize = (value: number | string) =>
  typeof value === "number" ? `${value}px` : value;

const Polaroid = ({
  imageSrc,
  imageAlt = "Untitled",
  width = 220,
  height = 300,
  fill = false,
  imageHeight,
  imgRatio = 0.68,
  children,
  className = "",
  imageContainerClassName = "",
  imageClassName = "",
  contentClassName = "",
  style,
}: PolaroidProps) => {
  const rootStyle: React.CSSProperties = {
    width: fill ? "100%" : toSize(width),
    height: fill ? "100%" : toSize(height),
    ...style,
  };

  const imagePanelStyle: React.CSSProperties = fill
    ? imageHeight !== undefined
      ? { height: toSize(imageHeight), flexShrink: 0 }
      : { flexShrink: 0 }
    : { height: `${Number(height) * imgRatio}px` };

  const contentPanelStyle: React.CSSProperties = fill
    ? { flexGrow: 1 }
    : { height: `${Number(height) * (1 - imgRatio)}px` };

  return (
    <div
      className={`group/polaroid relative overflow-hidden rounded-2xl border border-border/70 bg-bg-primary transition-all duration-300 hover:-translate-y-1 ${className}`.trim()}
      style={rootStyle}
    >
      <div
        className={`relative flex w-full items-center justify-center overflow-hidden bg-transparent ${imageContainerClassName}`.trim()}
        style={imagePanelStyle}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={`object-cover transition-transform duration-300 group-hover/polaroid:scale-110 ${imageClassName}`.trim()}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-transparent ${imageClassName}`.trim()}
          >
            <CiImageOff className="h-7 w-7" />
          </div>
        )}
      </div>

      <div
        className={`h-full bg-bg-primary px-4 py-4 ${contentClassName}`.trim()}
        style={contentPanelStyle}
      >
        {children}
      </div>
    </div>
  );
};

export default Polaroid;
