import {
    customWidgetOptions,
    customWidgetParams,
} from '../../custom/tradingChartConfig';

export const widgetParams = {
    interval: '15',
    containerId: 'tv_chart_container',
    ...customWidgetParams,
};

export const widgetOptions = (colorTheme?: string) => {
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
        popup_height: '50',
        popup_width: '000',
        show_popup_button: true,
        studies_overrides: {},
        timeframe: '1D',
        user_id: 'public_user_id',
        withdateranges: false,

        ...customWidgetOptions(colorTheme),
    });
};
