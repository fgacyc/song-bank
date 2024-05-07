import React from "react";

interface BlockProps {
  title?: string;
  children: React.ReactNode;
}

const Block: React.FC<BlockProps> = ({ title, children }) => {
  return (
    <div className={"m-2"}>
      {title && <div className={"px-2 pb-1 pt-2 text-gray-400"}>{title}</div>}
      <div className={"flex flex-col rounded-lg bg-white p-3"}>{children}</div>
    </div>
  );
};

export default Block;
