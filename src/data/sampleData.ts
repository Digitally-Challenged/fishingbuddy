import { FormData } from '../types';
import dayjs from 'dayjs';

// Generate a random date within the last 3 months
const getRandomRecentDate = () => {
  const end = dayjs();
  const start = end.subtract(3, 'month');
  const randomDate = new Date(
    start.valueOf() + Math.random() * (end.valueOf() - start.valueOf())
  );
  return dayjs(randomDate).format('YYYY-MM-DD');
};

// Sample fishing journal entries
export const sampleEntries: FormData[] = [
  {
    date: getRandomRecentDate(),
    streamName: 'White River',
    windVelocity: '8',
    windDirection: 'SW',
    weatherConditions: 'Partly Cloudy',
    waterClarity: 'Clear',
    usgsGauge: 'WHR234',
    flowRate: '2450',
    riverDepth: '4.2',
    waterTemperature: '58',
    fishSpecies: 'Rainbow Trout',
    numberCaught: '5',
    baitUsed: 'San Juan Worm',
    wifesMood: '😊',
    notes: '',
    pictures: [],
  },
  {
    date: getRandomRecentDate(),
    streamName: 'Buffalo National River',
    windVelocity: '5',
    windDirection: 'SE',
    weatherConditions: 'Sunny',
    waterClarity: 'Stained',
    usgsGauge: 'BNR445',
    flowRate: '850',
    riverDepth: '2.8',
    waterTemperature: '62',
    fishSpecies: 'Smallmouth Bass',
    numberCaught: '3',
    baitUsed: 'Crawfish Pattern',
    wifesMood: '😊',
    notes: '',
    pictures: [],
  },
  {
    date: getRandomRecentDate(),
    streamName: 'Little Red River',
    windVelocity: '12',
    windDirection: 'NW',
    weatherConditions: 'Cloudy',
    waterClarity: 'Clear',
    usgsGauge: 'LRR567',
    flowRate: '1850',
    riverDepth: '3.5',
    waterTemperature: '54',
    fishSpecies: 'Brown Trout',
    numberCaught: '2',
    baitUsed: 'Olive Wooly Bugger',
    wifesMood: '😊',
    notes: '',
    pictures: [],
  },
  {
    date: getRandomRecentDate(),
    streamName: 'Spring River',
    windVelocity: '6',
    windDirection: 'E',
    weatherConditions: 'Sunny',
    waterClarity: 'Clear',
    usgsGauge: 'SPR789',
    flowRate: '950',
    riverDepth: '2.2',
    waterTemperature: '66',
    fishSpecies: 'Walleye',
    numberCaught: '1',
    baitUsed: 'Jig and Minnow',
    wifesMood: '😊',
    notes: '',
    pictures: [],
  },
  {
    date: getRandomRecentDate(),
    streamName: 'Ouachita River',
    windVelocity: '10',
    windDirection: 'S',
    weatherConditions: 'Partly Cloudy',
    waterClarity: 'Stained',
    usgsGauge: 'OUR123',
    flowRate: '1250',
    riverDepth: '3.8',
    waterTemperature: '68',
    fishSpecies: 'Largemouth Bass',
    numberCaught: '4',
    baitUsed: 'Plastic Worm',
    wifesMood: '😊',
    notes: '',
    pictures: [],
  },
];