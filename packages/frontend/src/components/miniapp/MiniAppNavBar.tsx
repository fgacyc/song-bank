import type { PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
export default function NavBar({ children }: PropsWithChildren<object>) {
  const router: AppRouterInstance = useRouter();

  return (
    <>
      <div
        className={"flex h-[45px] items-center justify-between bg-white px-3"}
      >
        <div onClick={() => router.back()} className={"cursor-pointer"}>
          <BsChevronLeft className={"h-6 w-6"} />
        </div>
        <div className={"text-lg"}>{children}</div>
        <div className={"h-6 w-6"}></div>
      </div>
    </>
  );
}
