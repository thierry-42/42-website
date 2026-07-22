import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/cn";

type FieldFrameProps = {
  children: ReactNode;
  description?: string;
  error?: string;
  id: string;
  label: string;
  required?: boolean;
};

function FieldFrame({
  children,
  description,
  error,
  id,
  label,
  required,
}: FieldFrameProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold" htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-hubspot-coral">
            *
          </span>
        ) : null}
      </label>
      {children}
      {description ? (
        <p
          className="text-xs leading-5 text-[var(--text-muted)]"
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}
      {error ? (
        <p
          className="text-xs leading-5 text-hubspot-coral"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlClasses =
  "min-h-12 w-full rounded-sm border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--foreground)] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[var(--text-muted)]/75 hover:border-current disabled:cursor-not-allowed disabled:bg-[var(--surface-muted)] disabled:opacity-60 aria-invalid:border-hubspot-coral";

type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  description?: string;
  error?: string;
  id: string;
  label: string;
};

export function FormField({
  className,
  description,
  error,
  id,
  label,
  required,
  ...props
}: FormFieldProps) {
  const describedBy = [
    description ? `${id}-description` : undefined,
    error ? `${id}-error` : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FieldFrame
      description={description}
      error={error}
      id={id}
      label={label}
      required={required}
    >
      <input
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        className={cn(controlClasses, className)}
        id={id}
        required={required}
        {...props}
      />
    </FieldFrame>
  );
}

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  children: ReactNode;
  description?: string;
  error?: string;
  id: string;
  label: string;
};

export function SelectField({
  children,
  className,
  description,
  error,
  id,
  label,
  required,
  ...props
}: SelectFieldProps) {
  const describedBy = [
    description ? `${id}-description` : undefined,
    error ? `${id}-error` : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FieldFrame
      description={description}
      error={error}
      id={id}
      label={label}
      required={required}
    >
      <select
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        className={cn(controlClasses, "appearance-none", className)}
        id={id}
        required={required}
        {...props}
      >
        {children}
      </select>
    </FieldFrame>
  );
}

type TextareaFieldProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "id"
> & {
  description?: string;
  error?: string;
  id: string;
  label: string;
};

export function TextareaField({
  className,
  description,
  error,
  id,
  label,
  required,
  ...props
}: TextareaFieldProps) {
  const describedBy = [
    description ? `${id}-description` : undefined,
    error ? `${id}-error` : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FieldFrame
      description={description}
      error={error}
      id={id}
      label={label}
      required={required}
    >
      <textarea
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        className={cn(controlClasses, "min-h-36 resize-y", className)}
        id={id}
        required={required}
        {...props}
      />
    </FieldFrame>
  );
}

type CheckboxFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "type"
> & {
  description?: string;
  error?: string;
  id: string;
  label: string;
};

export function CheckboxField({
  className,
  description,
  error,
  id,
  label,
  ...props
}: CheckboxFieldProps) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3" htmlFor={id}>
        <input
          aria-describedby={description ? `${id}-description` : undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            "mt-1 size-5 shrink-0 accent-signal-500 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          id={id}
          type="checkbox"
          {...props}
        />
        <span className="text-sm leading-6">{label}</span>
      </label>
      {description ? (
        <p
          className="mt-1 pl-8 text-xs leading-5 text-[var(--text-muted)]"
          id={`${id}-description`}
        >
          {description}
        </p>
      ) : null}
      {error ? (
        <p className="mt-1 pl-8 text-xs text-hubspot-coral" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
