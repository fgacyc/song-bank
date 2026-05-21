/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { FormikForm } from "@/pages/legacy/home";
import type { Tag } from "@prisma/client";
import { Field, useFormikContext } from "formik";

import { Select, SelectItem } from "@nextui-org/react";
import { adjustSaturation } from "@/helpers/hexToRGBA";

interface SelectFieldProps {
  name: string;
  required?: boolean;
  options: string[];
  formikKey: keyof FormikForm;
  disabled: boolean;
}

type SelectProps = JSX.IntrinsicElements["select"] & SelectFieldProps;

export const SelectField: React.FunctionComponent<SelectProps> = ({
  name,
  required,
  options,
  formikKey,
  disabled,
}) => {
  const context = useFormikContext<FormikForm>();
  return (
    <label className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">
          {name}{" "}
          {required && <span className="text-sm text-destructive">*</span>}
        </span>
      </div>
      <Field
        as="select"
        name={formikKey}
        disabled={disabled}
        className="flex h-10 w-full rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </Field>
      {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
      {context.errors[formikKey] ? (
        <div className="flex w-full flex-row justify-between">
          <span className="text-xs italic text-text-secondary"></span>
          <span className="text-xs italic text-destructive">
            {context.errors[formikKey]}
          </span>
        </div>
      ) : null}
    </label>
  );
};

interface TagsFieldProps extends Omit<SelectProps, "options"> {
  tagOptions: Tag[];
  defaultTag?: string[];
}

export const TagsField: React.FunctionComponent<TagsFieldProps> = ({
  name,
  required,
  formikKey,
  disabled,
  tagOptions,
  defaultTag,
}) => {
  const context = useFormikContext<FormikForm>();

  return (
    <label className="daisy-form-control w-full sm:col-span-2">
      <div className="daisy-label">
        <span className="daisy-label-text">
          {name}{" "}
          {required && (
            <span className="daisy-label-text-alt text-error">*</span>
          )}
        </span>
      </div>
      <div className="flex h-full flex-col items-center gap-2 md:flex-row">
        <Select
          selectedKeys={defaultTag?.[0] !== "" ? defaultTag : ""}
          aria-labelledby={name}
          onSelectionChange={async (e) => {
            const selection = Array.from(e);
            console.log(selection);
            await context.setFieldValue("tags", selection);
          }}
          items={tagOptions}
          disabled={disabled}
          // defaultValue={options[0]}
          // placeholder="..."
          classNames={{
            base: "h-full flex-grow",
            selectorIcon: "hidden",
            mainWrapper: "h-full flex-grow",
            listbox:
              "data-[focus-visible=true]:outline-none data-[focus=true]:bg-transparent data-[hover=true]:bg-transparent",
            trigger:
              "bg-transparent h-full daisy-select-primary min-h-[48px] daisy-select-bordered daisy-select data-[focus-visible=true]:outline-none data-[focus=true]:bg-transparent data-[hover=true]:bg-transparent rounded-small h-full",
            popoverContent:
              "daisy-select-primary border-[var(--fallback-p,oklch(var(--p)/var(--tw-border-opacity)))] border bg-[var(--fallback-b1,oklch(var(--b1)/1))]",
          }}
          className="daisy-bordered bg-transparent"
          selectionMode="multiple"
          isMultiline
          renderValue={(items) => {
            return (
              <div className="flex max-h-[32px] w-full flex-wrap gap-2 overflow-y-auto">
                {items.map((item) => {
                  return (
                    <div
                      style={{
                        background: adjustSaturation(
                          String(item.data?.color),
                          0,
                        ),
                      }}
                      className="relative box-border inline-flex h-7 max-w-fit items-center justify-between whitespace-nowrap rounded-full px-1 text-small"
                      key={item.key}
                    >
                      <span className="flex-1 px-2 font-normal text-inherit text-white">
                        {item.data?.content}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          }}
        >
          {(item) => {
            return (
              <SelectItem
                key={item.id}
                textValue={item.content}
                className="w-full"
              >
                <div
                  style={{
                    background: adjustSaturation(String(item.color), 0),
                  }}
                  className="relative box-border inline-flex h-7 max-w-fit items-center justify-between whitespace-nowrap rounded-full px-1 text-small"
                >
                  <span className="flex-1 px-2 font-normal text-inherit text-white">
                    {item.content}
                  </span>
                </div>
              </SelectItem>
            );
          }}
        </Select>
        <button
          type="button"
          onClick={() =>
            (
              document.getElementById("tagsModal") as HTMLDialogElement
            ).showModal()
          }
          className="daisy-rounded-btn daisy-btn daisy-btn-secondary w-full md:w-auto"
        >
          Create Tags
        </button>
      </div>
      {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
      {context.errors[formikKey] ? (
        <div className="daisy-label">
          <span className="daisy-label-text flex w-full flex-row justify-between">
            <span className="daisy-label-text-alt italic"></span>
            <span className="daisy-label-text-alt italic text-error">
              {context.errors[formikKey]}
            </span>
          </span>
        </div>
      ) : null}
    </label>
  );
};
