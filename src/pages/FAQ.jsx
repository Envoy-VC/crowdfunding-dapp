import React, { useState } from "react";
import { faqs } from "../constants";

const FAQPage = () => {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (id) => {
    setExpanded(id === expanded ? null : id);
  };

  return (
    <div className=" text-gray-300 min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-16 ">
          Frequently Asked Questions
        </h1>
        {faqs.map((question) => (
          <div key={question.id} className="mb-6">
            <button
              onClick={() => toggleExpand(question.id)}
              className="text-xl font-bold mb-3 w-full text-left focus:outline-none flex items-center"
            >
              {question.question}
              <svg
                className={`w-6 h-6 ml-2 ${
                  expanded === question.id ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {expanded === question.id && (
              <div className="p-4 bg-gray-700 rounded-lg mt-2">
                {question.answer}
              </div>
            )}
            <div className="border-t-2 border-gray-600 mt-8 mb-8"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
