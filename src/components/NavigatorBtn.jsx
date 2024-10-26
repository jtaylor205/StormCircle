import * as React from "react";

export default function NavigatorBtn({ text, onClick }) {
  return (
    <>
      <button
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        onClick={onClick} // Attach the onClick event
      >
        {text}
      </button>
    </>
  );
}
