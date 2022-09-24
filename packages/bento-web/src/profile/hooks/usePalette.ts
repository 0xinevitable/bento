import { useMemo } from 'react';

type RGBAObject = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

export const toTwoDigitHex = (value: string) =>
  value.length === 1 //
    ? value + value
    : value;
export const stringifyRGBAObject = ({ red, green, blue, alpha }: RGBAObject) =>
  `rgba(${red}, ${green}, ${blue}, ${alpha})`;

export const parseHexColor = (value: string) => {
  const hexColor = value.replace('#', '');
  let red: string, green: string, blue: string, alpha: string | undefined;

  switch (hexColor.length) {
    default:
      [red, green, blue] = hexColor.split('').map(toTwoDigitHex);
      break;
    case 4:
      [red, green, blue, alpha] = hexColor.split('').map(toTwoDigitHex);
      break;
    case 6:
      [red, green, blue] = [
        hexColor.substring(0, 2),
        hexColor.substring(2, 4),
        hexColor.substring(4, 6),
      ].map(toTwoDigitHex);
      break;
    case 8:
      [red, green, blue, alpha] = [
        hexColor.substring(0, 2),
        hexColor.substring(2, 4),
        hexColor.substring(4, 6),
        hexColor.substring(6, 8),
      ].map(toTwoDigitHex);
      break;
  }

  return {
    red: parseInt(red, 16),
    green: parseInt(green, 16),
    blue: parseInt(blue, 16),
    alpha: alpha //
      ? parseFloat((parseInt(alpha, 16) / 255).toFixed(2))
      : 1,
  };
};

export const lighten = (color: RGBAObject, value: number) => {
  const { red, green, blue, alpha } = color;
  return {
    red: red + value,
    green: green + value,
    blue: blue + value,
    alpha,
  };
};

export const opacity = (color: RGBAObject, value: number) => ({
  ...color,
  alpha: color.alpha * value,
});

export type Palette = {
  primary: string;
  primaryShadow: string;
  dark: string;
  darkShadow: string;
};

export const usePalette = (hexColor: string) => {
  const palette = useMemo(() => {
    const color = parseHexColor(hexColor);
    const dark = lighten(color, -45);

    return {
      primary: hexColor,
      primaryShadow: stringifyRGBAObject(opacity(color, 0.85)),
      dark: stringifyRGBAObject(dark),
      darkShadow: stringifyRGBAObject(opacity(dark, 0.85)),
    };
  }, [hexColor]);

  return palette;
};
