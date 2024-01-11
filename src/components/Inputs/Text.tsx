interface TextFieldProps {
  name: string;
  required?: boolean;
  hint?: string;
}

type TextProps = TextFieldProps & JSX.IntrinsicElements["input"];

export const TextField: React.FunctionComponent<TextProps> = ({
  name,
  required,
  hint,
}) => {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">
          {name}{" "}
          {required && <span className="label-text-alt text-error">*</span>}
        </span>
      </div>
      <input
        type="text"
        // placeholder="..."
        className="input input-bordered input-primary w-full"
      />
      {hint && (
        <div className="label">
          <span className="label-text">
            <span className="label-text-alt" />
            <span className="label-text-alt italic">{hint}</span>
          </span>
        </div>
      )}
    </label>
  );
};

type TextAreaProps = TextFieldProps & JSX.IntrinsicElements["textarea"];

export const TextAreaField: React.FunctionComponent<TextAreaProps> = ({
  name,
  required,
  hint,
  ...rest
}) => {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">
          {name}{" "}
          {required && <span className="label-text-alt text-error">*</span>}
        </span>
      </div>
      <textarea
        {...rest}
        className="textarea textarea-bordered textarea-primary w-full resize-y"
        rows={5}
      />
      {hint && (
        <div className="label">
          <span className="label-text">
            <span className="label-text-alt" />
            <span className="label-text-alt italic">{hint}</span>
          </span>
        </div>
      )}
    </label>
  );
};
