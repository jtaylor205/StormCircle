// Checklist.jsx
import React, { useState } from "react";
import { FaCheckSquare, FaSquare } from "react-icons/fa";

export default function Checklist({ items }) {
  const [isVisible, setIsVisible] = useState(false);
  const [checkedItems, setCheckedItems] = useState(
    items.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleCheck = (item) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [item]: !prevState[item],
    }));
  };

  return (
    <>
<button
  onClick={toggleVisibility}
  className="fixed top-1/2 transform -translate-y-1/2 right-2 z-50 text-blue-600 font-semibold bg-gray-200 bg-opacity-90 rounded-tl-lg rounded-bl-lg py-2 px-4 shadow-lg transition-transform duration-300"
  style={{
    writingMode: "vertical-rl",
    transformOrigin: "right center",
    transform: `translateY(-50%) ${isVisible ? 'translateX(-247px)' : 'translateX(0)'}`,
  }}
>
  {isVisible ? "Close Checklist" : "Open Checklist"}
</button>




      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-200 bg-opacity-90 rounded-l-lg shadow-lg p-4 z-40 transform transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={item}
              onClick={() => handleCheck(item)}
              className="flex items-center cursor-pointer text-sm"
            >
              {checkedItems[item] ? (
                <FaCheckSquare className="text-blue-500 mr-2" />
              ) : (
                <FaSquare className="text-gray-400 mr-2" />
              )}
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}






