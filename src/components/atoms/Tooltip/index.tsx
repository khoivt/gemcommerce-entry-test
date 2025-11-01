import React, { ReactNode } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  children: ReactNode;
  isShow?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "top",
  children,
  isShow = false,
}) => {
  const positionClasses: Record<TooltipPosition, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
    left: "right-full top-1/2 -translate-y-1/2 mr-3",
    right: "left-full top-1/2 -translate-y-1/2 ml-3",
  };

  const arrowClasses: Record<TooltipPosition, string> = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-0 border-b-transparent border-t-[4px] border-t-gray-900",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-0 border-t-transparent border-b-[4px] border-b-gray-900",
    left: "left-full top-1/2 -translate-y-1/2 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-0 border-r-transparent border-l-[4px] border-l-gray-900",
    right:
      "right-full top-1/2 -translate-y-1/2 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-0 border-l-transparent border-r-[4px] border-r-gray-900",
  };

  return (
    <div className="relative group inline-flex">
      {children}

      {/* Tooltip */}
      <div
        className={`absolute ${positionClasses[position]} invisible opacity-0 ${
          isShow && "group-hover:visible group-hover:opacity-100"
        } transition-all duration-200 z-50 whitespace-nowrap`}
      >
        {/* Tooltip content */}
        <div className="px-2 py-1 rounded-lg bg-gray-900 flex items-center justify-center">
          <span className="text-xs text-gray-50 leading-[20px]">{content}</span>
        </div>

        {/* Arrow */}
        <div
          className={`absolute w-0 h-0 border-[4px] ${arrowClasses[position]}`}
        />
      </div>
    </div>
  );
};

export default Tooltip;
