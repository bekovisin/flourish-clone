'use client';

import { useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useEditorStore } from '@/store/editorStore';
import { buildChartData } from '@/lib/chart/mapSettingsToApex';
import { ResponsiveToolbar } from './ResponsiveToolbar';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const deviceWidths: Record<string, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
  fullscreen: '100%',
};

export function ChartPreview() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { settings, data, columnMapping, previewDevice, customPreviewWidth, customPreviewHeight, activeTab } = useEditorStore();

  const { series, options } = useMemo(
    () => buildChartData(data, columnMapping, settings),
    [data, columnMapping, settings]
  );

  const chartHeight =
    settings.chartType.heightMode === 'auto'
      ? Math.max(300, data.length * 45 + 100)
      : settings.chartType.standardHeight;

  if (activeTab !== 'preview') return null;

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-center py-2 px-4 border-b bg-white">
        <ResponsiveToolbar />
      </div>

      {/* Chart container */}
      <div className="flex-1 overflow-auto p-6 flex justify-center">
        <div
          ref={chartRef}
          id="chart-container"
          className="bg-white rounded-lg shadow-sm border transition-all duration-300"
          style={{
            width: previewDevice === 'custom' ? `${customPreviewWidth}px` : deviceWidths[previewDevice],
            height: previewDevice === 'custom' ? `${customPreviewHeight}px` : undefined,
            overflow: previewDevice === 'custom' ? 'auto' : undefined,
            maxWidth: settings.layout.maxWidth > 0 ? settings.layout.maxWidth : undefined,
            backgroundColor: settings.layout.backgroundColor,
          }}
        >
          {/* Header */}
          {(settings.header.title || settings.header.subtitle || settings.header.text) && (
            <div
              className="px-6 pt-5"
              style={{
                textAlign: settings.header.alignment,
                borderTop:
                  settings.header.border === 'top' || settings.header.border === 'both'
                    ? '2px solid #e5e7eb'
                    : undefined,
                borderBottom:
                  settings.header.border === 'bottom' || settings.header.border === 'both'
                    ? '2px solid #e5e7eb'
                    : undefined,
              }}
            >
              {settings.header.title && (
                <h2
                  style={{
                    fontFamily: settings.header.titleStyling.fontFamily,
                    fontSize: settings.header.titleStyling.fontSize,
                    fontWeight: settings.header.titleStyling.fontWeight === 'bold' ? 700 : 400,
                    color: settings.header.titleStyling.color,
                    lineHeight: settings.header.titleStyling.lineHeight,
                    margin: 0,
                    marginBottom: 4,
                  }}
                >
                  {settings.header.title}
                </h2>
              )}
              {settings.header.subtitle && (
                <p
                  style={{
                    fontFamily: settings.header.subtitleStyling.fontFamily,
                    fontSize: settings.header.subtitleStyling.fontSize,
                    fontWeight: settings.header.subtitleStyling.fontWeight === 'bold' ? 700 : 400,
                    color: settings.header.subtitleStyling.color,
                    lineHeight: settings.header.subtitleStyling.lineHeight,
                    margin: 0,
                    marginBottom: 4,
                  }}
                >
                  {settings.header.subtitle}
                </p>
              )}
              {settings.header.text && (
                <p
                  style={{
                    fontFamily: settings.header.textStyling.fontFamily,
                    fontSize: settings.header.textStyling.fontSize,
                    fontWeight: settings.header.textStyling.fontWeight === 'bold' ? 700 : 400,
                    color: settings.header.textStyling.color,
                    lineHeight: settings.header.textStyling.lineHeight,
                    margin: 0,
                  }}
                >
                  {settings.header.text}
                </p>
              )}
            </div>
          )}

          {/* Chart */}
          <div
            className="px-4"
            style={{
              backgroundColor: settings.plotBackground.backgroundColor,
              border: settings.plotBackground.border
                ? `${settings.plotBackground.borderWidth}px solid ${settings.plotBackground.borderColor}`
                : undefined,
            }}
          >
            {series.length > 0 ? (
              <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={chartHeight}
              />
            ) : (
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
            )}
          </div>

          {/* Footer */}
          {(settings.footer.sourceName || settings.footer.notePrimary) && (
            <div
              className="px-6 pb-4 pt-2"
              style={{
                textAlign: settings.footer.alignment,
                borderTop:
                  settings.footer.border === 'top' || settings.footer.border === 'both'
                    ? '1px solid #e5e7eb'
                    : undefined,
                borderBottom:
                  settings.footer.border === 'bottom' || settings.footer.border === 'both'
                    ? '1px solid #e5e7eb'
                    : undefined,
              }}
            >
              {settings.footer.sourceName && (
                <p
                  style={{
                    fontSize: settings.footer.size,
                    color: settings.footer.color,
                    margin: 0,
                  }}
                >
                  {settings.footer.sourceLabel}:{' '}
                  {settings.footer.sourceUrl ? (
                    <a
                      href={settings.footer.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {settings.footer.sourceName}
                    </a>
                  ) : (
                    settings.footer.sourceName
                  )}
                </p>
              )}
              {settings.footer.notePrimary && (
                <p
                  style={{
                    fontSize: settings.footer.size - 1,
                    color: settings.footer.color,
                    margin: '4px 0 0 0',
                    opacity: 0.8,
                  }}
                >
                  {settings.footer.notePrimary}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
