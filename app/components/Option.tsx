import React from "react";

interface Props {
  option: string;
  optionContent: string;
  isSelected: boolean;
  handleOptionSelect: () => void;
  id: string;
}

const Option: React.FC<Props> = ({
  handleOptionSelect,
  id,
  isSelected,
  option,
  optionContent,
}) => {
  return (
    <div
      className={`w-full p-3 rounded-lg border-2 flex items-center space-x-4 cursor-pointer ${
        isSelected
          ? "bg-slate-200 border-slate-300 shadow-md shadow-slate-300"
          : "border-slate-200 hover:border-slate-300 hover:bg-slate-200 hover:shadow-md hover:shadow-slate-300"
      } transition-all duration-300 `}
      onClick={() => handleOptionSelect()}
    >
      <div
        className={`w-4 h-4 border-2 rounded-full ${
          isSelected ? "bg-slate-300 border-slate-400" : "border-slate-300"
        }`}
      ></div>
      <p className="text-slate-600 font-medium">
        <span className="text-slate-700 font-semibold">{option}) </span>
        {optionContent}
      </p>
    </div>
  );
};

export default Option;
