export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

export const colorPalettes: ColorPalette[] = [
  {
    id: 'default',
    name: 'Default',
    colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800', '#9C27B0', '#00BCD4', '#795548'],
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'],
  },
  {
    id: 'pastel',
    name: 'Pastel',
    colors: ['#B5EAD7', '#C7CEEA', '#FFDAC1', '#FF9AA2', '#E2F0CB', '#F0E6EF', '#A8D8EA', '#FFB7B2'],
  },
  {
    id: 'earth',
    name: 'Earth Tones',
    colors: ['#8B6914', '#CD853F', '#D2691E', '#A0522D', '#6B8E23', '#556B2F', '#8FBC8F', '#BC8F8F'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#003f5c', '#2f4b7c', '#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600'],
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: ['#FF6B6B', '#FFA07A', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6', '#E74C3C', '#F39C12'],
  },
  {
    id: 'corporate',
    name: 'Corporate',
    colors: ['#1B4F72', '#2E86C1', '#85C1E9', '#D4E6F1', '#E74C3C', '#F5B041', '#27AE60', '#8E44AD'],
  },
  {
    id: 'monochrome_blue',
    name: 'Monochrome Blue',
    colors: ['#08306b', '#08519c', '#2171b5', '#4292c6', '#6baed6', '#9ecae1', '#c6dbef', '#deebf7'],
  },
  {
    id: 'monochrome_green',
    name: 'Monochrome Green',
    colors: ['#00441b', '#006d2c', '#238b45', '#41ab5d', '#74c476', '#a1d99b', '#c7e9c0', '#e5f5e0'],
  },
  {
    id: 'monochrome_red',
    name: 'Monochrome Red',
    colors: ['#67000d', '#a50f15', '#cb181d', '#ef3b2c', '#fb6a4a', '#fc9272', '#fcbba1', '#fee0d2'],
  },
  {
    id: 'neon',
    name: 'Neon',
    colors: ['#00ff87', '#60efff', '#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#01a3a4'],
  },
  {
    id: 'retro',
    name: 'Retro',
    colors: ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557', '#f4a261', '#2a9d8f', '#264653'],
  },
];

export function getPaletteColors(paletteId: string): string[] {
  const palette = colorPalettes.find((p) => p.id === paletteId);
  return palette ? palette.colors : colorPalettes[0].colors;
}

export function extendColors(colors: string[], count: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  return result;
}
