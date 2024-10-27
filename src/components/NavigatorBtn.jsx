import * as React from "react";

export default function NavigatorBtn({ text, onClick }) {
  return (
    <>
      <button
        className="w-full align-center my-3 hover:bg-blue-700 hover:text-white text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded duration-100"
        onClick={onClick} // Attach the onClick event
      >
        {text}
      </button>
    </>
  );
}
