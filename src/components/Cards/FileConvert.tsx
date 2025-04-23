import Image from "next/image";
import React from "react";

const FileConvert = () => {
  return (
    <div className="">
      <div className="justify-between items-center">
        <h2 className="text-lg font-semibold py-2">Convert Your File</h2>
        <button type="submit"></button>
      </div>

      <Image
        src="/image/converimage.png"
        alt="image"
        width={260}
        height={20}
      ></Image>
      <h1 className="text-sm">To Convert Your Data Click here.</h1>
    </div>
  );
};

export default FileConvert;
