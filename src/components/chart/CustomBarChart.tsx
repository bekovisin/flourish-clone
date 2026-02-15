'use client';

import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { ChartSettings, ColumnMapping } from '@/types/chart';
import { DataRow } from '@/types/data';
import { getPaletteColors, extendColors } from '@/lib/chart/palettes';

// ─── Types ────────────────────────────────────────────────────────────
interface SeriesData {
  name: string;
  data: number[];
  color: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  category: string;
  series: string;
  value: number;
  color: string;
}

interface CustomBarChartProps {
  data: DataRow[];
  columnMapping: ColumnMapping;
  settings: ChartSettings;
  width: number;
  height?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────
function parseCustomOverrides(overrides: string): Record<string, string> {
  const map: Record<string, string> = {};
  if (!overrides.trim()) return map;
  overrides.split('\n').forEach((line) => {
    const [key, value] = line.split(':').map((s) => s.trim());
    if (key && value) map[key] = value;
  });
  return map;
}

function resolveColors(colorsSettings: ChartSettings['colors'], seriesNames: string[]): string[] {
  let colors = getPaletteColors(colorsSettings.palette, colorsSettings.customPaletteColors);
  if (colorsSettings.extend) {
    colors = extendColors(colors, Math.max(seriesNames.length, colors.length));
  }
  const overrides = parseCustomOverrides(colorsSettings.customOverrides);
  return seriesNames.map((name, i) => overrides[name] || colors[i % colors.length]);
}

function formatNumber(value: number, nf: ChartSettings['numberFormatting']): string {
  let str = value.toFixed(nf.decimalPlaces);
  const [intPart, decPart] = str.split('.');
  let formattedInt = intPart;
  if (nf.thousandsSeparator !== 'none') {
    formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, nf.thousandsSeparator);
  }
  str = decPart ? `${formattedInt}${nf.decimalSeparator}${decPart}` : formattedInt;
  return `${nf.prefix}${str}${nf.suffix}`;
}

function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}

function measureTextWidth(text: string, fontSize: number, fontFamily: string, fontWeight: string): number {
  if (typeof document === 'undefined') return text.length * fontSize * 0.6;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return text.length * fontSize * 0.6;
  ctx.font = `${fontWeight === 'bold' ? 'bold ' : ''}${fontSize}px ${fontFamily}`;
  return ctx.measureText(text).width;
}

function truncateText(text: string, maxWidth: number, fontSize: number, fontFamily: string, fontWeight: string): string {
  const fullWidth = measureTextWidth(text, fontSize, fontFamily, fontWeight);
  if (fullWidth <= maxWidth) return text;
  const ellipsis = '...';
  const ellipsisW = measureTextWidth(ellipsis, fontSize, fontFamily, fontWeight);
  let truncated = text;
  while (truncated.length > 0) {
    truncated = truncated.slice(0, -1);
    if (measureTextWidth(truncated, fontSize, fontFamily, fontWeight) + ellipsisW <= maxWidth) {
      return truncated + ellipsis;
    }
  }
  return ellipsis;
}

function wrapText(text: string, maxWidth: number, fontSize: number, fontFamily: string, fontWeight: string): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = measureTextWidth(testLine, fontSize, fontFamily, fontWeight);
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  // Max 2 lines: second line truncated if needed
  if (lines.length > 2) {
    lines.length = 2;
    lines[1] = truncateText(lines.slice(1).join(' '), maxWidth, fontSize, fontFamily, fontWeight);
  } else if (lines.length === 2) {
    lines[1] = truncateText(lines[1], maxWidth, fontSize, fontFamily, fontWeight);
  }
  return lines.length > 0 ? lines : [text];
}

function generateNiceTicks(min: number, max: number, desiredCount: number = 5): number[] {
  if (max <= min) return [0];
  const range = max - min;
  const roughStep = range / desiredCount;
  const mag = Math.pow(10, Math.floor(Math.log10(roughStep)));
  let step: number;
  const normalized = roughStep / mag;
  if (normalized <= 1.5) step = 1 * mag;
  else if (normalized <= 3) step = 2 * mag;
  else if (normalized <= 7) step = 5 * mag;
  else step = 10 * mag;

  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + step * 0.001; v += step) {
    ticks.push(Math.round(v * 1e10) / 1e10);
  }
  return ticks;
}

// ─── Component ────────────────────────────────────────────────────────
export function CustomBarChart({ data, columnMapping, settings, width, height: heightProp }: CustomBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, category: '', series: '', value: 0, color: '' });
  const [animProgress, setAnimProgress] = useState(settings.animations.enabled ? 0 : 1);

  // Animation
  useEffect(() => {
    if (!settings.animations.enabled) {
      setAnimProgress(1);
      return;
    }
    setAnimProgress(0);
    const start = performance.now();
    const duration = settings.animations.duration;
    let raf: number;
    const animate = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / duration);
      setAnimProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [settings.animations.enabled, settings.animations.duration, data, columnMapping]);

  // ── Build series & categories ──
  const { series, categories, maxVal, minVal } = useMemo(() => {
    if (!columnMapping.values || columnMapping.values.length === 0 || !columnMapping.labels) {
      return { series: [] as SeriesData[], categories: [] as string[], maxVal: 0, minVal: 0 };
    }

    const seriesNames = columnMapping.values;
    const colors = resolveColors(settings.colors, seriesNames);

    let cats = data.map((row) => String(row[columnMapping.labels] || ''));

    let rawSeries: SeriesData[] = seriesNames.map((key, i) => ({
      name: key,
      data: data.map((row) => {
        const val = row[key];
        return typeof val === 'number' ? val : parseFloat(String(val)) || 0;
      }),
      color: colors[i],
    }));

    // Sort by value
    if (settings.chartType.sortMode === 'value' && rawSeries.length > 0) {
      const totals = data.map((_, i) =>
        rawSeries.reduce((sum, s) => sum + (s.data[i] || 0), 0)
      );
      const indices = totals.map((_, i) => i).sort((a, b) => totals[b] - totals[a]);
      rawSeries = rawSeries.map((s) => ({
        ...s,
        data: indices.map((i) => s.data[i]),
      }));
      cats = indices.map((i) => cats[i]);
    }

    // Stack sort
    if (settings.chartType.stackSortMode !== 'normal') {
      const sortAsc = settings.chartType.stackSortMode === 'ascending';
      rawSeries.sort((a, b) => {
        const sumA = a.data.reduce((s, v) => s + (v || 0), 0);
        const sumB = b.data.reduce((s, v) => s + (v || 0), 0);
        return sortAsc ? sumA - sumB : sumB - sumA;
      });
    }

    // Compute stacked totals to find max
    let maxV = 0;
    let minV = 0;
    const numCats = cats.length;
    for (let ci = 0; ci < numCats; ci++) {
      let posSum = 0;
      let negSum = 0;
      for (const s of rawSeries) {
        const v = s.data[ci] || 0;
        if (v >= 0) posSum += v;
        else negSum += v;
      }
      if (posSum > maxV) maxV = posSum;
      if (negSum < minV) minV = negSum;
    }

    const userMin = settings.xAxis.min ? parseFloat(settings.xAxis.min) : undefined;
    const userMax = settings.xAxis.max ? parseFloat(settings.xAxis.max) : undefined;

    return {
      series: rawSeries,
      categories: cats,
      maxVal: userMax !== undefined ? userMax : maxV,
      minVal: userMin !== undefined ? userMin : Math.min(0, minV),
    };
  }, [data, columnMapping, settings.colors, settings.chartType.sortMode, settings.chartType.stackSortMode, settings.xAxis.min, settings.xAxis.max]);

  // ── Layout calculations ──
  const isAboveBars = settings.labels.barLabelStyle === 'above_bars';
  const yAxisRight = settings.yAxis.position === 'right';
  const yAxisHidden = settings.yAxis.position === 'hidden' || isAboveBars;
  const xAxisHidden = settings.xAxis.position === 'hidden';
  const xAxisOnTop = settings.xAxis.position === 'top' || settings.xAxis.position === 'float_up';
  const flipAxis = settings.xAxis.flipAxis;

  const yTickStyle = settings.yAxis.tickStyling;
  const xTickStyle = settings.xAxis.tickStyling;

  // Y-axis label width
  const yAxisLabelWidth = useMemo(() => {
    if (yAxisHidden) return 0;
    if (settings.yAxis.spaceMode === 'fixed') return settings.yAxis.spaceModeValue;
    // Auto: measure longest label
    let maxW = 0;
    for (const cat of categories) {
      const w = measureTextWidth(cat, yTickStyle.fontSize, yTickStyle.fontFamily, yTickStyle.fontWeight);
      if (w > maxW) maxW = w;
    }
    return maxW + 10;
  }, [categories, yAxisHidden, settings.yAxis.spaceMode, settings.yAxis.spaceModeValue, yTickStyle]);

  // X-axis tick generation
  const xTicks = useMemo(() => {
    return generateNiceTicks(minVal, maxVal);
  }, [minVal, maxVal]);

  // Measure first and last tick labels to compute edge padding
  const xTickEdgePadding = useMemo(() => {
    if (xAxisHidden || xTicks.length === 0) return { left: 0, right: 0 };
    const firstLabel = formatNumber(xTicks[0], settings.numberFormatting);
    const lastLabel = formatNumber(xTicks[xTicks.length - 1], settings.numberFormatting);
    const firstW = measureTextWidth(firstLabel, xTickStyle.fontSize, xTickStyle.fontFamily, xTickStyle.fontWeight);
    const lastW = measureTextWidth(lastLabel, xTickStyle.fontSize, xTickStyle.fontFamily, xTickStyle.fontWeight);
    return { left: Math.ceil(firstW / 2) + 2, right: Math.ceil(lastW / 2) + 2 };
  }, [xTicks, xAxisHidden, xTickStyle, settings.numberFormatting]);

  const xAxisHeight = xAxisHidden ? 0 : xTickStyle.fontSize + 20;
  const xAxisTitleHeight = settings.xAxis.titleType === 'custom' && settings.xAxis.titleText ? settings.xAxis.titleStyling.fontSize + 10 : 0;
  const yAxisTitleWidth = settings.yAxis.titleType === 'custom' && settings.yAxis.titleText ? settings.yAxis.titleStyling.fontSize + 10 : 0;
  const tickPadding = settings.yAxis.tickPadding || 0;

  const padding = useMemo(() => {
    const yLabelSpace = yAxisLabelWidth + tickPadding + yAxisTitleWidth;
    const leftEdgePad = Math.max(xTickEdgePadding.left, 10);
    const rightEdgePad = Math.max(xTickEdgePadding.right, 10);

    return {
      top: settings.layout.paddingTop + (xAxisOnTop ? xAxisHeight + xAxisTitleHeight : 0) + 10,
      right: settings.layout.paddingRight + (yAxisRight && !yAxisHidden ? yLabelSpace : 0) + rightEdgePad,
      bottom: settings.layout.paddingBottom + (!xAxisOnTop ? xAxisHeight + xAxisTitleHeight : 0) + 10,
      left: settings.layout.paddingLeft + (!yAxisRight && !yAxisHidden ? yLabelSpace : 0) + leftEdgePad,
    };
  }, [settings.layout, yAxisLabelWidth, tickPadding, yAxisTitleWidth, xAxisHeight, xAxisTitleHeight, yAxisRight, yAxisHidden, xAxisOnTop, xTickEdgePadding]);

  // Bar sizing
  const barHeight = settings.bars.barHeight;
  const spacingMain = settings.bars.spacingMain;
  const labelRowHeight = isAboveBars ? yTickStyle.fontSize + 8 : 0;
  const categoryHeight = barHeight + spacingMain + labelRowHeight;

  const computedChartHeight = categories.length * categoryHeight + padding.top + padding.bottom;
  const svgHeight = heightProp || computedChartHeight;

  const plotWidth = Math.max(1, width - padding.left - padding.right);
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Scale: value -> x position
  const xScale = useCallback((val: number) => {
    if (maxVal <= minVal) return 0;
    const ratio = (val - minVal) / (maxVal - minVal);
    return flipAxis ? plotWidth * (1 - ratio) : plotWidth * ratio;
  }, [minVal, maxVal, plotWidth, flipAxis]);

  // ── Tooltip handlers ──
  const handleBarHover = useCallback((e: React.MouseEvent, cat: string, seriesName: string, value: number, color: string) => {
    if (!settings.popupsPanels.showPopup) return;
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;
    setTooltip({
      visible: true,
      x: e.clientX - svgRect.left,
      y: e.clientY - svgRect.top - 10,
      category: cat,
      series: seriesName,
      value,
      color,
    });
  }, [settings.popupsPanels.showPopup]);

  const handleBarLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  // ── Render ──
  if (width <= 0) return null;

  if (series.length === 0 || categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-40">
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
          </svg>
          <p>Add data in the Data tab to see your chart</p>
        </div>
      </div>
    );
  }

  // Gridline style
  const gridStroke = settings.xAxis.gridlineStyling.color;
  const gridStrokeWidth = settings.xAxis.gridlineStyling.width;
  const gridDashArray = settings.xAxis.gridlineStyling.dashArray > 0
    ? `${settings.xAxis.gridlineStyling.dashArray} ${settings.xAxis.gridlineStyling.dashArray}`
    : undefined;

  // X axis line & tick marks
  const axisLineShow = settings.xAxis.axisLine.show && !xAxisHidden;
  const tickMarksShow = settings.xAxis.tickMarks.show && !xAxisHidden;

  // Legend data
  const legendItems = series.map((s) => ({ name: s.name, color: s.color }));

  // Y axis title
  const yAxisTitle = settings.yAxis.titleType === 'custom' ? settings.yAxis.titleText : '';
  const xAxisTitle = settings.xAxis.titleType === 'custom' ? settings.xAxis.titleText : '';

  // X axis Y position based on position setting
  const xAxisYPos = xAxisOnTop ? padding.top : svgHeight - padding.bottom;
  const xAxisTickDir = xAxisOnTop ? -1 : 1; // ticks go up when on top

  // Y-axis label max width for truncation/wrapping
  const yLabelMaxWidth = yAxisLabelWidth - 4;

  // Legend height estimate for SVG export
  const legendHeight = settings.legend.show ? settings.legend.size + 20 + (settings.legend.marginTop || 0) : 0;
  const totalSvgHeight = svgHeight + legendHeight;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        ref={svgRef}
        width={width}
        height={totalSvgHeight}
        viewBox={`0 0 ${width} ${totalSvgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Background for export */}
        <rect x="0" y="0" width={width} height={totalSvgHeight} fill={settings.layout.backgroundColor || '#ffffff'} />

        {/* Plot background */}
        {settings.plotBackground.backgroundColor && settings.plotBackground.backgroundColor !== 'transparent' && (
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth}
            height={categories.length * categoryHeight}
            fill={settings.plotBackground.backgroundColor}
          />
        )}

        {/* ── Gridlines ── */}
        {settings.xAxis.gridlines && xTicks.map((tick) => {
          const x = padding.left + xScale(tick);
          return (
            <line
              key={`grid-${tick}`}
              x1={x}
              y1={padding.top}
              x2={x}
              y2={padding.top + categories.length * categoryHeight}
              stroke={gridStroke}
              strokeWidth={gridStrokeWidth}
              strokeDasharray={gridDashArray}
            />
          );
        })}

        {/* ── Y axis gridlines ── */}
        {settings.yAxis.gridlines && categories.map((_, ci) => {
          const y = padding.top + ci * categoryHeight + (isAboveBars ? labelRowHeight : 0) + barHeight / 2;
          return (
            <line
              key={`ygrid-${ci}`}
              x1={padding.left}
              y1={y}
              x2={padding.left + plotWidth}
              y2={y}
              stroke={settings.yAxis.gridlineStyling.color}
              strokeWidth={settings.yAxis.gridlineStyling.width}
              strokeDasharray={settings.yAxis.gridlineStyling.dashArray > 0 ? `${settings.yAxis.gridlineStyling.dashArray} ${settings.yAxis.gridlineStyling.dashArray}` : undefined}
            />
          );
        })}

        {/* ── X axis line ── */}
        {axisLineShow && (
          <line
            x1={padding.left}
            y1={xAxisYPos}
            x2={padding.left + plotWidth}
            y2={xAxisYPos}
            stroke={settings.xAxis.axisLine.color}
            strokeWidth={settings.xAxis.axisLine.width}
          />
        )}

        {/* ── X axis ticks & labels ── */}
        {!xAxisHidden && xTicks.map((tick) => {
          const x = padding.left + xScale(tick);
          return (
            <g key={`xtick-${tick}`}>
              {tickMarksShow && (
                <line
                  x1={x}
                  y1={xAxisYPos}
                  x2={x}
                  y2={xAxisYPos + xAxisTickDir * settings.xAxis.tickMarks.length}
                  stroke={settings.xAxis.tickMarks.color}
                  strokeWidth={settings.xAxis.tickMarks.width}
                />
              )}
              <text
                x={x}
                y={xAxisOnTop
                  ? xAxisYPos - (tickMarksShow ? settings.xAxis.tickMarks.length : 0) - 6
                  : xAxisYPos + (tickMarksShow ? settings.xAxis.tickMarks.length : 0) + xTickStyle.fontSize + 4
                }
                textAnchor="middle"
                dominantBaseline={xAxisOnTop ? 'auto' : 'auto'}
                style={{
                  fontSize: xTickStyle.fontSize,
                  fontFamily: xTickStyle.fontFamily,
                  fontWeight: xTickStyle.fontWeight === 'bold' ? 700 : 400,
                  fill: xTickStyle.color,
                }}
              >
                {formatNumber(tick, settings.numberFormatting)}
              </text>
            </g>
          );
        })}

        {/* ── X axis title ── */}
        {xAxisTitle && (
          <text
            x={padding.left + plotWidth / 2}
            y={xAxisOnTop
              ? padding.top - xAxisHeight - 4
              : svgHeight - padding.bottom + xAxisHeight + xAxisTitleHeight - 4
            }
            textAnchor="middle"
            style={{
              fontSize: settings.xAxis.titleStyling.fontSize,
              fontFamily: settings.xAxis.titleStyling.fontFamily,
              fontWeight: settings.xAxis.titleStyling.fontWeight === 'bold' ? 700 : 400,
              fill: settings.xAxis.titleStyling.color,
            }}
          >
            {xAxisTitle}
          </text>
        )}

        {/* ── Y axis title (rotated) ── */}
        {yAxisTitle && (() => {
          const titleX = yAxisRight
            ? width - 12
            : 12;
          const titleY = padding.top + plotHeight / 2;
          return (
            <text
              x={titleX}
              y={titleY}
              textAnchor="middle"
              transform={`rotate(-90, ${titleX}, ${titleY})`}
              style={{
                fontSize: settings.yAxis.titleStyling.fontSize,
                fontFamily: settings.yAxis.titleStyling.fontFamily,
                fontWeight: settings.yAxis.titleStyling.fontWeight === 'bold' ? 700 : 400,
                fill: settings.yAxis.titleStyling.color,
              }}
            >
              {yAxisTitle}
            </text>
          );
        })()}

        {/* ── Bars & Labels ── */}
        {categories.map((cat, ci) => {
          const catY = padding.top + ci * categoryHeight;
          const barY = catY + (isAboveBars ? labelRowHeight : 0);

          // Stacked bars
          let stackX = xScale(Math.max(0, minVal));
          const barElements: React.ReactNode[] = [];
          const labelElements: React.ReactNode[] = [];

          series.forEach((s, si) => {
            const rawValue = s.data[ci] || 0;
            const value = rawValue * animProgress;
            const barW = Math.abs(xScale(Math.max(0, minVal) + Math.abs(value)) - xScale(Math.max(0, minVal)));

            const barX = value >= 0 ? stackX : stackX - barW;

            const inStackSpacing = settings.bars.spacingInStack;
            const actualBarH = barHeight;

            const renderedW = Math.max(0, barW - (inStackSpacing > 0 && !settings.bars.outline ? inStackSpacing : 0));
            barElements.push(
              <rect
                key={`bar-${ci}-${si}`}
                x={padding.left + barX}
                y={barY}
                width={renderedW}
                height={actualBarH}
                fill={s.color}
                fillOpacity={settings.bars.barOpacity}
                stroke={settings.bars.outline ? settings.bars.outlineColor : 'none'}
                strokeWidth={settings.bars.outline ? settings.bars.outlineWidth : 0}
                style={{ cursor: 'pointer', transition: 'fill-opacity 0.15s' }}
                onMouseMove={(e) => handleBarHover(e, cat, s.name, rawValue, s.color)}
                onMouseLeave={handleBarLeave}
              />
            );

            // Data point labels
            if (settings.labels.showDataPointLabels && rawValue !== 0) {
              const labelText = formatNumber(rawValue, settings.numberFormatting);
              const labelPos = settings.labels.dataPointPosition;
              let labelX: number;
              let anchor: 'start' | 'middle' | 'end';

              if (labelPos === 'left') {
                labelX = padding.left + barX + 4;
                anchor = 'start';
              } else if (labelPos === 'right') {
                labelX = padding.left + barX + renderedW - 4;
                anchor = 'end';
              } else {
                labelX = padding.left + barX + renderedW / 2;
                anchor = 'middle';
              }

              const labelColor = settings.labels.dataPointColorMode === 'auto'
                ? getContrastColor(s.color)
                : (settings.labels.dataPointSeriesColors[s.name] || settings.labels.dataPointColor);

              const offsetX = settings.labels.dataPointCustomPadding
                ? settings.labels.dataPointPaddingLeft - settings.labels.dataPointPaddingRight
                : 0;
              const offsetY = settings.labels.dataPointCustomPadding
                ? settings.labels.dataPointPaddingTop - settings.labels.dataPointPaddingBottom
                : 0;

              labelElements.push(
                <text
                  key={`label-${ci}-${si}`}
                  x={labelX + offsetX}
                  y={barY + actualBarH / 2 + offsetY}
                  textAnchor={anchor}
                  dominantBaseline="central"
                  style={{
                    fontSize: settings.labels.dataPointFontSize,
                    fontFamily: settings.labels.dataPointFontFamily,
                    fontWeight: settings.labels.dataPointFontWeight === 'bold' ? 700 : 400,
                    fill: labelColor,
                    pointerEvents: 'none',
                  }}
                >
                  {labelText}
                </text>
              );
            }

            if (value >= 0) stackX += barW;
            else stackX -= barW;
          });

          // Stack labels
          if (settings.labels.stackLabelMode !== 'none') {
            const total = series.reduce((sum, s) => sum + (s.data[ci] || 0), 0);
            const labelText = formatNumber(total, settings.numberFormatting);
            const totalBarW = xScale(Math.max(0, minVal) + Math.abs(total * animProgress)) - xScale(Math.max(0, minVal));

            labelElements.push(
              <text
                key={`stack-label-${ci}`}
                x={padding.left + xScale(Math.max(0, minVal)) + totalBarW + 6}
                y={barY + barHeight / 2}
                textAnchor="start"
                dominantBaseline="central"
                style={{
                  fontSize: settings.labels.dataPointFontSize,
                  fontFamily: settings.labels.dataPointFontFamily,
                  fontWeight: settings.labels.dataPointFontWeight === 'bold' ? 700 : 400,
                  fill: settings.labels.dataPointColor || '#333',
                  pointerEvents: 'none',
                }}
              >
                {labelText}
              </text>
            );
          }

          // Y-axis label rendering with truncation/wrapping
          const renderYAxisLabel = () => {
            if (yAxisHidden || isAboveBars) return null;

            const useFixedWidth = settings.yAxis.spaceMode === 'fixed';
            const maxLabelW = useFixedWidth ? settings.yAxis.spaceModeValue - 4 : yLabelMaxWidth;

            const fullWidth = measureTextWidth(cat, yTickStyle.fontSize, yTickStyle.fontFamily, yTickStyle.fontWeight);
            const needsTruncation = fullWidth > maxLabelW && maxLabelW > 0;

            // Check if label has spaces (can wrap to 2 lines)
            const hasSpaces = cat.includes(' ');

            if (yAxisRight) {
              const labelX = padding.left + plotWidth + tickPadding + 6;
              if (needsTruncation && hasSpaces) {
                // Wrap to 2 lines
                const lines = wrapText(cat, maxLabelW, yTickStyle.fontSize, yTickStyle.fontFamily, yTickStyle.fontWeight);
                const lineHeight = yTickStyle.fontSize * 1.2;
                const totalH = lines.length * lineHeight;
                return lines.map((line, li) => (
                  <text
                    key={`ylabel-${ci}-${li}`}
                    x={labelX}
                    y={barY + barHeight / 2 - totalH / 2 + lineHeight * (li + 0.7)}
                    textAnchor="start"
                    style={{
                      fontSize: yTickStyle.fontSize,
                      fontFamily: yTickStyle.fontFamily,
                      fontWeight: yTickStyle.fontWeight === 'bold' ? 700 : 400,
                      fill: yTickStyle.color,
                    }}
                  >
                    {line}
                  </text>
                ));
              } else {
                const displayText = needsTruncation
                  ? truncateText(cat, maxLabelW, yTickStyle.fontSize, yTickStyle.fontFamily, yTickStyle.fontWeight)
                  : cat;
                return (
                  <text
                    x={labelX}
                    y={barY + barHeight / 2}
                    textAnchor="start"
                    dominantBaseline="central"
                    style={{
                      fontSize: yTickStyle.fontSize,
                      fontFamily: yTickStyle.fontFamily,
                      fontWeight: yTickStyle.fontWeight === 'bold' ? 700 : 400,
                      fill: yTickStyle.color,
                    }}
                  >
                    {displayText}
                  </text>
                );
              }
            } else {
              // Left position
              const labelX = padding.left - tickPadding - 6;
              if (needsTruncation && hasSpaces) {
                const lines = wrapText(cat, maxLabelW, yTickStyle.fontSize, yTickStyle.fontFamily, yTickStyle.fontWeight);
                const lineHeight = yTickStyle.fontSize * 1.2;
                const totalH = lines.length * lineHeight;
                return lines.map((line, li) => (
                  <text
                    key={`ylabel-${ci}-${li}`}
                    x={labelX}
                    y={barY + barHeight / 2 - totalH / 2 + lineHeight * (li + 0.7)}
                    textAnchor="end"
                    style={{
                      fontSize: yTickStyle.fontSize,
                      fontFamily: yTickStyle.fontFamily,
                      fontWeight: yTickStyle.fontWeight === 'bold' ? 700 : 400,
                      fill: yTickStyle.color,
                    }}
                  >
                    {line}
                  </text>
                ));
              } else {
                const displayText = needsTruncation
                  ? truncateText(cat, maxLabelW, yTickStyle.fontSize, yTickStyle.fontFamily, yTickStyle.fontWeight)
                  : cat;
                return (
                  <text
                    x={labelX}
                    y={barY + barHeight / 2}
                    textAnchor="end"
                    dominantBaseline="central"
                    style={{
                      fontSize: yTickStyle.fontSize,
                      fontFamily: yTickStyle.fontFamily,
                      fontWeight: yTickStyle.fontWeight === 'bold' ? 700 : 400,
                      fill: yTickStyle.color,
                    }}
                  >
                    {displayText}
                  </text>
                );
              }
            }
          };

          return (
            <g key={`cat-${ci}`}>
              {/* Above-bars category label */}
              {isAboveBars && (
                <text
                  x={padding.left}
                  y={catY + yTickStyle.fontSize}
                  textAnchor="start"
                  style={{
                    fontSize: yTickStyle.fontSize,
                    fontFamily: yTickStyle.fontFamily,
                    fontWeight: yTickStyle.fontWeight === 'bold' ? 700 : 400,
                    fill: yTickStyle.color,
                  }}
                >
                  {cat}
                </text>
              )}
              {/* Y axis label */}
              {renderYAxisLabel()}
              {barElements}
              {labelElements}
            </g>
          );
        })}

        {/* ── Legend (rendered inside SVG for proper export) ── */}
        {settings.legend.show && (() => {
          const legendY = svgHeight + (settings.legend.marginTop || 0);
          let curX = padding.left;
          const swW = settings.legend.swatchWidth;
          const swH = settings.legend.swatchHeight;
          const gap = settings.legend.swatchPadding || 8;
          const fontSize = settings.legend.size;

          // Compute total width for alignment
          const itemWidths = legendItems.map((item) => {
            const textW = measureTextWidth(item.name, fontSize, settings.legend.fontFamily || 'Inter, sans-serif', settings.legend.textWeight);
            return swW + 4 + textW;
          });
          const totalWidth = itemWidths.reduce((s, w) => s + w, 0) + (legendItems.length - 1) * gap;

          if (settings.legend.alignment === 'center') {
            curX = (width - totalWidth) / 2;
          } else if (settings.legend.alignment === 'right') {
            curX = width - padding.right - totalWidth;
          }

          if (settings.legend.orientation === 'vertical') {
            return legendItems.map((item, idx) => {
              const itemY = legendY + idx * (fontSize + gap);
              const startX = settings.legend.alignment === 'center'
                ? width / 2 - (swW + 4 + measureTextWidth(item.name, fontSize, settings.legend.fontFamily || 'Inter, sans-serif', settings.legend.textWeight)) / 2
                : settings.legend.alignment === 'right'
                  ? width - padding.right - swW - 4 - measureTextWidth(item.name, fontSize, settings.legend.fontFamily || 'Inter, sans-serif', settings.legend.textWeight)
                  : padding.left;
              return (
                <g key={`legend-${idx}`}>
                  <rect
                    x={startX}
                    y={itemY}
                    width={swW}
                    height={swH}
                    fill={item.color}
                    rx={settings.legend.swatchRoundness}
                  />
                  <text
                    x={startX + swW + 4}
                    y={itemY + swH / 2}
                    dominantBaseline="central"
                    style={{
                      fontSize,
                      fontFamily: settings.legend.fontFamily || 'Inter, sans-serif',
                      fontWeight: settings.legend.textWeight === 'bold' ? 700 : 400,
                      fill: settings.legend.color,
                    }}
                  >
                    {item.name}
                  </text>
                </g>
              );
            });
          }

          return legendItems.map((item, idx) => {
            const x = curX;
            curX += itemWidths[idx] + gap;
            return (
              <g key={`legend-${idx}`}>
                <rect
                  x={x}
                  y={legendY}
                  width={swW}
                  height={swH}
                  fill={item.color}
                  rx={settings.legend.swatchRoundness}
                />
                <text
                  x={x + swW + 4}
                  y={legendY + swH / 2}
                  dominantBaseline="central"
                  style={{
                    fontSize,
                    fontFamily: settings.legend.fontFamily || 'Inter, sans-serif',
                    fontWeight: settings.legend.textWeight === 'bold' ? 700 : 400,
                    fill: settings.legend.color,
                  }}
                >
                  {item.name}
                </text>
              </g>
            );
          });
        })()}
      </svg>

      {/* ── Tooltip ── */}
      {tooltip.visible && settings.popupsPanels.showPopup && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            backgroundColor: settings.popupsPanels.popupStyle === 'dark' ? '#333' : '#fff',
            color: settings.popupsPanels.popupStyle === 'dark' ? '#fff' : '#333',
            border: `1px solid ${settings.popupsPanels.popupStyle === 'dark' ? '#555' : '#ddd'}`,
            borderRadius: 6,
            padding: '6px 10px',
            fontSize: 12,
            fontFamily: 'Inter, sans-serif',
            pointerEvents: 'none',
            zIndex: 100,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{tooltip.category}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: tooltip.color,
              }}
            />
            <span>{tooltip.series}: {formatNumber(tooltip.value, settings.numberFormatting)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
