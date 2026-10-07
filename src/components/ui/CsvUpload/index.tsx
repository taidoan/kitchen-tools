"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { spreadsheetFileToPasteText } from "@/lib/utils/csv";

const CSV_ACCEPT = ".csv,.tsv,.txt,text/csv,text/tab-separated-values";

const readReportFile = (file: File, onLoad: (text: string) => void) => {
  const reader = new FileReader();
  reader.onload = () => {
    if (!(reader.result instanceof ArrayBuffer)) return;
    onLoad(spreadsheetFileToPasteText(reader.result));
  };
  reader.readAsArrayBuffer(file);
};

type CsvUploadProps = {
  id: string;
  label: string;
  onFile: (text: string) => void;
};

export const CsvUpload = ({ id, label, onFile }: CsvUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        id={id}
        className="sr-only"
        type="file"
        accept={CSV_ACCEPT}
        aria-label={label}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          readReportFile(file, onFile);
        }}
      />
      <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={() => inputRef.current?.click()}
      >
        Upload CSV
      </Button>
    </>
  );
};
