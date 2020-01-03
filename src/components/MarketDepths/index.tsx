import classnames from 'classnames';
import * as React from 'react';

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    TooltipPayload,
    XAxis,
    YAxis,
} from 'recharts';

export interface KeyValuePairMarketDepths {
    x: string | number;
    amt?: number;
    ask?: number;
    bid?: number;
    name?: string | number;
}

export interface ChartStyles {
    fillAreaAsk: string;
    fillAreaBid: string;
    gridBackgroundStart: string;
    gridBackgroundEnd: string;
    strokeAreaAsk: string;
    strokeAreaBid: string;
    strokeGrid: string;
    strokeAxis: string;
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
     * MarketDepths colors for chart
     */
    colors: ChartStyles;
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
    chartType?: 'basis' | 'basisClosed' | 'basisOpen' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
    /**
     * Property for gradient of background of ask or bid
     * @default false
     */
    gradientHide?: boolean;
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

const CustomTooltip = (props: CustomToolTipProps) => {
    const defaultToolTipColors = {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        color: 'black',
        border: '1px solid #ccc',
    };
    const { active, payload, external, toolTipColors = defaultToolTipColors} = props;
    const { backgroundColor, color, border } = toolTipColors;
    const renderPayload = () => {
        if (!payload || !payload[0]) {
            return '';
        }

        const { name, value } = payload[0];
        return <p>{`${name} : `}<em>{value}</em></p>;
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
        const currData = payloadData ?
            external.find((entry: KeyValuePairMarketDepths) => (entry.name === payloadData.name)) :
            null;

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
            className,
            colors,
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

        return (
            <div className={cx}>
                <ResponsiveContainer
                    width="100%"
                    height={settings.height}
                >
                    <AreaChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                        {this.defineGradient(gradientHide)}
                        {hideCartesianGrid ? null : (<CartesianGrid stroke={colors.strokeGrid} strokeDasharray="1 1" fill="url(#fillGrid)" />)}
                        <XAxis
                            dataKey={settings.dataKeyX || 'ask'}
                            interval={intervalX || 'preserveStartEnd'}
                            stroke={colors.strokeAxis}
                        />
                        <YAxis
                            orientation={orientation ? orientation : 'left'}
                            dataKey={settings.dataKeyY || 'bid'}
                            interval={intervalY || 'preserveStartEnd'}
                            stroke={colors.strokeAxis}
                        />
                        {settings.tooltip ?
                            <Tooltip
                                content={<CustomTooltip toolTipColors={toolTipColors} external={data} />}
                            /> : null}
                        <Area
                            type={chartType ? chartType : 'step'}
                            dataKey="bid"
                            stroke={colors.strokeAreaBid}
                            fill="url(#bidChartColor)"
                            activeDot={settings.activeDot}
                        />
                        <Area
                            type={chartType ? chartType : 'step'}
                            dataKey="ask"
                            stroke={colors.strokeAreaAsk}
                            fill="url(#askChartColor)"
                            activeDot={settings.activeDot}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }

    public defineGradient = (value?: boolean) => {
        const {
            colors,
        } = this.props;

        if (value) {
            return (
                <defs>
                    <linearGradient id="bidChartColor" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor={colors.fillAreaBid} />
                    </linearGradient>
                    <linearGradient id="askChartColor" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor={colors.fillAreaAsk} />
                    </linearGradient>
                    <linearGradient id="fillGrid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.gridBackgroundStart} stopOpacity={0} />
                        <stop offset="95%" stopColor={colors.gridBackgroundEnd} stopOpacity={1} />
                    </linearGradient>
                </defs>
            );
        }

        return (
            <defs>
                <linearGradient id="bidChartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.fillAreaBid} stopOpacity={1} />
                    <stop offset="95%" stopColor={colors.fillAreaBid} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="askChartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.fillAreaAsk} stopOpacity={1} />
                    <stop offset="95%" stopColor={colors.fillAreaAsk} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillGrid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.gridBackgroundStart} stopOpacity={0} />
                    <stop offset="95%" stopColor={colors.gridBackgroundEnd} stopOpacity={1} />
                </linearGradient>
            </defs>
        );
    };
}

