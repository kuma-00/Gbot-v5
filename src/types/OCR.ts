
export type OCRResponse = {
  ParsedResults: OCRParsedResult[];
  OCRExitCode: number;
  IsErroredOnProcessing: boolean;
  ErrorMessage?: string;
  ErrorDetails?: string;
  SearchablePDFURL: string;
  ProcessingTimeInMilliseconds: string;
};

export type OCRParsedResult = {
  TextOverlay: { Lines: string[]; HasOverlay: boolean; Message: string };
  TextOrientation: string;
  FileParseExitCode: number;
  ParsedText: string;
  ErrorMessage: string;
  ErrorDetails: string;
};
