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
    <label className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">
          {name}{" "}
          {required && <span className="text-sm text-destructive">*</span>}
        </span>
      </div>
      <input
        id={`file-${name[0]}`}
        type="file"
        disabled={disabled}
        className="flex h-10 w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        accept={accept}
        onChange={(e) => setFile(e.target.files!)}
        multiple={multiple}
      />
      {hint && (
        <span className="text-xs italic text-text-secondary">{hint}</span>
      )}
    </label>
  );
};
