import Image from "next/image";
import React from "react";
import { CiImageOff } from "react-icons/ci";

interface PolaroidProps {
  imageSrc?: string;
  imageAlt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  imgRatio?: number;
  children?: React.ReactNode;
}

const Polaroid = ({
  imageSrc,
  imageAlt = "Untitled",
  width = 200,
  height = 280,
  fill = false,
  imgRatio = 0.7,
  children,
}: PolaroidProps) => {
  return (
    <div
      className="group/polaroid relative overflow-hidden rounded-xl border border-border duration-300"
      style={{
        width: fill ? "100%" : `${width}px`,
        height: fill ? "100%" : `${height}px`,
      }}
    >
      <div
        className="relative w-full overflow-hidden bg-gray-100"
        style={{ height: `${height * imgRatio}px` }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover/polaroid:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bg-secondary text-text-secondary transition-transform duration-300 group-hover/polaroid:scale-110">
            <CiImageOff />
          </div>
        )}
      </div>

      <div
        className="bg-bg-tertiary transition-colors group-hover/polaroid:bg-bg-primary"
        style={{ height: `${height * (1 - imgRatio)}px` }}
      >
        {children}
      </div>
    </div>
  );
};

export default Polaroid;
