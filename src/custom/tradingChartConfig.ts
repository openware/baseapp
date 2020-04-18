/* eslint-disable */
import { ThemeName } from '../charting_library/charting_library.min';
import { colors } from '../constants';
import { convertRgbToHex, getStylesValueByKey } from '../helpers';

export const customWidgetParams = {};

export const customWidgetOptions = (colorTheme?: string) => {
    if (colorTheme === 'light') {
        return ({
            toolbar_bg: colors.light.chart.primary,
            loading_screen: {
                backgroundColor: colors.light.chart.primary,
            },
            overrides: {
                ['symbolWatermarkProperties.color']: colors.light.chart.primary,
                ['volumePaneSize']: 'iny',
                ['mainSeriesProperties.candleStyle.upColor']: colors.light.chart.up,
                ['mainSeriesProperties.candleStyle.downColor']: colors.light.chart.down,
                ['mainSeriesProperties.candleStyle.borderUpColor']: colors.light.chart.up,
                ['mainSeriesProperties.candleStyle.borderDownColor']: colors.light.chart.down,
                ['mainSeriesProperties.candleStyle.wickUpColor']: colors.light.chart.up,
                ['mainSeriesProperties.candleStyle.wickDownColor']: colors.light.chart.down,
                ['paneProperties.background']:  colors.light.chart.primary,
                ['paneProperties.vertGridProperties.color']: colors.light.chart.primary,
                ['paneProperties.vertGridProperties.style']: 1,
                ['paneProperties.horzGridProperties.color']: colors.light.chart.primary,
                ['paneProperties.horzGridProperties.style']: 1,
                ['paneProperties.crossHairProperties.color']: colors.light.chart.primary,
                ['paneProperties.crossHairProperties.width']: 1,
                ['paneProperties.crossHairProperties.style']: 1,
                ['scalesProperties.backgroundColor']: colors.light.chart.primary,
            },
            theme: 'Light' as ThemeName,
        });
    }

    const primaryColor = convertRgbToHex(getStylesValueByKey(colors.basic.chart.primary));
    const upColor = convertRgbToHex(getStylesValueByKey(colors.basic.chart.up));
    const downColor = convertRgbToHex(getStylesValueByKey(colors.basic.chart.down));

    return ({
        toolbar_bg: primaryColor,
        loading_screen: {
            backgroundColor: primaryColor,
        },
        overrides: {
            ['symbolWatermarkProperties.color']: primaryColor,
            ['volumePaneSize']: 'iny',
            ['mainSeriesProperties.candleStyle.upColor']: upColor,
            ['mainSeriesProperties.candleStyle.downColor']: downColor,
            ['mainSeriesProperties.candleStyle.borderUpColor']: upColor,
            ['mainSeriesProperties.candleStyle.borderDownColor']: downColor,
            ['mainSeriesProperties.candleStyle.wickUpColor']: upColor,
            ['mainSeriesProperties.candleStyle.wickDownColor']: downColor,
            ['paneProperties.background']: primaryColor,
            ['paneProperties.vertGridProperties.color']: primaryColor,
            ['paneProperties.vertGridProperties.style']: 1,
            ['paneProperties.horzGridProperties.color']: primaryColor,
            ['paneProperties.horzGridProperties.style']: 1,
            ['paneProperties.crossHairProperties.color']: primaryColor,
            ['paneProperties.crossHairProperties.width']: 1,
            ['paneProperties.crossHairProperties.style']: 1,
            ['scalesProperties.backgroundColor']: primaryColor,
        },
        studies_overrides: {
            ['volume.volume.color.0']: downColor,
            ['volume.volume.color.1']: upColor,
        },
        theme: 'Dark' as ThemeName,
    });
};
