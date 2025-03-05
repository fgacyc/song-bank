import config from "../../../package.json";
import {
  GoCommentDiscussion,
  GoGear,
  GoInfo,
  GoPerson,
  GoShareAndroid,
  GoTrash,
} from "react-icons/go";
import { IoRefreshSharp } from "react-icons/io5";
import { useActionSheetMenuStore } from "@/store/action-sheet-menu-store";
import { type ReactNode } from "react";

interface ActionSheetButtonProps {
  title: string;
  icon: ReactNode;
  onClick: () => void;
}

const ActionSheetButton: React.FC<ActionSheetButtonProps> = ({
  title,
  icon,
  onClick,
}) => {
  return (
    <div className={"flex flex-col items-center"}>
      <button
        className={
          "flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-100"
        }
        onClick={onClick}
      >
        {icon}
      </button>
      <div className={"mt-1 text-xs text-gray-500"}>{title}</div>
    </div>
  );
};

interface ButtonData {
  title: string;
  icon: ReactNode;
  onClick?: () => void | Window | null;
}

export default function ActionSheetMenu() {
  const [showMenu, setShowMenu] = useActionSheetMenuStore((state) => [
    state.showMenu,
    state.setShowMenu,
  ]);
  const buttonStyle = "w-[28px] h-[28px]";

  function copyToClipboard() {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        console.log("Copied to clipboard");
      })
      .catch((reason) => {
        console.error("Failed to copy to clipboard", reason);
      });
  }

  const buttonsData: ButtonData[] = [
    // {
    //     title: "Favorite",
    //     icon: <GoHeart className={buttonStyle}/>
    // },
    {
      title: "Feedback",
      icon: <GoCommentDiscussion className={buttonStyle} />,
    },
    {
      title: "Re-enter",
      icon: <IoRefreshSharp className={buttonStyle} />,
      onClick: () => window.location.reload(),
    },
    {
      title: "Clean Cache",
      icon: <GoTrash className={buttonStyle} />,
      onClick: () => {
        localStorage.clear();
        window.location.reload();
      },
    },
    {
      title: "Settings",
      icon: <GoGear className={buttonStyle} />,
      onClick: () => window.open("/settings", "_self"),
    },
    {
      title: "Profile",
      icon: <GoPerson className={buttonStyle} />,
      onClick: () => window.open("https://account-steel.vercel.app/", "_self"),
    },
    {
      title: "About",
      icon: <GoInfo className={buttonStyle} />,
      onClick: () => window.open("/about", "_self"),
    },
    {
      title: "Share",
      icon: config.shared ? (
        <GoShareAndroid className={buttonStyle} />
      ) : (
        <GoShareAndroid className={`${buttonStyle} text-gray-300`} />
      ),
      // @ts-expect-error this a different type of onClick
      onClick: !config.shared ? null : copyToClipboard,
    },
  ];

  return (
    <div>
      <div
        className={`absolute top-0 h-screen w-screen  transition duration-300 ease-in-out
            ${showMenu ? "z-10 bg-[#00000030]" : "-z-10 bg-[#00000000]"}`}
        onClick={() => setShowMenu(false)}
      ></div>
      <div
        className={`absolute bottom-0 z-20 w-full  duration-300   ease-in-out
            ${
              showMenu
                ? "translate-y-0 transition-transform"
                : "translate-y-full transition-transform"
            }`}
      >
        <div
          className={`flex flex-col rounded-t-3xl border bg-white shadow-lg`}
        >
          <div className={"border-b p-3 text-center "}>MiniApp Framework</div>
          <div className={"grid w-full grid-cols-4 gap-2 p-4"}>
            {buttonsData.map((button, index) => (
              <ActionSheetButton
                key={index}
                title={button.title}
                icon={button.icon}
                onClick={button.onClick ?? (() => console.log("NO FUNC"))} // Provide a default handler if onClick is undefined
              />
            ))}
          </div>
          <div
            className={"cursor-pointer border-t p-3 text-center"}
            onClick={() => setShowMenu(false)}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
}
