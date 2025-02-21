import { FaImage, FaMicrophone } from "react-icons/fa";

function Input() {
  return (
    <div className="w-full max-w-[900px] px-5 m-auto absolute bottom-0">
      {/* Search Box */}
      <div className="flex items-center justify-between gap-5 bg-[#1b1b1b] rounded-[50px] px-5 py-2.5">
        <input
          type="text"
          placeholder="Enter your prompt here"
          className="p-2 flex-1 text-lg border-none outline-none bg-transparent"
        />

        {/* Icons */}
        <div className="flex items-center gap-[15px] text-gray-400">
          <FaImage className="w-6 h-6 cursor-pointer" />
          <FaMicrophone className="w-6 h-6 cursor-pointer" />
        </div>
      </div>

      {/* Bottom info */}
      <p className="text-[13px] my-[15px] mx-auto text-center font-light text-[#585858]">
        MayAi may display inaccurate info, double-check its responses.
      </p>
    </div>
  );
}

export default Input;
