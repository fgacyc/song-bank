/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import config from "../../package.json";
import { GoChevronRight } from "react-icons/go";
import Block from "@/components/miniapp/MiniAppBlock";
import NavBar from "@/components/miniapp/MiniAppNavBar";
import ActionSheetButtons from "@/components/miniapp/MiniAppActionSheetButtons";
import ActionSheetMenu from "@/components/miniapp/MiniAppActionSheetMenu";
import Image from "next/image";

export default function About() {
  return (
    <div className={"h-screen"}>
      <ActionSheetButtons />
      <NavBar>About</NavBar>
      <div className={"mb-2 flex flex-col items-center bg-white p-8"}>
        <Image src="/img/logo.png" alt="app logo" width={64} height={64} />
        <h1 className={"mt-4 text-center text-xl text-black"}>
          MiniApp Framework
        </h1>
      </div>

      <Block title={undefined}>
        <div className={"flex items-center justify-between"}>
          <div>Version: V{config.version}</div>
          <div className={"rounded bg-gray-100 px-1 py-[1px] text-gray-600"}>
            Latest Version
          </div>
        </div>
      </Block>

      <Block title={undefined}>
        <div className={"flex items-center justify-between"}>
          <div>Developer: {config.author}</div>
          <div className={"flex"}>
            {config.instagram && (
              <a href={config.instagram} className={"px-2"} target="_blank">
                <Image
                  src={"/img/instagram.png"}
                  alt="instagram"
                  width={24}
                  height={24}
                />
              </a>
            )}
            {config.github && (
              <a href={config.github} target="_blank">
                <Image
                  src={"/img/github.png"}
                  alt="github"
                  width={24}
                  height={24}
                />
              </a>
            )}
          </div>
        </div>
      </Block>

      <Block title={undefined}>
        <div className={"flex flex-row items-center justify-between  pb-2"}>
          <div>Terms of Service</div>
          <GoChevronRight className={"h-[18px] w-[18px]"} />
        </div>
        <hr />
        <div className={"flex flex-row items-center justify-between pt-2"}>
          <div>Privacy Policy</div>
          <GoChevronRight className={"h-[18px] w-[18px]"} />
        </div>
      </Block>
      <ActionSheetMenu />
    </div>
  );
}
