"use client";
import React, { useState } from "react";
import {
  MenuIcon,
  PlusIcon,
  MessageSquareIcon,
  HelpCircleIcon,
  ActivityIcon,
  SettingsIcon,
} from "lucide-react";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col justify-between bg-red-600 py-4 px-2 transition-all duration-300"
      style={{ width: extended ? "250px" : "64px" }}
    >
      <div>
        <button
          onClick={() => setExtended(!extended)}
          className="text-gray-100 hover:text-gray-200 focus:outline-none"
        >
          <MenuIcon className="text-2xl" />
        </button>

        <div
          onClick={() => console.log("New Chat clicked")}
          className={`mt-3 flex items-center py-2 px-3 text-sm font-medium text-gray-100 cursor-pointer rounded-lg hover:bg-gray-700 transition-colors duration-200 ${
            extended ? "w-full" : "w-auto"
          }`}
        >
          <PlusIcon className="text-lg" />
          {extended && <span className="ml-2">New Chat</span>}
        </div>

        {extended && (
          <div className="mt-5">
            <p className="text-xs font-medium text-gray-300 mb-1">Recent</p>
            {["Chat one", "Chat two", "Chat three"].map((item, index) => (
              <div
                key={index}
                onClick={() => console.log(`Load prompt: ${item}`)}
                className="flex items-center py-1.5 px-3 rounded-lg text-gray-100 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
              >
                <MessageSquareIcon className="text-lg" />
                <span className="ml-2 truncate">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <div
          className={`flex items-center py-1.5 px-3 rounded-lg text-gray-100 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
            extended ? "w-full" : "w-auto"
          }`}
        >
          <HelpCircleIcon className="text-lg" />
          {extended && <span className="ml-2">Help</span>}
        </div>

        <div
          className={`flex items-center py-1.5 px-3 rounded-lg text-gray-100 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
            extended ? "w-full" : "w-auto"
          }`}
        >
          <ActivityIcon className="text-lg" />
          {extended && <span className="ml-2">Activity</span>}
        </div>

        <div
          className={`flex items-center py-1.5 px-3 rounded-lg text-gray-100 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
            extended ? "w-full" : "w-auto"
          }`}
        >
          <SettingsIcon className="text-lg" />
          {extended && <span className="ml-2">Settings</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
