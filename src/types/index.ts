export interface FormData {
  date: string;
  streamName: string;
  windVelocity: string;
  windDirection: string;
  weatherConditions: string;
  waterClarity: string;
  usgsGauge: string;
  flowRate: string;
  riverDepth: string;
  waterTemperature: string;
  fishSpecies: string;
  numberCaught: string;
  baitUsed: string;
  notes: string;
  pictures: Picture[];
  wifesMood: string;
  // Weather backfill fields
  airTempHigh: string;
  airTempLow: string;
  barometricPressure: string;
  moonPhase: string;
  precipitation: string;
}

export interface Picture {
  id: string;
  url: string;
  caption: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
  date?: string;
  streamName?: string;
}

export type FormChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export type CustomChangeEvent = {
  target: {
    name: string;
    value: string;
  };
};

export type FormChangeHandler = (e: FormChangeEvent | CustomChangeEvent) => void;
