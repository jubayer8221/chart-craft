import Image from "next/image";
import React from "react";

const FileConvert = () => {
  return (
    <div className="max-w-md mx-auto p-2 bg-white rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Convert Your File
        </h2>
        {/* <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Convert
        </button> */}
      </div>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
        <Image
          src="/image/converimage.png"
          alt="File conversion illustration"
          width={270}
          height={40}
          className="object-contain"
        />
      </div>

      <p className="text-sm text-gray-600 text-center">
        To convert your data, click the button above.
      </p>
    </div>
  );
};

export default FileConvert;
