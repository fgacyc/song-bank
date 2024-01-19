import type { Dispatch, SetStateAction } from "react";

interface FileInputProps {
  name: string;
  required?: boolean;
  hint?: string;
  disabled: boolean;
  accept?: string;
  multiple?: boolean;
  setFile: Dispatch<SetStateAction<FileList | undefined>>;
}

export const FileInputField: React.FunctionComponent<FileInputProps> = ({
  name,
  required,
  disabled,
  accept,
  hint,
  setFile,
  multiple,
}) => {
  return (
    <label className="daisy-form-control w-full">
      <div className="daisy-label">
        <span className="daisy-label-text">
          {name}{" "}
          {required && (
            <span className="daisy-label-text-alt text-error">*</span>
          )}
        </span>
        <span className="daisy-label-text-alt"></span>
      </div>
      <input
        id={`file-${name[0]}`}
        type="file"
        disabled={disabled}
        className="daisy-file-input daisy-file-input-bordered daisy-file-input-primary daisy-file-input-sm w-full"
        accept={accept}
        onChange={(e) => setFile(e.target.files!)}
        multiple={multiple}
      />
      <div className="daisy-label">
        <span className="daisy-label-text-alt italic">{hint}</span>
        <span className="daisy-label-text-alt"></span>
      </div>
    </label>
  );
};
