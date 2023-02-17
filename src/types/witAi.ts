export type MessageResponseJson = {
  text: string;
  intents: Intents[] | undefined;
  entities: Record<string, Entities[] | undefined>;
  traits: Record<string, Traits[]>;
};

export type MessageError = { error: string; code: string };

export type Intents = {
  id: string;
  name: string;
  confidence: number;
};

export type WitAiValue = {
  type: "value";
  grain?: string;
  product?: string;
  domain: string;
  value: string | number;
};

export type WitAiInterval = {
  type: "interval";
  grain?: string;
  value: string | number;
  from?: {
    unit: string;
    product?: string;
    value: number;
  };
  to?: {
    unit: string;
    product?: string;
    value: number;
  };
};

export type WitAiResolved = {
  type: "resolved";
  resolved: {
    values: any[];
  };
};

export type Entities = EntitiesValue | EntitiesInterval | EntitiesResolved;

export type EntitiesBase = {
  id: string;
  name: string;
  role: string;
  start: number;
  end: number;
  body: string;
  confidence: number;
  entities: any[];
  suggested: boolean;
  normalized?: {
    unit: "second";
    value: number;
  };
  second?: number;
  resolved?: any;
};

export type EntitiesValue = EntitiesBase & WitAiValue;

export type EntitiesInterval = EntitiesBase & WitAiInterval;

export type EntitiesResolved = EntitiesBase & WitAiResolved;

export type Traits = {
  id: string;
  value: string;
  confidence: number;
};
