import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoPerson, IoPersonOutline } from "react-icons/io5";
import { RiHomeFill, RiHomeLine } from "react-icons/ri";

const Footer = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  return (
    <div className="fixed bottom-0 flex h-[50px] w-full items-center justify-evenly border bg-white sm:hidden">
      <Link href="/" className="p-1">
        {router.pathname === "/" ? <RiHomeFill /> : <RiHomeLine />}
      </Link>
      <Link
        href={`${!isLoading && user ? "/profile" : "/api/auth/login"}`}
        className="p-1"
      >
        {router.pathname === "/profile" ? <IoPerson /> : <IoPersonOutline />}
      </Link>
    </div>
  );
};

export default Footer;
