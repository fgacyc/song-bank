export default function Custom500() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={"/img/server-down.svg"}
        alt="page not found"
        width={200}
        height={200}
      />
      <h1 className="text-sm text-neutral-500">Server-side error.</h1>
    </div>
  );
}
