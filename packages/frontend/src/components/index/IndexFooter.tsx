import React from "react";
import Link from "next/link";

const leftIndexFooterData = [
  { link: "/", text: "About" },
  //   { link: "/", text: "" },
];

const rightIndexFooterData = [
  { link: "/", text: "Language" },
  { link: "/", text: "Privacy" },
];

const IndexFooter = () => {
  return (
    <div className="fixed bottom-0 flex h-12 w-full items-center justify-between border px-3">
      <div className="flex gap-3 text-xs text-neutral-500">
        {leftIndexFooterData.map((item, i) => (
          <Link key={i} href={item.link} className="hover:text-neutral-400">
            {item.text}
          </Link>
        ))}
      </div>
      <div className="flex gap-3 text-xs text-neutral-500">
        {rightIndexFooterData.map((item, i) => (
          <Link key={i} href={item.link} className="hover:text-neutral-400">
            {item.text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default IndexFooter;
