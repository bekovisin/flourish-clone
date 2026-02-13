import { ChartSettings, ColumnMapping } from '@/types/chart';
import { DataRow } from '@/types/data';
import { buildChartData } from '@/lib/chart/mapSettingsToApex';

export function exportHtml(
  settings: ChartSettings,
  data: DataRow[],
  columnMapping: ColumnMapping,
  filename: string
) {
  const { series, options } = buildChartData(data, columnMapping, settings);
  const chartHeight =
    settings.chartType.heightMode === 'auto'
      ? Math.max(300, data.length * 45 + 100)
      : settings.chartType.standardHeight;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    #chart-wrapper {
      max-width: ${settings.layout.maxWidth > 0 ? settings.layout.maxWidth + 'px' : '100%'};
      margin: 0 auto;
      background: ${settings.layout.backgroundColor};
      padding: ${settings.layout.paddingTop}px ${settings.layout.paddingRight}px ${settings.layout.paddingBottom}px ${settings.layout.paddingLeft}px;
    }
    .header { padding: 20px 24px 0; text-align: ${settings.header.alignment}; }
    .header h2 {
      font-size: ${settings.header.titleStyling.fontSize}px;
      font-weight: ${settings.header.titleStyling.fontWeight === 'bold' ? 700 : 400};
      color: ${settings.header.titleStyling.color};
      margin-bottom: 4px;
    }
    .header .subtitle {
      font-size: ${settings.header.subtitleStyling.fontSize}px;
      color: ${settings.header.subtitleStyling.color};
      margin-bottom: 4px;
    }
    .footer { padding: 8px 24px 16px; text-align: ${settings.footer.alignment}; }
    .footer p { font-size: ${settings.footer.size}px; color: ${settings.footer.color}; }
    #chart { background: ${settings.plotBackground.backgroundColor}; }
  </style>
</head>
<body>
  <div id="chart-wrapper">
    ${settings.header.title || settings.header.subtitle ? `
    <div class="header">
      ${settings.header.title ? `<h2>${settings.header.title}</h2>` : ''}
      ${settings.header.subtitle ? `<p class="subtitle">${settings.header.subtitle}</p>` : ''}
    </div>` : ''}
    <div id="chart"></div>
    ${settings.footer.sourceName ? `
    <div class="footer">
      <p>${settings.footer.sourceLabel}: ${settings.footer.sourceName}</p>
    </div>` : ''}
  </div>
  <script>
    var options = ${JSON.stringify(options, null, 2)};
    options.chart.height = ${chartHeight};
    var chart = new ApexCharts(document.querySelector("#chart"), {
      ...options,
      series: ${JSON.stringify(series)}
    });
    chart.render();
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${filename.replace(/[^a-zA-Z0-9-_]/g, '_')}.html`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
