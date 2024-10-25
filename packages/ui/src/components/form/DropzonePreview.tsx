import React from "react";

// Define the type for the file prop
interface FileProps {
  name: string;
  size: number;
}

// DropzonePreview component displays a preview of the uploaded file
export function DropzonePreview({ file }: { file: FileProps | null }) {
  // Check if the file is provided
  if (file) {
    return (
      <div className="border-2 border-black-2 rounded-lg overflow-hidden flex items-center gap-5">
        {/* Display a static image for the file type */}
        <img
          src={"/assets/logo/pdf.svg"}
          className="p-2 bg-heat-1"
          alt="File type icon"
        />
        <div>
          {/* Display the file name */}
          <p className="text-black-10 text-sm">{file.name}</p>
          {/* Display the file size in MB, formatted to two decimal places */}
          <p className="text-black-8 text-xs">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
    );
  }
  // Return an empty fragment if no file is provided
  return <></>;
}
