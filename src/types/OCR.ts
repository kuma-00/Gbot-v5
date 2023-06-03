
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

export interface Artifact {
  name: string;
  rarity: ('1' | '2' | '3' | '4' | '5')[];
  "1pc"?: string; // for circlets only
  "2pc"?: string;
  "4pc"?: string;
  flower?: ArtifactDetail;
  plume?: ArtifactDetail;
  sands?: ArtifactDetail;
  goblet?: ArtifactDetail;
  circlet: ArtifactDetail;
  images: {
    nameflower?: string;
    nameplume?: string;
    namesands?: string;
    namegoblet?: string;
    namecirclet: string;
    flower?: string;
    plume?: string;
    sands?: string;
    goblet?: string;
    circlet: string;
  };
  url: {
    fandom: string;
  };
  version: string;
}

export interface ArtifactDetail {
  name: string;
  relictype: string; // for different languages
  description: string;
  story: string;
}