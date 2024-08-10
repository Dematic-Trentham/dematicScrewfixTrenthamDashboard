import React from "react";

import { cn } from "@/utils/cn";

interface HorizontalBarProps {
  width?: string;
  styles?: string;
}

const HorizontalBar: React.FC<HorizontalBarProps> = ({ width, styles }) => {
  return <div className={cn(styles, "w-5 bg-blue-500 h-1 rounded-r-full opacity-50 ml-0")} style={{ width }} />;
};

export default HorizontalBar;
