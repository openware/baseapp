/* eslint-disable */
import { ThemeName } from '../charting_library/charting_library.min';
import { colors } from '../constants';

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

    return ({
        toolbar_bg: colors.basic.chart.primary,
        loading_screen: {
            backgroundColor:colors.basic.chart.primary,
        },
        overrides: {
            ['symbolWatermarkProperties.color']: colors.basic.chart.primary,
            ['volumePaneSize']: 'iny',
            ['mainSeriesProperties.candleStyle.upColor']: colors.basic.chart.up,
            ['mainSeriesProperties.candleStyle.downColor']: colors.basic.chart.down,
            ['mainSeriesProperties.candleStyle.borderUpColor']: colors.basic.chart.up,
            ['mainSeriesProperties.candleStyle.borderDownColor']: colors.basic.chart.down,
            ['mainSeriesProperties.candleStyle.wickUpColor']: colors.basic.chart.up,
            ['mainSeriesProperties.candleStyle.wickDownColor']: colors.basic.chart.down,
            ['paneProperties.background']: colors.basic.chart.primary,
            ['paneProperties.vertGridProperties.color']: colors.basic.chart.primary,
            ['paneProperties.vertGridProperties.style']: 1,
            ['paneProperties.horzGridProperties.color']: colors.basic.chart.primary,
            ['paneProperties.horzGridProperties.style']: 1,
            ['paneProperties.crossHairProperties.color']: colors.basic.chart.primary,
            ['paneProperties.crossHairProperties.width']: 1,
            ['paneProperties.crossHairProperties.style']: 1,
            ['scalesProperties.backgroundColor']: colors.basic.chart.primary,
        },
        theme: 'Dark' as ThemeName,
    });
};
