/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { SelectField } from "@/components/Inputs/Select";
import { TextAreaField, TextField } from "@/components/Inputs/Text";
import markdownit from "markdown-it";
// @ts-expect-error no declaration file
import chords from "markdown-it-chords";
import Head from "next/head";
import { useState } from "react";

const md = markdownit({
  breaks: true,
});

md.use(chords);

export default function Home() {
  const [chords, setChords] = useState(``);
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="flex min-h-screen flex-col items-center"
        data-theme="night"
      >
        <div className="container flex max-w-[300px] flex-col items-center gap-5 px-4 py-16 sm:max-w-[500px] md:max-w-[600px]">
          <div className="flex flex-col items-center">
            <h1 className="text-center text-5xl font-extrabold tracking-tight text-primary sm:text-[2.5rem]">
              CYC Worship
            </h1>
            <p className="pt-2 text-center text-5xl font-extrabold tracking-tight text-white sm:text-[2.0rem]">
              Song Bank Submission
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-x-4 gap-y-2 pt-5 sm:grid-cols-2 md:gap-x-8 md:gap-y-4">
            <TextField name="Song Name" required />
            <TextField name="Alternate Name" />
            <SelectField
              required
              name="Song Language"
              options={[
                "BM",
                "CHI",
                "EN",
                "BM + CHI",
                "BM + EN",
                "CHI + EN",
                "BM + CHI + EN",
              ]}
            />
            <TextField name="Original Key" required />
            <TextField
              name="Original Video URL"
              hint="Original Youtube Video Link"
            />
            <TextField name="Original Worship Band" required />
          </div>
          <TextAreaField
            name="Chords / Lyrics"
            required
            placeholder={`[Chorus]\nNever gonna [F]give you [G]up\nNever gonna [Em]let you [Am]down\nNever gonna [F]run [G]around and [E]desert [Am]you`}
            hint="Wrap chords in location with [ ] brackets"
            onChange={(e) => setChords(e.currentTarget.value)}
          />

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Preview</span>
            </div>
            <div className="h-100 card w-full">
              <div
                className="card-body card-bordered max-h-[25vh] w-full overflow-auto rounded-md border-warning"
                dangerouslySetInnerHTML={{
                  __html: md.render(
                    chords ||
                      `[Chorus]\nNever gonna [F]give you [G]up\nNever gonna [Em]let you [Am]down\nNever gonna [F]run [G]around and [E]desert [Am]you`,
                  ),
                }}
              />
            </div>
          </label>
          <div className="flex w-full flex-row justify-center gap-5">
            <button className="btn btn-success flex-grow">Submit</button>
            <button className="btn btn-outline btn-secondary">Reset</button>
          </div>
        </div>
      </main>
    </>
  );
}
