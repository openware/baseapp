import { LayoutGrid } from '../components/Grid';

export const defaultLayouts = {
  lg: [
      { x: 16, y: 18, w: 8, h: 21, i: '1', minH: 21, maxH: 21, minW: 4 },
      { x: 0, y: 0, w: 16, h: 39, i: '2', minH: 12, minW: 5 },
      { x: 16, y: 0, w: 4, h: 28, i: '3', minH: 20, minW: 4 },
      { x: 16, y: 38, w: 8, h: 13, i: '4', minH: 12, minW: 5 },
      { x: 0, y: 40, w: 16, h: 23, i: '5', minH: 8, minW: 5 },
      { x: 26, y: 11, w: 4, h: 28, i: '6', minH: 8, minW: 4 },
  ],
  md: [
      { x: 14, y: 30, w: 10, h: 21, i: '1', minH: 21, maxH: 21, minW: 4 },
      { x: 0, y: 0, w: 18, h: 30, i: '2', minH: 12, minW: 5 },
      { x: 0, y: 30, w: 14, h: 13, i: '3', minH: 8, minW: 3 },
      { x: 14, y: 42, w: 10, h: 12, i: '4', minH: 8, minW: 4 },
      { x: 0, y: 42, w: 14, h: 20, i: '5', minH: 6, minW: 5 },
      { x: 18, y: 12, w: 6, h: 30, i: '6', minH: 8, minW: 6 },
  ],
  sm: [
      { x: 0, y: 12, w: 12, h: 22, i: '1', minH: 22, maxH: 22, minW: 5, draggable: false, resizable: false },
      { x: 0, y: 28, w: 12, h: 30, i: '2', minH: 30, minW: 5, draggable: false, resizable: false },
      { x: 0, y: 58, w: 12, h: 18, i: '3', minH: 12, minW: 3, draggable: false, resizable: false },
      { x: 0, y: 94, w: 12, h: 12, i: '4', minH: 12, minW: 7, draggable: false, resizable: false },
      { x: 0, y: 82, w: 12, h: 20, i: '5', minH: 12, minW: 7, draggable: false, resizable: false },
      { x: 30, y: 0, w: 12, h: 16, i: '6', minH: 10, minW: 6, draggable: false, resizable: false },
  ],
};

export const getLayoutFromLS = (key: string): LayoutGrid | undefined => {
    let obj = {};
    if (localStorage) {
        try {
            obj = JSON.parse(localStorage.getItem('rgl') || '') || {};
        } catch (e) {
            // ignore
        }
    }
    return obj[key];
};

export const saveLayoutToLS = (key: string, value): void => {
    if (localStorage) {
        localStorage.setItem(
            'rgl',
            JSON.stringify({[key]: value}),
        );
    }
};

export const resetLayout = (key: string): void => {
    if (localStorage) {
        localStorage.setItem(
            'rgl',
            JSON.stringify({[key]: defaultLayouts}),
        );
    }
};
