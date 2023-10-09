import React from "react";
import { useState } from "react";

export default function Modal({ isOpen, onClose, onOk, children, item_info }) {
  const [tempfileUrl, setTempFileUrl] = useState("");
  const [tempCarNum, setTempCarNum] = useState(item_info.number);
  const [tempDriverName, setTempDriverName] = useState(item_info.name);
  const modalClasses = isOpen
    ? "fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 transition transition-opacity duration-1000 ease-in-out opacity-100"
    : "fixed top-0 left-0 w-full h-full bg-black bg-opacity-0 transition transition-opacity duration-1000 ease-in-out opacity-0 pointer-events-none";

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setTempFileUrl(file);
  };
  return (
    <div className={modalClasses}>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-[20]">
        <button
          onClick={onClose}
          className="absolute top-3 right-5 font-bold text-[25px] text-gray-500 hover:text-gray-700"
        >
          X
        </button>
        {children}
        <div className="mt-4">
          <label htmlFor="text-input" className="block font-medium mb-1">
            Car Number:
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            value={tempCarNum}
            onChange={(e) => setTempCarNum(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="text-input" className="block font-medium mb-1">
            Driver Name:
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            value={tempDriverName}
            onChange={(e) => setTempDriverName(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="file-input" className="block font-medium mb-1">
            Upload Image:
          </label>
          <input
            type="file"
            id="file-input"
            className="w-full"
            accept=".jpg, .jpeg, .png, .gif"
            onChange={handleFileChange}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              onOk(tempCarNum, tempDriverName, tempfileUrl);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
          >
            OK
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-600 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
