import classnames from 'classnames';
import * as React from 'react';

// import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipPayload, XAxis, YAxis } from 'recharts';

import AreaChart from 'recharts/lib/chart/AreaChart';
import Tooltip from 'recharts/lib/component/Tooltip';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import CartesianGrid from 'recharts/lib/cartesian/CartesianGrid';
import Area from 'recharts/lib/cartesian/Area';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';
import { TooltipPayload } from 'recharts/lib/numberAxis/Funnel';

import { colors } from '../../constants';
import { convertRgbToHex, getStylesValueByKey } from '../../helpers';

export interface KeyValuePairMarketDepths {
    x: string | number;
    amt?: number;
    ask?: number;
    bid?: number;
    name?: string | number;
}

export interface TooltipColors {
    backgroundColor: string;
    color: string;
    border: string;
}

type TooltipPayloadProp = TooltipPayload & { payload?: TooltipPayload };

interface CustomToolTipProps {
    toolTipColors?: TooltipColors;
    active?: boolean;
    external: KeyValuePairMarketDepths[];
    payload?: TooltipPayloadProp[];
}

interface CustomActiveDotProps {
    stroke: string;
    strokeWidth: number;
    r: number;
    fill: string;
}

export interface MarketDepthsProps {
    /**
     * Additional class name for styling. By default element receives `cr-market-depths`
     * class
     * @default empty
     */
    className?: string;
    /**
     * MarketDepths details data for building the plot
     */
    data: KeyValuePairMarketDepths[];
    /**
     * Defines colors of tooltip
     */
    toolTipColors?: TooltipColors;
    /**
     * Settings to be applied to a chart
     */
    settings?: MarketDepthsSettings;
    /**
     * If true, grid will be hidden
     * @default false
     */
    hideCartesianGrid?: boolean;
    /**
     * Defines interval of values that should be displayed on x-axis
     */
    intervalX?: number | 'preserveStartEnd' | 'preserveStart' | 'preserveEnd' | undefined;
    /**
     * Defines interval of values that should be displayed on y-axis
     */
    intervalY?: number | 'preserveStartEnd' | 'preserveStart' | 'preserveEnd' | undefined;
    /**
     * Orientation for y-axis
     * @default 'left'
     */
    orientation?: 'left' | 'right';
    /**
     * Chart type
     * @default 'step'
     */
    chartType?:
        | 'basis'
        | 'basisClosed'
        | 'basisOpen'
        | 'linear'
        | 'linearClosed'
        | 'natural'
        | 'monotoneX'
        | 'monotoneY'
        | 'monotone'
        | 'step'
        | 'stepBefore'
        | 'stepAfter';
    /**
     * Property for gradient of background of ask or bid
     * @default false
     */
    gradientHide?: boolean;
    /**
     * Current color theme mode
     *  @default 'dark'
     */
    colorTheme?: string;
}

export interface MarketDepthsSettings {
    /**
     * Defines what value should be displayed on x-axis
     */
    dataKeyX?: string;
    /**
     * Defines what value should be displayed on y-axis
     */
    dataKeyY?: string;
    /**
     * Defines whether tooltip is shown or nor
     * @default true
     */
    tooltip?: boolean;
    /**
     * Defines height of chart
     * @default 100%
     */
    height?: string;
    /**
     * Defines properties for active dot
     */
    activeDot?: CustomActiveDotProps;
}

const getColorSettings = (colorTheme?: string) => {
    if (colorTheme === 'light') {
        return {
            strokeAreaAskColor: colors.light.depth.strokeAreaAsk,
            strokeAreaBidColor: colors.light.depth.strokeAreaBid,
            strokeAxisColor: colors.light.depth.strokeAxis,
            strokeGridColor: colors.light.depth.strokeGrid,
            fillAreaAskColor: colors.light.depth.fillAreaAsk,
            fillAreaBidColor: colors.light.depth.fillAreaBid,
            gridBackgroundStartColor: colors.light.depth.gridBackgroundStart,
            gridBackgroundEndColor: colors.light.depth.gridBackgroundEnd,
        };
    }

    return {
        strokeAreaAskColor: convertRgbToHex(getStylesValueByKey(colors.dark.depth.strokeAreaAsk)),
        strokeAreaBidColor: convertRgbToHex(getStylesValueByKey(colors.dark.depth.strokeAreaBid)),
        strokeAxisColor: convertRgbToHex(getStylesValueByKey(colors.dark.depth.strokeAxis)),
        strokeGridColor: convertRgbToHex(getStylesValueByKey(colors.dark.depth.strokeGrid)),
        fillAreaAskColor: convertRgbToHex(getStylesValueByKey(colors.dark.depth.fillAreaAsk)),
        fillAreaBidColor: convertRgbToHex(getStylesValueByKey(colors.dark.depth.fillAreaBid)),
        gridBackgroundStartColor: convertRgbToHex(getStylesValueByKey(colors.dark.depth.gridBackgroundStart)),
        gridBackgroundEndColor: convertRgbToHex(getStylesValueByKey(colors.dark.depth.gridBackgroundEnd)),
    };
};

const CustomTooltip = (props: CustomToolTipProps) => {
    const defaultToolTipColors = {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        color: 'black',
        border: '1px solid #ccc',
    };
    const { active, payload, external, toolTipColors = defaultToolTipColors } = props;
    const { backgroundColor, color, border } = toolTipColors;
    const renderPayload = () => {
        if (!payload || !payload[0]) {
            return '';
        }

        const { name, value } = payload[0];

        return (
            <p>
                {`${name} : `}
                <em>{value}</em>
            </p>
        );
    };

    if (active) {
        const style = {
            padding: 6,
            backgroundColor,
            border,
            color,
            fontSize: 13,
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        };
        const payloadData = payload && payload[0] ? payload[0].payload : null;
        const currData = payloadData
            ? external.find((entry: KeyValuePairMarketDepths) => entry.name === payloadData.name)
            : null;

        return (
            <div className="area-chart-tooltip" style={style}>
                {!currData ? renderPayload() : null}
                <p>{currData ? currData.name : null}</p>
            </div>
        );
    }

    return null;
};

/**
 * Component to display MarketDepths component.
 * It gives a visualization of demand or supply of a particular stock or commodity or a cryptocurrency.
 */
export class MarketDepths extends React.PureComponent<MarketDepthsProps> {
    public defaultSettings = {
        dataKeyX: 'ask',
        dataKeyY: 'bid',
        tooltip: true,
        height: '100%',
        activeDot: {
            stroke: 'rgba(31,42,52,1)',
            strokeWidth: 1,
            r: 4,
            fill: 'rgba(91,165,132,1)',
        },
    };

    public render() {
        const {
            chartType,
            colorTheme,
            className,
            data,
            hideCartesianGrid,
            intervalX,
            intervalY,
            toolTipColors,
            settings = this.defaultSettings,
            orientation,
            gradientHide,
        } = this.props;
        const cx = classnames('cr-market-depths', className);
        const colorSettings = getColorSettings(colorTheme);

        return (
            <div className={cx}>
                <ResponsiveContainer width="100%" height={settings.height}>
                    <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        {this.defineGradient(colorSettings, gradientHide)}
                        {hideCartesianGrid ? null : (
                            <CartesianGrid
                                stroke={colorSettings.strokeGridColor}
                                strokeDasharray="1 1"
                                fill="url(#fillGrid)"
                            />
                        )}
                        <XAxis
                            dataKey={settings.dataKeyX || 'ask'}
                            interval={intervalX || 'preserveStartEnd'}
                            stroke={colorSettings.strokeAxisColor}
                        />
                        <YAxis
                            orientation={orientation ? orientation : 'left'}
                            dataKey={settings.dataKeyY || 'bid'}
                            interval={intervalY || 'preserveStartEnd'}
                            stroke={colorSettings.strokeAxisColor}
                        />
                        {settings.tooltip ? (
                            <Tooltip content={<CustomTooltip toolTipColors={toolTipColors} external={data} />} />
                        ) : null}
                        <Area
                            type={chartType ? chartType : 'step'}
                            dataKey="bid"
                            stroke={colorSettings.strokeAreaBidColor}
                            fill="url(#bidChartColor)"
                            activeDot={settings.activeDot}
                        />
                        <Area
                            type={chartType ? chartType : 'step'}
                            dataKey="ask"
                            stroke={colorSettings.strokeAreaAskColor}
                            fill="url(#askChartColor)"
                            activeDot={settings.activeDot}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }

    public defineGradient = (colorSettings, value?: boolean) => {
        if (value) {
            return (
                <defs>
                    <linearGradient id="bidChartColor" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor={colorSettings.fillAreaBidColor} />
                    </linearGradient>
                    <linearGradient id="askChartColor" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor={colorSettings.fillAreaAskColor} />
                    </linearGradient>
                    <linearGradient id="fillGrid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colorSettings.gridBackgroundStartColor} stopOpacity={0} />
                        <stop offset="95%" stopColor={colorSettings.gridBackgroundEndColor} stopOpacity={1} />
                    </linearGradient>
                </defs>
            );
        }

        return (
            <defs>
                <linearGradient id="bidChartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorSettings.fillAreaBidColor} stopOpacity={1} />
                    <stop offset="95%" stopColor={colorSettings.fillAreaBidColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="askChartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorSettings.fillAreaAskColor} stopOpacity={1} />
                    <stop offset="95%" stopColor={colorSettings.fillAreaAskColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillGrid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorSettings.gridBackgroundStartColor} stopOpacity={0} />
                    <stop offset="95%" stopColor={colorSettings.gridBackgroundEndColor} stopOpacity={1} />
                </linearGradient>
            </defs>
        );
    };
}
