import { type Dispatch, type SetStateAction } from "react";
import { IoIosClose } from "react-icons/io";
import { RiSearch2Line } from "react-icons/ri";
import { Form, Formik, useFormikContext } from "formik";

export type Song = {
  id?: string;
  name: string;
  alt_name?: string;
  song_language: string;
  original_key: string;
  original_band: string;
  album?: string;
  original_youtube_url?: string;
  chord_lyrics: string;
  main_key_link?: string;
  sub_key_link?: string;
  eg_link?: string;
  ag_link?: string;
  bass_link?: string;
  drum_link?: string;
  tags?: string[];
  sequencer_files?: string[];
  sub_voice_file?: string;
};

interface SearchBarProps {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
  songList?: Song[];
}

const Input: React.FC<{
  setSearchString: Dispatch<SetStateAction<string>>;
}> = ({ setSearchString }) => {
  const formikRef = useFormikContext<{ searchString: string }>();
  return (
    <input
      type="text"
      placeholder="Search"
      className="ps-2"
      name="searchString"
      value={formikRef.values.searchString}
      onChange={async (e) => {
        await formikRef.setFieldValue("searchString", e.target.value);
        setSearchString(e.target.value);
      }}
    />
  );
};

const SearchBar: React.FC<SearchBarProps> = ({
  searchString,
  setSearchString,
}) => {
  return (
    <div className="flex h-[30px] w-full items-center justify-between rounded-md border sm:w-fit sm:justify-evenly md:w-fit md:justify-evenly lg:w-fit lg:justify-evenly">
      <Formik<{ searchString: string }>
        initialValues={{ searchString: searchString }}
        onSubmit={async (_, action) => {
          await action.setFieldValue("searchString", "");
          setSearchString("");
        }}
      >
        {() => (
          <Form className="flex flex-row items-center">
            <Input setSearchString={setSearchString} />
            <button
              type="submit"
              className="flex h-full w-[30px] items-center justify-center rounded-e-md border-s"
            >
              {searchString === "" || searchString === undefined ? (
                <RiSearch2Line />
              ) : (
                <IoIosClose />
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SearchBar;
