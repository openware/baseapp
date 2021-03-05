export interface FontPresetInterface {
  key: string;
  title: string;
  url: string;
}

export const FONT_PRESETS: FontPresetInterface[] = [
  {
    key: 'roboto',
    title: 'Roboto',
    url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap',
  },
  {
    key: 'ibm-plex-sans',
    title: 'IBM Plex Sans',
    url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap',
  },
  {
    key: 'poppins',
    title: 'Poppins',
    url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  },
];
