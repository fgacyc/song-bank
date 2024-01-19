import { isYouTubeUrl, transformToEmbedUrl } from "@/helpers/youtubeHelpers";
import { type FormikForm } from "@/pages";
import { Field, useFormikContext } from "formik";
import type { Dispatch, SetStateAction } from "react";
import { IoSearch } from "react-icons/io5";

interface TextFieldProps {
  name: string;
  required?: boolean;
  hint?: string;
  formikKey: keyof FormikForm;
  disabled: boolean;
}

type TextProps = TextFieldProps & JSX.IntrinsicElements["input"];

export const SearchField: React.FunctionComponent<
  Omit<TextProps, "formikKey" | "disabled"> & {
    isSearching?: boolean;
    setIsSearching: Dispatch<SetStateAction<boolean>>;
    setSearchTerm: Dispatch<SetStateAction<string>>;
  }
> = ({ name, required, hint, isSearching, setSearchTerm }) => {
  return (
    <label className="daisy-form-control w-full">
      <div className="daisy-label">
        <span className="daisy-label-text">
          {name}{" "}
          {required && (
            <span className="daisy-label-text-alt text-error">*</span>
          )}
        </span>
      </div>
      <div
        className={`daisy-input ${
          isSearching ? "daisy-input-disabled " : ""
        }daisy-input-bordered daisy-input-secondary flex w-full flex-row overflow-hidden p-0`}
      >
        <input
          disabled={isSearching}
          type="text"
          // placeholder="..."
          className="h-full w-full bg-transparent px-3"
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />
        {!isSearching ? (
          <button
            disabled={isSearching}
            className="daisy-btn daisy-btn-primary rounded-md"
          >
            <IoSearch className="text-xl" />
          </button>
        ) : (
          <button className="daisy-btn daisy-btn-success flex-grow">
            <span className="daisy-loading daisy-loading-spinner"></span>
          </button>
        )}
      </div>
      {hint && (
        <div className="daisy-label">
          <span className="daisy-label-text">
            <span className="daisy-label-text-alt" />
            <span className="daisy-label-text-alt italic">{hint}</span>
          </span>
        </div>
      )}
    </label>
  );
};

export const TextField: React.FunctionComponent<TextProps> = ({
  name,
  required,
  hint,
  className,
  formikKey,
  disabled,
}) => {
  const context = useFormikContext<FormikForm>();
  return (
    <label
      className={`daisy-form-control w-full${className ? ` ${className}` : ""}`}
    >
      <div className="daisy-label">
        <span className="daisy-label-text">
          {name}{" "}
          {required && (
            <span className="daisy-label-text-alt text-error">*</span>
          )}
        </span>
        <span className="daisy-label-text-alt"></span>
      </div>
      <Field
        name={formikKey}
        type="text"
        disabled={disabled}
        // placeholder="..."
        className="daisy-input daisy-input-bordered daisy-input-primary w-full"
      />
      {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
      {hint || context.errors[formikKey] ? (
        <div className="daisy-label">
          <span className="daisy-label-text flex w-full flex-row justify-between">
            <span className="daisy-label-text-alt italic">
              {hint ? hint : context.errors[formikKey] ? " " : hint}
            </span>
            <span className="daisy-label-text-alt italic text-error">
              {context.errors[formikKey]}
            </span>
          </span>
        </div>
      ) : null}
    </label>
  );
};

export const YoutubeField: React.FunctionComponent<TextProps> = ({
  name,
  required,
  hint,
  className,
  formikKey,
  disabled,
}) => {
  const context = useFormikContext<FormikForm>();
  return (
    <div
      className={`col-span-1 flex w-full flex-col items-center justify-center gap-2 ${className}`}
    >
      <TextField
        required={required}
        hint={hint}
        formikKey={formikKey}
        disabled={disabled}
        name={name}
      />

      {context.values[formikKey] &&
        isYouTubeUrl(String(context.values[formikKey])) && (
          <iframe
            src={transformToEmbedUrl(String(context.values[formikKey]))}
            frameBorder={0}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
    </div>
  );
};

type TextAreaProps = TextFieldProps & JSX.IntrinsicElements["textarea"];

export const TextAreaField: React.FunctionComponent<TextAreaProps> = ({
  name,
  required,
  hint,
  formikKey,
  disabled,
  ...rest
}) => {
  const context = useFormikContext<FormikForm>();
  return (
    <label className="daisy-form-control w-full">
      <div className="daisy-label">
        <span className="daisy-label-text">
          {name}{" "}
          {required && (
            <span className="daisy-label-text-alt text-error">*</span>
          )}
        </span>
      </div>
      <Field
        name={formikKey}
        disabled={disabled}
        as="textarea"
        {...rest}
        className="daisy-textarea daisy-textarea-bordered daisy-textarea-primary w-full resize-y"
        rows={5}
      />
      {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
      {hint || context.errors[formikKey] ? (
        <div className="daisy-label">
          <span className="daisy-label-text flex w-full flex-row justify-between">
            <span className="daisy-label-text-alt italic">
              {hint ? hint : context.errors[formikKey] ? " " : hint}
            </span>
            <span className="daisy-label-text-alt italic text-error">
              {context.errors[formikKey]}
            </span>
          </span>
        </div>
      ) : null}
    </label>
  );
};
