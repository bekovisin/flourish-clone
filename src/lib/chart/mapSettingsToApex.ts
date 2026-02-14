import { ChartSettings, ColumnMapping } from '@/types/chart';
import { DataRow } from '@/types/data';
import { getPaletteColors, extendColors } from './palettes';

function parseCustomOverrides(overrides: string): Record<string, string> {
  const map: Record<string, string> = {};
  if (!overrides.trim()) return map;
  overrides.split('\n').forEach((line) => {
    const [key, value] = line.split(':').map((s) => s.trim());
    if (key && value) map[key] = value;
  });
  return map;
}

function resolveColors(settings: ChartSettings['colors'], seriesNames: string[]): string[] {
  let colors = getPaletteColors(settings.palette, settings.customPaletteColors);
  if (settings.extend) {
    colors = extendColors(colors, Math.max(seriesNames.length, colors.length));
  }
  const overrides = parseCustomOverrides(settings.customOverrides);
  return seriesNames.map((name, i) => overrides[name] || colors[i % colors.length]);
}

function buildSeries(data: DataRow[], mapping: ColumnMapping): ApexAxisChartSeries {
  if (!mapping.values || mapping.values.length === 0 || !mapping.labels) return [];

  return mapping.values.map((seriesKey) => ({
    name: seriesKey,
    data: data.map((row) => {
      const val = row[seriesKey];
      return typeof val === 'number' ? val : parseFloat(String(val)) || 0;
    }),
  }));
}

function buildCategories(data: DataRow[], mapping: ColumnMapping): string[] {
  if (!mapping.labels) return [];
  return data.map((row) => String(row[mapping.labels] || ''));
}

function formatNumber(value: number, settings: ChartSettings['numberFormatting']): string {
  let str = value.toFixed(settings.decimalPlaces);
  const [intPart, decPart] = str.split('.');

  let formattedInt = intPart;
  if (settings.thousandsSeparator !== 'none') {
    formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, settings.thousandsSeparator);
  }

  str = decPart ? `${formattedInt}${settings.decimalSeparator}${decPart}` : formattedInt;
  return `${settings.prefix}${str}${settings.suffix}`;
}

export function mapSettingsToApexOptions(
  settings: ChartSettings,
  data: DataRow[],
  mapping: ColumnMapping
): ApexCharts.ApexOptions {
  const isHorizontal = settings.chartType.chartType.startsWith('bar_');
  const isStacked = settings.chartType.chartType.includes('stacked');
  const is100Percent = settings.chartType.chartType.includes('100');
  const seriesNames = mapping.values || [];
  const categories = buildCategories(data, mapping);
  const colors = resolveColors(settings.colors, seriesNames);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      stacked: isStacked,
      stackType: is100Percent ? '100%' : undefined,
      height: settings.chartType.heightMode === 'auto' ? '100%' : settings.chartType.standardHeight,
      background: settings.layout.backgroundColor,
      animations: {
        enabled: settings.animations.enabled,
        speed: settings.animations.duration,
        animateGradually: {
          enabled: settings.animations.type === 'gradual',
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: isHorizontal,
        barHeight: `${Math.max(10, Math.min(100, settings.bars.barHeight * 10))}%`,
        columnWidth: `${Math.max(10, Math.min(100, settings.bars.barHeight * 10))}%`,
        borderRadius: 0,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: settings.labels.dataPointPosition === 'center' ? 'center' : 'top',
        },
      },
    },
    colors,
    fill: {
      opacity: settings.bars.barOpacity,
    },
    stroke: settings.bars.outline
      ? {
          show: true,
          width: settings.bars.outlineWidth,
          colors: [settings.bars.outlineColor],
        }
      : {
          show: true,
          width: 0,
          colors: ['transparent'],
        },
    dataLabels: {
      enabled: settings.labels.showDataPointLabels,
      style: {
        fontSize: `${settings.labels.dataPointFontSize}px`,
        colors: [settings.labels.dataPointColor],
      },
      formatter: (val: number) => formatNumber(val, settings.numberFormatting),
    },
    xaxis: {
      categories,
      position: (() => {
        const pos = settings.xAxis.position;
        if (pos === 'hidden') return 'bottom'; // hidden handled by show:false below
        if (pos === 'top' || pos === 'float_up') return 'top';
        return 'bottom'; // 'bottom', 'float_down'
      })(),
      axisBorder: {
        show: settings.xAxis.position !== 'hidden',
      },
      axisTicks: {
        show: settings.xAxis.position !== 'hidden',
      },
      labels: {
        show: settings.xAxis.position !== 'hidden',
        style: {
          fontFamily: settings.xAxis.tickStyling.fontFamily,
          fontSize: `${settings.xAxis.tickStyling.fontSize}px`,
          fontWeight: settings.xAxis.tickStyling.fontWeight === 'bold' ? 700 : 400,
          colors: settings.xAxis.tickStyling.color,
        },
        formatter: isHorizontal
          ? (val: string) => {
              const num = parseFloat(val);
              return isNaN(num) ? val : formatNumber(num, settings.numberFormatting);
            }
          : undefined,
      },
      title: {
        text: settings.xAxis.titleType === 'custom' ? settings.xAxis.titleText : undefined,
        style: {
          fontFamily: settings.xAxis.titleStyling.fontFamily,
          fontSize: `${settings.xAxis.titleStyling.fontSize}px`,
          fontWeight: settings.xAxis.titleStyling.fontWeight === 'bold' ? 700 : 400,
          color: settings.xAxis.titleStyling.color,
        },
      },
      min: settings.xAxis.min ? parseFloat(settings.xAxis.min) : undefined,
      max: settings.xAxis.max ? parseFloat(settings.xAxis.max) : undefined,
    },
    yaxis: {
      show: settings.yAxis.position !== 'hidden',
      opposite: settings.yAxis.position === 'right',
      logarithmic: settings.yAxis.scaleType === 'log',
      labels: {
        show: settings.yAxis.position !== 'hidden',
        style: {
          fontFamily: settings.yAxis.tickStyling.fontFamily,
          fontSize: `${settings.yAxis.tickStyling.fontSize}px`,
          fontWeight: settings.yAxis.tickStyling.fontWeight === 'bold' ? 700 : 400,
          colors: settings.yAxis.tickStyling.color,
        },
        formatter: !isHorizontal
          ? (val: number) => formatNumber(val, settings.numberFormatting)
          : undefined,
      },
      title: {
        text: settings.yAxis.titleType === 'custom' ? settings.yAxis.titleText : undefined,
        style: {
          fontFamily: settings.yAxis.titleStyling.fontFamily,
          fontSize: `${settings.yAxis.titleStyling.fontSize}px`,
          fontWeight: settings.yAxis.titleStyling.fontWeight === 'bold' ? 700 : 400,
          color: settings.yAxis.titleStyling.color,
        },
      },
      min: settings.yAxis.min ? parseFloat(settings.yAxis.min) : undefined,
      max: settings.yAxis.max ? parseFloat(settings.yAxis.max) : undefined,
    },
    grid: {
      show: true,
      borderColor: settings.xAxis.gridlineStyling.color,
      strokeDashArray: settings.xAxis.gridlineStyling.dashArray,
      xaxis: {
        lines: {
          show: isHorizontal ? settings.xAxis.gridlines : false,
        },
      },
      yaxis: {
        lines: {
          show: isHorizontal ? false : settings.xAxis.gridlines,
        },
      },
      padding: {
        top: settings.layout.paddingTop + 10,
        right: settings.layout.paddingRight + 10,
        bottom: settings.layout.paddingBottom + 10,
        left: settings.layout.paddingLeft + 10,
      },
    },
    legend: {
      show: true,
      position: settings.legend.orientation === 'vertical' ? 'right' : 'bottom',
      horizontalAlign: settings.legend.alignment === 'inline' ? 'center' : settings.legend.alignment as 'left' | 'center' | 'right',
      fontSize: `${settings.legend.size}px`,
      fontFamily: 'Inter, sans-serif',
      fontWeight: settings.legend.textWeight === 'bold' ? 700 : 400,
      labels: {
        colors: settings.legend.color,
      },
      markers: {
        size: settings.legend.swatchWidth / 3,
        shape: settings.legend.swatchRoundness > 5 ? 'circle' : 'square',
        strokeWidth: settings.legend.outline ? 1 : 0,
      },
      itemMargin: {
        horizontal: settings.legend.swatchPadding,
        vertical: 4,
      },
    },
    tooltip: {
      enabled: settings.popupsPanels.showPopup,
      theme: settings.popupsPanels.popupStyle,
      y: {
        formatter: (val: number) => formatNumber(val, settings.numberFormatting),
      },
    },
    // Title and subtitle are rendered in ChartPreview component directly
    // so we don't set them here to avoid ApexCharts offsetY calculation issues
  };

  // Add annotations - only valid ones with text and coordinates
  const validAnnotations = (settings.annotations?.annotations || []).filter(
    (ann) => ann.text && ann.x != null && ann.y != null
  );
  if (validAnnotations.length > 0) {
    options.annotations = {
      points: validAnnotations.map((ann) => ({
        x: String(ann.x),
        y: ann.y,
        label: {
          text: ann.text,
          offsetY: 0,
          style: {
            fontSize: `${ann.fontSize}px`,
            fontWeight: ann.fontWeight === 'bold' ? '700' : '400',
            color: ann.color,
            background: ann.backgroundColor,
          },
        },
      })),
    };
  }

  return options;
}

export function buildChartData(
  data: DataRow[],
  mapping: ColumnMapping,
  settings: ChartSettings
): { series: ApexAxisChartSeries; options: ApexCharts.ApexOptions } {
  const series = buildSeries(data, mapping);
  const options = mapSettingsToApexOptions(settings, data, mapping);

  // Sort data if needed
  if (settings.chartType.sortMode === 'value' && series.length > 0) {
    const totals = data.map((_, i) => {
      return series.reduce((sum, s) => sum + ((s.data[i] as number) || 0), 0);
    });
    const indices = totals.map((_, i) => i).sort((a, b) => totals[b] - totals[a]);

    series.forEach((s) => {
      s.data = indices.map((i) => s.data[i]) as typeof s.data;
    });
    if (options.xaxis && Array.isArray(options.xaxis.categories)) {
      options.xaxis.categories = indices.map((i) => options.xaxis!.categories![i]);
    }
  }

  // Stack sort
  if (settings.chartType.stackSortMode !== 'normal') {
    // Sort each stack's series order
    const sortAsc = settings.chartType.stackSortMode === 'ascending';
    series.sort((a, b) => {
      const sumA = (a.data as number[]).reduce((s, v) => s + (v || 0), 0);
      const sumB = (b.data as number[]).reduce((s, v) => s + (v || 0), 0);
      return sortAsc ? sumA - sumB : sumB - sumA;
    });
  }

  return { series, options };
}
