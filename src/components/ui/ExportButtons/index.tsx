"use client";

import { IconFileTypePdf, IconPrinter } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { printArea } from "@/lib/utils/printArea";
import style from "./style.module.scss";

type ExportButtonsProps = {
  disabled?: boolean;
  filename: string;
};

const TooltipButton = ({
  tooltip,
  disabled,
  onClick,
  children,
}: {
  tooltip: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <span className={style.item} data-tooltip={tooltip}>
    <Button
      size="icon"
      disabled={disabled}
      onClick={onClick}
      aria-label={tooltip}
    >
      {children}
    </Button>
  </span>
);

export const ExportButtons = ({ disabled, filename }: ExportButtonsProps) => {
  return (
    <div className={style.group}>
      <TooltipButton
        tooltip="Print"
        disabled={disabled}
        onClick={() => printArea()}
      >
        <IconPrinter />
      </TooltipButton>
      <TooltipButton
        tooltip="Save PDF"
        disabled={disabled}
        onClick={() => printArea(filename)}
      >
        <IconFileTypePdf />
      </TooltipButton>
    </div>
  );
};
