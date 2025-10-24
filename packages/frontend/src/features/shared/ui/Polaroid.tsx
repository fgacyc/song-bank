import Image from "next/image";
import React from "react";

interface PolaroidProps {
  imageSrc?: string;
  title?: string;
  captions?: string[];
  width?: number;
  height?: number;
  imgRatio?: number;
  descriptionAlignment?:
    | "topLeft"
    | "top"
    | "topRight"
    | "left"
    | "center"
    | "right"
    | "bottomLeft"
    | "bottom"
    | "bottomRight";
}

const Polaroid = ({
  imageSrc = "/carousel-2.jpg",
  title,
  captions,
  width = 200,
  height = 280,
  imgRatio = 0.7,
  descriptionAlignment = "center",
}: PolaroidProps) => {
  const textAlignment = {
    topLeft: "items-start justify-start text-start",
    top: "items-center justify-start text-center",
    topRight: "items-end justify-start text-end",
    left: "items-start justify-center text-start",
    center: "items-center justify-center text-center",
    right: "items-end justify-center text-end",
    bottomLeft: "items-start justify-end text-start",
    bottom: "items-center justify-end text-center",
    bottomRight: "items-end justify-end text-end",
  }[descriptionAlignment];

  return (
    <div
      className="group/polaroid relative overflow-hidden rounded-xl border border-border duration-300"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div
        className="relative w-full overflow-hidden bg-gray-100"
        style={{ height: `${height * imgRatio}px` }}
      >
        <Image
          src={imageSrc}
          alt={title ?? "Untitled"}
          fill
          className="object-cover transition-transform duration-300 group-hover/polaroid:scale-110"
        />
      </div>

      <div
        className={`flex flex-col bg-bg-tertiary p-6 transition-colors group-hover/polaroid:bg-bg-primary ${textAlignment}`}
        style={{ height: `${height * (1 - imgRatio)}px` }}
      >
        <div className="h-3/4 w-3/4">
          <h3 className="mb-1 truncate text-text-primary">
            {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
            {title || "Untitled"}
          </h3>
          {captions?.map((caption, index) => (
            <p
              key={index}
              className="truncate pb-2 text-sm text-text-secondary"
            >
              {caption}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Polaroid;
