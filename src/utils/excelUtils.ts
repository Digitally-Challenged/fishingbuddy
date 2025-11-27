import * as XLSX from 'xlsx';
import { FormData } from '../types';
import dayjs from 'dayjs';

export function exportToExcel(entries: FormData[]): void {
  // Transform entries for Excel format
  const excelData = entries.map(entry => ({
    'Date': dayjs(entry.date).format('MM/DD/YYYY'),
    'Location': entry.streamName,
    'Species': entry.fishSpecies || '-',
    'Number Caught': entry.numberCaught || '0',
    'Weather': entry.weatherConditions || '-',
    'Wind Direction': entry.windDirection || '-',
    'Wind Velocity': entry.windVelocity ? `${entry.windVelocity} mph` : '-',
    'Water Clarity': entry.waterClarity || '-',
    'USGS Gauge': entry.usgsGauge || '-',
    'Flow Rate': entry.flowRate ? `${entry.flowRate} cfs` : '-',
    'River Depth': entry.riverDepth ? `${entry.riverDepth} ft` : '-',
    'Water Temperature': entry.waterTemperature ? `${entry.waterTemperature}°F` : '-',
    'Bait Used': entry.baitUsed || '-',
  }));

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Auto-size columns
  const colWidths = Object.keys(excelData[0] || {}).map(key => ({
    wch: Math.max(key.length, 15)
  }));
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Fishing Journal');

  // Generate filename with current date
  const fileName = `fishing-journal-${dayjs().format('YYYY-MM-DD')}.xlsx`;

  // Save file
  XLSX.writeFile(wb, fileName);
} 