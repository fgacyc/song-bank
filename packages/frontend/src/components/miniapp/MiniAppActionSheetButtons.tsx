import { GoKebabHorizontal, GoX } from "react-icons/go";
import { useActionSheetMenuStore } from "@/store/action-sheet-menu-store";

export default function ActionSheetButtons() {
  const [showMenu, setShowMenu] = useActionSheetMenuStore((state) => [
    state.showMenu,
    state.setShowMenu,
  ]);

  function switchMenu() {
    setShowMenu(!showMenu);
  }

  function handleClose() {
    window.open("https://back.fgacyc.com/", "_self");
  }

  return (
    <div
      className={`absolute right-2 top-2 flex w-[80px] flex-row 
                justify-around rounded-full border border-gray-200 
                bg-white p-1 shadow-sm md:hidden  ${!showMenu && "z-10"}
                `}
    >
      <GoKebabHorizontal
        className={"h-[20px] w-[20px] cursor-pointer"}
        onClick={switchMenu}
      />
      <GoX
        className={"h-[20px] w-[20px] cursor-pointer"}
        onClick={handleClose}
      />
    </div>
  );
}
