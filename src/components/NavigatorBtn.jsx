import * as React from "react";

export default function NavigatorBtn({ text, onClick }) {
  return (
    <>
      <button
        className="w-full align-center mb-3 bg-transparent hover:bg-blue text-blue-700 hover:text-white font-semibold py-2 px-4 border border-blue-500 rounded"
        onClick={onClick} // Attach the onClick event
      >
        {text}
      </button>
    </>
  );
}
