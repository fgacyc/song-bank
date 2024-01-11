interface SelectFieldProps {
  name: string;
  required?: boolean;
  options: string[];
}

type SelectProps = JSX.IntrinsicElements["select"] & SelectFieldProps;

export const SelectField: React.FunctionComponent<SelectProps> = ({
  name,
  required,
  options,
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
      <select
        {...rest}
        defaultValue={"Pick One"}
        // placeholder="..."
        className="select select-bordered select-primary w-full"
      >
        <option disabled>Pick One</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
};
