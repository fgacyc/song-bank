import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { IoIosClose } from "react-icons/io";
import { RiSearch2Line } from "react-icons/ri";
import { Form, Formik, type FormikProps, useFormikContext } from "formik";

interface SearchBarProps {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
}

const Input: React.FC<{
  setSearchString: Dispatch<SetStateAction<string>>;
}> = ({ setSearchString }) => {
  const formikRef = useFormikContext<{ searchString: string }>();
  console.log(formikRef.values.searchString);
  return (
    <input
      className="w-full ps-2"
      type="text"
      placeholder="Search"
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
  type SearchBarForm = { searchString: string };
  const formikInnerRef = useRef<FormikProps<SearchBarForm>>(null);

  useEffect(() => {
    const setValue = async () => {
      if (!formikInnerRef.current) return;
      await formikInnerRef.current.setFieldValue("searchString", searchString);
    };

    void setValue();
  }, [searchString]);

  return (
    <div className="flex h-[30px] w-full items-center justify-between rounded-md border sm:w-fit sm:justify-evenly md:w-fit md:justify-evenly lg:w-fit lg:justify-evenly">
      <Formik<SearchBarForm>
        initialValues={{
          searchString: searchString ?? "",
        }}
        onReset={() => {
          setSearchString("");
        }}
        innerRef={formikInnerRef}
        onSubmit={async () => null}
      >
        {({ resetForm }) => (
          <Form className="flex w-full items-center justify-between">
            <Input setSearchString={setSearchString} />
            <button
              type="button"
              onClick={() => resetForm()}
              className="flex h-full w-[30px] items-center justify-center rounded-e-md border-s"
            >
              {!searchString ? <RiSearch2Line /> : <IoIosClose />}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SearchBar;
