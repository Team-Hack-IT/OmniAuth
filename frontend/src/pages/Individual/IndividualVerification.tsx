import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUpload } from "react-icons/io5";

const IndividualVerification = () => {

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop});

  return (
    <div className="flex flex-col gap-16">
      <div className="flex bg-gray-300 p-24 rounded-md">
      <h1 className="pl-2">ID Verification</h1>
      </div>
     
      <div {...getRootProps()} className="bg-gray-300 p-20 rounded-md cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className="flex flex-col justify-center items-center gap-5">
           
            <h3>Upload Document</h3>
            <IoCloudUpload size={60} className="text-button"/>
            <button className="bg-button p-3 rounded-md px-10">Upload File</button>
          </div>
        )}
      </div>
     
    </div>
  );
};

export default IndividualVerification;
