import React from "react";
import { ReactNode } from "react";

interface MessageProps {
  children: ReactNode;
  sent: boolean;
}

const Message = ({ children, sent }: MessageProps) => {
  return (
    <div
      className={`mb-4 max-w-[70%] ${
        sent ? "ml-auto text-right" : "mr-auto text-left"
      }`}
    >
      <div
        className={`inline-block px-4 py-2 rounded-2xl ${
          sent ? "bg-green-500 text-white" : "bg-gray-700"
        }`}
        style={{ width: "fit-content" }}
      >
        {children}
      </div>
    </div>
  );
};

export default Message;