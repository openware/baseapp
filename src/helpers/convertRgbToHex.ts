const componentToHex = (c: string) => {
  const hex = (+c).toString(16);

  return hex.length === 1 ? `0${hex}` : hex;
};

export const convertRgbToHex = (rgb: string): string => {
    const colorCodes = rgb.replace(' ', '').split(',');

    if (colorCodes.length > 2) {
        return `#${componentToHex(colorCodes[0])}${componentToHex(colorCodes[1])}${componentToHex(colorCodes[2])}`;
    }

    return '';
};

