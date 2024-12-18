import { Upload } from "@phosphor-icons/react";
import { type Accept, useDropzone } from "react-dropzone";
import { useController, type Control, type FieldError } from "react-hook-form";
import React from "react";

// Define the props for the DropzoneInput component
interface DropzoneInputProps {
  // Control object from react-hook-form to manage form state
  control: Control;
  // Name of the field in the form
  name: string;
  // Accepted file types, can be a string or an array of strings
  accept: Accept;
  // Object containing field errors, indexed by field name
  errors?: Record<string, FieldError>;
  // Function to clear errors for a specific field
  clearErrors: (name: string) => void;
  // Optional string to specify allowed file format for display
  allowedFileFormat?: string;
}

// DropzoneInput component for file uploads
export function DropzoneInput({
  control,
  name,
  accept,
  errors,
  clearErrors,
  allowedFileFormat,
}: DropzoneInputProps): JSX.Element {
  // Destructure field methods from useController hook
  const {
    field: { onChange, onBlur, ref },
  } = useController({
    name,
    control,
    defaultValue: [], // Default value for the field
  });

  // Destructure methods from useDropzone hook
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Handle file drop, update form state and clear errors
      onChange(acceptedFiles[0]);
      clearErrors(name);
    },
    accept, // Specify accepted file types
  });

  return (
    <>
      <div
        {...getRootProps()}
        className="border-2 border-dashed px-10 py-5 rounded-xl text-center cursor-pointer border-primary-main"
      >
        <input {...getInputProps()} onBlur={onBlur} ref={ref} />
        {isDragActive ? (
          <p className="text-blue-500">Drop the files here ...</p>
        ) : (
          <div className="flex flex-col items-center">
            <Upload size={20} weight="fill" className="text-primary-main" />
            <div className="text-primary-main body-xsmall">{}</div>
            {allowedFileFormat && (
              <p className="text-black-5 text-xs">
                In {allowedFileFormat} format
              </p>
            )}
          </div>
        )}
      </div>
      {errors?.[name] && <p className="text-red-500">{errors[name].message}</p>}
    </>
  );
}
