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
  pictures: {
    id: string;
    url: string;
    caption: string;
  }[];
}

export interface FormErrors {
  [key: string]: string | undefined;
  date?: string;
  streamName?: string;
}