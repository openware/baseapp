import { ThemeName } from '../../charting_library/charting_library.min';
import {
    customWidgetOptions,
    customWidgetParams,
} from '../../custom/tradingChartConfig';

export const widgetParams = {
    interval: '15',
    containerId: 'tv_chart_container',
    ...customWidgetParams,
};

export const widgetOptions = (lightMode?: boolean) => {
    return ({
        allow_symbol_change: false,
        autosize: true,
        calendar: true,
        client_id: 'tradingview.com',
        custom_css_url: '/css/tradingview.css',
        debug: false,
        details: true,
        disabled_features: ['use_localstorage_for_settings', 'header_symbol_search'],
        enable_publishing: false,
        enabled_features: ['show_animated_logo'],
        fullscreen: false,
        height: 610,
        hide_side_toolbar: false,
        hotlist: true,
        library_path: '/charting_library/',
        loading_screen: {
            backgroundColor: lightMode ? '#fff' : '#1E2841',
        },
        overrides: {
            ['symbolWatermarkProperties.color']: lightMode ? '#fff' : '#1E2841',
            ['volumePaneSize']: 'iny',
            ['mainSeriesProperties.candleStyle.upColor']: '#54B489',
            ['mainSeriesProperties.candleStyle.downColor']: '#E85E59',
            ['mainSeriesProperties.candleStyle.borderUpColor']: '#54B489',
            ['mainSeriesProperties.candleStyle.borderDownColor']: '#E85E59',
            ['mainSeriesProperties.candleStyle.wickUpColor']: '#54B489',
            ['mainSeriesProperties.candleStyle.wickDownColor']: '#E85E59',
            ['paneProperties.background']: lightMode ? '#fff' : '#1E2841',
            ['paneProperties.vertGridProperties.color']: lightMode ? '#fff' : '#1E2841',
            ['paneProperties.vertGridProperties.style']: 1,
            ['paneProperties.horzGridProperties.color']: lightMode ? '#fff' : '#1E2841',
            ['paneProperties.horzGridProperties.style']: 1,
            ['paneProperties.crossHairProperties.color']: lightMode ? '#fff' : '#1E2841',
            ['paneProperties.crossHairProperties.width']: 1,
            ['paneProperties.crossHairProperties.style']: 1,
            ['scalesProperties.backgroundColor']: lightMode ? '#fff' : '#1E2841',
        },
        popup_height: '50',
        popup_width: '000',
        show_popup_button: true,
        studies_overrides: {},
        theme: 'Dark' as ThemeName,
        timeframe: '1D',
        toolbar_bg: lightMode ? '#fff' : '#1E2841',
        user_id: 'public_user_id',
        withdateranges: false,
        ...customWidgetOptions,
    });
};
