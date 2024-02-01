import React from "react";
import Image from "next/image";

interface CardsProps {
  src: string;
  alt: string;
}

const Cards: React.FC<CardsProps> = ({ src, alt }) => {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-white">
      <Image
        className="h-full w-full rounded-t-3xl object-cover"
        src={src}
        alt={alt}
        width={100}
        height={100}
      />
      <p className="absolute bottom-0 w-full bg-white p-5 font-assistant">
        Song Name
      </p>
    </div>
  );
};

const Gallery = () => {
  return (
    <>
      <Cards src="https://via.placeholder.com/300" alt="songs" />
      <Cards src="https://via.placeholder.com/300" alt="songs" />
      <Cards src="https://via.placeholder.com/300" alt="songs" />
      <Cards src="https://via.placeholder.com/300" alt="songs" />
      <Cards src="https://via.placeholder.com/300" alt="songs" />
      <Cards src="https://via.placeholder.com/300" alt="songs" />
      <Cards src="https://via.placeholder.com/300" alt="songs" />
      <Cards src="https://via.placeholder.com/300" alt="songs" />
      <Cards src="https://via.placeholder.com/300" alt="songs" />
      <Cards src="https://via.placeholder.com/300" alt="songs" />
      <Cards src="https://via.placeholder.com/300" alt="songs" />
      <Cards src="https://via.placeholder.com/300" alt="songs" />
    </>
  );
};

export default Gallery;
