import { type Dispatch, type SetStateAction } from "react";
import { IoIosClose } from "react-icons/io";
import { RiSearch2Line } from "react-icons/ri";
import { Form, Formik, useFormikContext } from "formik";

interface SearchBarProps {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
}

const Input: React.FC<{
  setSearchString: Dispatch<SetStateAction<string>>;
}> = ({ setSearchString }) => {
  const formikRef = useFormikContext<{ searchString: string }>();
  return (
    <input
      className="w-full ps-2"
      type="text"
      placeholder="Search"
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
          <Form className="flex w-full items-center justify-between">
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
