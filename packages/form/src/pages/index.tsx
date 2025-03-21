/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SelectField, TagsField } from "@/components/Inputs/Select";
import {
  SearchField,
  TextAreaField,
  TextField,
  YoutubeField,
} from "@/components/Inputs/Text";
import markdownit from "markdown-it";
// @ts-expect-error no declaration file
import chords from "markdown-it-chords";
import Head from "next/head";
import { Field, Form, Formik, type FormikProps } from "formik";
import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FileInputField } from "@/components/Inputs/File";
import { useTags } from "@/hooks/fetchTags";
import { uploadFile } from "@/helpers/uploadFile";
import { useDebounce } from "@uidotdev/usehooks";
import { getContrastTextColor, stringToColor } from "@/helpers/hexToRGBA";
import { FaDownload } from "react-icons/fa";
import { parseChords } from "@/helpers/chordParser";

const md = markdownit({
  breaks: true,
  html: true, // Enable HTML parsing
});

// Process chords before markdown
const originalRender = md.render.bind(md);
md.render = (src: string) => {
  // First parse the chords
  const withChords = parseChords(src);
  // Then process with markdown
  const rendered = originalRender(withChords);
  return rendered;
};

export type FormikForm = {
  id?: string;
  songName: string;
  altName?: string;
  songLanguage: string;
  originalKey: string;
  originalBand: string;
  album?: string;
  originalYoutubeURL?: string;
  chordLyrics: string;
  mainKeyLink?: string;
  subKeyLink?: string;
  egLink?: string;
  agLink?: string;
  bassLink?: string;
  drumLink?: string;
  tags?: string[];
  sequencerFiles?: string[];
  subVoiceFile?: string;
};

const languageOptions = [
  "BM",
  "CHI",
  "EN",
  "BM + CHI",
  "BM + EN",
  "CHI + EN",
  "BM + CHI + EN",
];

export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [sequencerFile, setSequencerFile] = useState<FileList | undefined>();
  const [secVoiceFile, setSecVoiceFile] = useState<FileList | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const { tagOptions, fetchData } = useTags();
  const [searchedSongs, setSearchedSongs] = useState<
    { name: string; id: string }[]
  >([]);
  const [existingSeqLink, setExistingSeqLink] = useState("");
  const [existingSecVoiceLink, setExistingSecVoiceLink] = useState("");
  const [editingMode, setEditingMode] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const ref = useRef<FormikProps<FormikForm>>(null);

  useEffect(() => {
    if (!debouncedSearchTerm) return;
    setIsSearching(true);
    const searchSongs = async () => {
      await fetch(`/api/song?q=${debouncedSearchTerm}`, {
        method: "GET",
      }).then(
        async (res) =>
          await res.json().then((result: { name: string; id: string }[]) => {
            setSearchedSongs(result);
            setIsSearching(false);
          }),
      );
    };
    void searchSongs();
  }, [debouncedSearchTerm]);

  return (
    <>
      <Head>
        <title>Submission | CYC Song Bank</title>
        <meta name="description" content="Song Bank Submission Link" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="flex min-h-screen flex-col items-center"
        data-theme="night"
      >
        <dialog
          id="tagsModal"
          className="daisy-modal daisy-modal-bottom z-20 sm:daisy-modal-middle"
        >
          <div className="daisy-modal-box">
            <h1 className="text-xl">Create Tag</h1>
            <Formik<{ color: string; content: string }>
              initialValues={{ color: "#000000", content: "" }}
              onSubmit={async (values, action) => {
                const toastId = toast.loading("Creating tag...");
                try {
                  await fetch("/api/tag", {
                    method: "POST",
                    body: JSON.stringify(values),
                  }).then(async (res) => {
                    const data = await res.json();
                    if (res.ok) {
                      action.resetForm();
                      toast.update(toastId, {
                        type: "success",
                        render: () => `${data.content} Uploaded!`,
                        icon: () => "🎵",
                        isLoading: false,
                        // autoClose: 3000,
                      });
                    } else {
                      toast.update(toastId, {
                        type: "error",
                        render: () => {
                          return `Error: ${data.error}`;
                        },
                        icon: () => "🤯",
                        isLoading: false,
                        // autoClose: 4500,
                      });
                    }
                  });
                } catch (err) {
                  console.error(err);
                  toast.update(toastId, {
                    type: "error",
                    render: () => {
                      return `Error: ${String(err)}`;
                    },
                    icon: () => "🤯",
                    isLoading: false,
                    autoClose: 4500,
                  });
                } finally {
                  action.setSubmitting(false);
                  await fetchData();
                }
              }}
              validationSchema={Yup.object().shape({
                color: Yup.string().required("Required."),
                content: Yup.string().required("Required."),
              })}
            >
              {({ isSubmitting, values, errors }) => (
                <Form className="mt-5 flex w-full flex-row items-center gap-5">
                  <label className={`daisy-form-control`}>
                    <div className="daisy-label">
                      <span className="daisy-label-text">
                        Color{" "}
                        <span className="daisy-label-text-alt text-error">
                          *
                        </span>
                      </span>
                      <span className="daisy-label-text-alt"></span>
                    </div>
                    <div
                      className="daisy-input daisy-input-bordered daisy-input-primary max-h-[32px]"
                      style={{ background: values.color }}
                    />
                    <Field
                      name="color"
                      type="color"
                      disabled={isSubmitting || isSearching}
                      // placeholder="..."
                      className="invisible h-0 w-0"
                    />
                    {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}

                    <div className="daisy-label h-[32px]">
                      <span className="daisy-label-text flex w-full flex-row justify-between">
                        <span className="daisy-label-text-alt italic text-error">
                          {errors.color}
                        </span>
                        <span className="daisy-label-text-alt"></span>
                      </span>
                    </div>
                  </label>
                  <label className={`daisy-form-control`}>
                    <div className="daisy-label">
                      <span className="daisy-label-text">Content</span>
                      <span className="daisy-label-text-alt"></span>
                    </div>
                    <Field
                      name="content"
                      disabled={isSubmitting || isSearching}
                      // placeholder="..."
                      className="daisy-input daisy-input-sm daisy-input-bordered daisy-input-primary"
                    />
                    {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}

                    <div className="daisy-label h-[32px]">
                      <span className="daisy-label-text flex w-full flex-row justify-between">
                        <span className="daisy-label-text-alt italic text-error">
                          {errors.content}
                        </span>
                        <span className="daisy-label-text-alt"></span>
                      </span>
                    </div>
                  </label>
                  {isSubmitting ? (
                    <button className="daisy-btn daisy-btn-success daisy-btn-sm w-[120px] py-1">
                      <span className="daisy-loading daisy-loading-spinner"></span>
                      loading
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="daisy-btn daisy-btn-primary daisy-btn-sm w-[120px] py-1"
                    >
                      Submit
                    </button>
                  )}
                </Form>
              )}
            </Formik>
          </div>
          <form method="dialog" className="daisy-modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <div className="container flex max-w-[300px] flex-col items-center gap-5 px-4 py-16 sm:max-w-[500px] md:max-w-[600px]">
          <div className="flex flex-col items-center">
            <h1 className="text-center text-5xl font-extrabold tracking-tight text-primary sm:text-[2.5rem]">
              CYC Worship
            </h1>
            <p className="pt-2 text-center text-5xl font-extrabold tracking-tight text-white sm:text-[2.0rem]">
              Song Bank Submission
            </p>
          </div>
          {editingMode ? (
            <button
              className="daisy-btn daisy-btn-accent daisy-bordered fixed bottom-2 right-2"
              onClick={() => {
                if (confirm("⚠ Exit Editing Mode? Form will be resetted!")) {
                  setEditingMode(false);
                  setExistingSecVoiceLink("");
                  setExistingSeqLink("");
                  ref.current?.resetForm();
                }
              }}
            >
              Editing Mode
            </button>
          ) : null}
          <SearchField
            name="Search (by name, alternate name, album, band etc.)"
            hint="If already submitted"
            setIsSearching={setIsSearching}
            // isSearching={isSearching}
            setSearchTerm={setSearchTerm}
          />
          {searchedSongs.length > 0 && (
            <div className="flex h-[48px] max-h-[48px] w-full flex-row items-center gap-2 overflow-x-auto">
              {searchedSongs.map((song: { name: string; id: string }, i) => {
                const bgColor = stringToColor(song.name);
                const textColor = getContrastTextColor(bgColor);
                return (
                  <button
                    onClick={async () => {
                      setIsSearching(true);
                      await fetch(`/api/get-details?song=${song.id}`, {
                        method: "GET",
                      }).then(async (res) => {
                        await res.json().then(async (result) => {
                          setEditingMode(true);
                          setSecVoiceFile(undefined);
                          setSequencerFile(undefined);
                          console.log(result);
                          await ref.current?.setValues({
                            agLink: result.ag_link,
                            chordLyrics: result.chord_lyrics,
                            originalBand: result.original_band,
                            originalKey: result.original_key,
                            songLanguage: result.song_language,
                            songName: result.name,
                            album: result.album,
                            altName: result.alt_name,
                            bassLink: result.bass_link,
                            drumLink: result.drum_link,
                            egLink: result.eg_link,
                            id: result.id,
                            mainKeyLink: result.main_key_link,
                            subKeyLink: result.sub_key_link,
                            originalYoutubeURL: result.original_youtube_url,

                            // @ts-expect-error cant find appriopriate generated types for now
                            tags: result.tags.map((t) => String(t.id)),
                          });
                          setExistingSeqLink(
                            result.file_sequencer.length > 0
                              ? String(result.file_sequencer?.[0].url)
                              : "",
                          );
                          setExistingSecVoiceLink(
                            result.file_sec_voice
                              ? String(result.file_sec_voice)
                              : "",
                          );

                          setIsSearching(false);
                        });
                      });
                    }}
                    style={{
                      background: bgColor,
                    }}
                    className="relative box-border inline-flex h-7 max-w-fit items-center justify-between whitespace-nowrap rounded-full px-1 text-small"
                    key={i}
                  >
                    <span
                      style={{ color: textColor }}
                      className="flex-1 px-2 font-normal text-inherit"
                    >
                      {song.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          <Formik<FormikForm>
            innerRef={ref}
            initialValues={{
              id: "",
              album: "",
              altName: "",
              chordLyrics: "",
              originalBand: "",
              originalKey: "",
              originalYoutubeURL: "",
              songLanguage: "",
              songName: "",
              mainKeyLink: "",
              subKeyLink: "",
              egLink: "",
              agLink: "",
              bassLink: "",
              drumLink: "",
              tags: [""],
            }}
            onReset={() => {
              setEditingMode(false);

              (document.getElementById("file-S") as HTMLInputElement).value =
                "";

              (document.getElementById("file-2") as HTMLInputElement).value =
                "";
            }}
            validationSchema={Yup.object().shape({
              songName: Yup.string().required("Required."),
              songLanguage: Yup.string().oneOf(languageOptions),
              originalKey: Yup.string()
                .required("Required.")
                .max(3, "Max 3 characters"),
              originalBand: Yup.string().required("Required."),
              chordLyrics: Yup.string().required("Required."),
            })}
            onSubmit={async (values, action) => {
              action.setSubmitting(true);
              if (editingMode) {
                if (
                  confirm(
                    "Currently in editing mode! Proceeding with submission will overwrite the song! Proceed?",
                  )
                ) {
                  const toastId = toast.loading("Uploading...");
                  let seqFiles;
                  let secFiles;
                  try {
                    // upload files to S3
                    if (sequencerFile && sequencerFile?.length > 0) {
                      toast.update(toastId, {
                        render: () => {
                          return "Uploading Sequencer Files";
                        },
                      });
                      seqFiles = await uploadFile(sequencerFile).then((res) => {
                        toast.update(toastId, {
                          type: "success",
                          render: () => {
                            return `Sequencer Upload Success`;
                          },
                          isLoading: false,
                          autoClose: 4500,
                        });
                        return res;
                      });
                    }

                    if (secVoiceFile && secVoiceFile?.length > 0) {
                      toast.update(toastId, {
                        render: () => {
                          return "Uploading Second Voice Files";
                        },
                      });
                      secFiles = await uploadFile(secVoiceFile).then((res) => {
                        console.log(res);
                        toast.update(toastId, {
                          type: "success",
                          render: () => {
                            return `Second Voice Upload Success`;
                          },
                          isLoading: false,
                          autoClose: 4500,
                        });
                        return res;
                      });
                    }

                    await fetch("/api/song", {
                      method: "POST",
                      body: JSON.stringify({
                        sequencerFiles: seqFiles ?? "",
                        subVoiceFile: secFiles?.[0] ?? "",
                        ...values,
                      }),
                    }).then(async (res) => {
                      const data = await res.json();
                      if (res.ok) {
                        action.resetForm();
                        setEditingMode(false);
                        toast.update(toastId, {
                          type: "success",
                          render: () => `${data.name} Uploaded!`,
                          icon: () => "🎵",
                          isLoading: false,
                          autoClose: 3000,
                        });
                      } else {
                        toast.update(toastId, {
                          type: "error",
                          render: () => {
                            return `Error: ${data.error}`;
                          },
                          icon: () => "🤯",
                          isLoading: false,
                          autoClose: 4500,
                        });
                      }
                    });
                  } catch (err) {
                    console.error(err);
                    toast.update(toastId, {
                      type: "error",
                      render: () => {
                        return `Error: ${String(err)}`;
                      },
                      icon: () => "🤯",
                      isLoading: false,
                      autoClose: 4500,
                    });
                  } finally {
                    action.setSubmitting(false);
                  }
                }
              } else {
                const toastId = toast.loading("Uploading...");
                let seqFiles;
                let secFiles;
                try {
                  // upload files to S3
                  if (sequencerFile && sequencerFile?.length > 0) {
                    toast.update(toastId, {
                      render: () => {
                        return "Uploading Sequencer Files";
                      },
                    });
                    seqFiles = await uploadFile(sequencerFile).then((res) => {
                      toast.update(toastId, {
                        type: "success",
                        render: () => {
                          return `Sequencer Upload Success`;
                        },
                        isLoading: false,
                        autoClose: 4500,
                      });
                      return res;
                    });
                  }

                  if (secVoiceFile && secVoiceFile?.length > 0) {
                    toast.update(toastId, {
                      render: () => {
                        return "Uploading Second Voice Files";
                      },
                    });
                    secFiles = await uploadFile(secVoiceFile).then((res) => {
                      console.log(res);
                      toast.update(toastId, {
                        type: "success",
                        render: () => {
                          return `Second Voice Upload Success`;
                        },
                        isLoading: false,
                        autoClose: 4500,
                      });
                      return res;
                    });
                  }

                  await fetch("/api/song", {
                    method: "POST",
                    body: JSON.stringify({
                      sequencerFiles: seqFiles ?? "",
                      subVoiceFile: secFiles?.[0] ?? "",
                      ...values,
                    }),
                  }).then(async (res) => {
                    const data = await res.json();
                    if (res.ok) {
                      action.resetForm();
                      setEditingMode(false);
                      toast.update(toastId, {
                        type: "success",
                        render: () => `${data.name} Uploaded!`,
                        icon: () => "🎵",
                        isLoading: false,
                        autoClose: 3000,
                      });
                    } else {
                      toast.update(toastId, {
                        type: "error",
                        render: () => {
                          return `Error: ${data.error}`;
                        },
                        icon: () => "🤯",
                        isLoading: false,
                        autoClose: 4500,
                      });
                    }
                  });
                } catch (err) {
                  console.error(err);
                  toast.update(toastId, {
                    type: "error",
                    render: () => {
                      return `Error: ${String(err)}`;
                    },
                    icon: () => "🤯",
                    isLoading: false,
                    autoClose: 4500,
                  });
                } finally {
                  action.setSubmitting(false);
                }
              }
            }}
          >
            {({ values, isSubmitting }) => (
              <Form className="w-full">
                <div className="flex w-full flex-col gap-x-4 gap-y-2 pt-5 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-4">
                  <TextField
                    name="Song Name"
                    required
                    formikKey="songName"
                    disabled={isSubmitting || isSearching}
                  />
                  <TextField
                    disabled={isSubmitting || isSearching}
                    name="Alternate Name"
                    formikKey="altName"
                  />
                  <SelectField
                    disabled={isSubmitting || isSearching}
                    formikKey="songLanguage"
                    required
                    name="Song Language"
                    options={languageOptions}
                  />
                  <TextField
                    disabled={isSubmitting || isSearching}
                    name="Original Key"
                    required
                    formikKey="originalKey"
                  />
                  <TextField
                    disabled={isSubmitting || isSearching}
                    name="Original Worship Band"
                    required
                    formikKey="originalBand"
                  />
                  <TextField
                    disabled={isSubmitting || isSearching}
                    name="Associated Album"
                    formikKey="album"
                  />
                  <TagsField
                    tagOptions={tagOptions}
                    name="Tags"
                    formikKey="tags"
                    disabled={isSubmitting || isSearching}
                    defaultTag={values.tags}
                    // multiple
                  />
                  <YoutubeField
                    disabled={isSubmitting || isSearching}
                    formikKey="originalYoutubeURL"
                    className="sm:col-span-2"
                    name="Original Youtube Video Link"
                  />
                  <YoutubeField
                    disabled={isSubmitting || isSearching}
                    formikKey="mainKeyLink"
                    name="Key 1 Video Link"
                  />
                  <YoutubeField
                    disabled={isSubmitting || isSearching}
                    formikKey="subKeyLink"
                    name="Key 2 Video Link"
                  />
                  <YoutubeField
                    disabled={isSubmitting || isSearching}
                    formikKey="egLink"
                    name="EG Video Link"
                  />
                  <YoutubeField
                    disabled={isSubmitting || isSearching}
                    formikKey="agLink"
                    name="AG Video Link"
                  />
                  <YoutubeField
                    disabled={isSubmitting || isSearching}
                    formikKey="bassLink"
                    name="Bass Video Link"
                  />
                  <YoutubeField
                    disabled={isSubmitting || isSearching}
                    formikKey="drumLink"
                    name="Drum Video Link"
                  />
                  <div className="col-span-2 grid w-full grid-cols-1 items-start gap-x-5 gap-y-1 md:grid-cols-2">
                    <div className="flex w-full flex-col items-center justify-center gap-2">
                      <FileInputField
                        disabled={isSubmitting || isSearching}
                        name="Sequencer"
                        accept=".rar, .zip"
                        setFile={setSequencerFile}
                        multiple
                      />
                      {editingMode && existingSeqLink && (
                        <div className="flex flex-col overflow-hidden rounded-lg border border-primary">
                          <div className="flex w-full flex-row items-center justify-between bg-primary pl-3 pr-1">
                            <p>Existing Sequencer File</p>
                            <FaDownload
                              size={15}
                              className="cursor-pointer"
                              onClick={() =>
                                window.open(existingSeqLink, "_blank")
                              }
                            />
                          </div>
                          <div className="relative select-none p-1.5 text-xs">
                            {existingSeqLink}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-2">
                      <FileInputField
                        disabled={isSubmitting || isSearching}
                        name="2nd Voice"
                        accept="audio/*, video/*"
                        setFile={setSecVoiceFile}
                      />
                      {editingMode && existingSecVoiceLink && (
                        <div className="flex flex-col overflow-hidden rounded-lg border border-primary">
                          <div className="flex w-full flex-row items-center justify-between bg-primary pl-3 pr-1">
                            <p>Existing Sec Voice File</p>
                            <FaDownload
                              size={15}
                              className="cursor-pointer"
                              onClick={() =>
                                window.open(existingSecVoiceLink, "_blank")
                              }
                            />
                          </div>
                          <div className="relative select-none p-1.5 text-xs">
                            {existingSecVoiceLink}
                          </div>
                        </div>
                      )}
                      {!editingMode &&
                        secVoiceFile &&
                        secVoiceFile.length > 0 &&
                        Array.from(secVoiceFile).map((a) => {
                          return (
                            <div
                              key={a.name}
                              className="flex w-full flex-col items-center gap-1"
                            >
                              <p>{a.name}</p>
                              {a.type.startsWith("audio/") ? (
                                <audio
                                  controls
                                  controlsList="nodownload"
                                  className="px-5 py-1"
                                >
                                  <source
                                    src={URL.createObjectURL(a)}
                                    type={a.type}
                                  />
                                </audio>
                              ) : a.type.startsWith("video/") ? (
                                <video controls controlsList="nodownload">
                                  <source
                                    src={URL.createObjectURL(a)}
                                    type={a.type}
                                  />
                                </video>
                              ) : null}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-1">
                  <TextAreaField
                    disabled={isSubmitting || isSearching}
                    formikKey="chordLyrics"
                    name="Chords / Lyrics"
                    required
                    placeholder={`[Chorus]\nNever gonna [F]give you [G]up\nNever gonna [Em]let you [Am]down\nNever gonna [F]run [G]around and [E]desert [Am]you`}
                    hint="Wrap chords in location with [ ] brackets"
                  />

                  <label className="daisy-form-control w-full">
                    <div className="daisy-label">
                      <span className="daisy-label-text">Preview</span>
                    </div>
                    <div className="h-100 daisy-card w-full">
                      <div
                        className="daisy-card-body daisy-card-bordered max-h-[25vh] w-full overflow-auto rounded-md border-warning"
                        dangerouslySetInnerHTML={{
                          __html: md.render(
                            values.chordLyrics ||
                              `[Chorus]\nNever gonna [F]give you [G]up\nNever gonna [Em]let you [Am]down\nNever gonna [F]run [G]around and [E]desert [Am]you`,
                          ),
                        }}
                      />
                    </div>
                  </label>
                </div>
                <div className="flex w-full flex-row justify-center gap-5 pt-5">
                  {isSubmitting || isSearching ? (
                    <button className="daisy-btn daisy-btn-success flex-grow">
                      <span className="daisy-btn-loading daisy-btn-loading-spinner"></span>
                      loading
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="daisy-btn daisy-btn-success flex-grow"
                    >
                      Submit
                    </button>
                  )}
                  <button
                    type="reset"
                    className="daisy-btn daisy-btn-outline daisy-btn-secondary"
                  >
                    Reset
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </>
  );
}
