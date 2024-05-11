export default function Custom404() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={"/img/page-not-found.svg"}
        alt="page not found"
        width={200}
        height={200}
      />
      <h1 className="text-sm text-neutral-500">Page not found.</h1>
    </div>
  );
}
