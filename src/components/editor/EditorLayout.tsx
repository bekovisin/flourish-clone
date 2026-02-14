'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { defaultChartSettings, defaultData, defaultColumnMapping } from '@/lib/chart/config';
import { EditorTopBar } from './EditorTopBar';
import { ChartPreview } from './ChartPreview';
import { DataEditor } from './DataEditor';
import { SettingsPanel } from './SettingsPanel';

interface EditorLayoutProps {
  visualizationId: number;
}

export function EditorLayout({ visualizationId }: EditorLayoutProps) {
  const {
    activeTab,
    settings,
    data,
    columnMapping,
    visualizationName,
    isDirty,
    loadVisualization,
    setIsSaving,
    setIsDirty,
    setLastSavedAt,
  } = useEditorStore();

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load visualization on mount
  useEffect(() => {
    const fetchVisualization = async () => {
      try {
        const res = await fetch(`/api/visualizations/${visualizationId}`);
        if (res.ok) {
          const viz = await res.json();
          const hasData = Array.isArray(viz.data) && viz.data.length > 0;
          const hasSettings = viz.settings && Object.keys(viz.settings).length > 0;
          const hasMapping = viz.columnMapping && Object.keys(viz.columnMapping).length > 0;

          loadVisualization({
            id: viz.id,
            name: viz.name,
            chartType: viz.chartType || 'bar_stacked',
            data: hasData ? viz.data : defaultData,
            settings: hasSettings ? { ...defaultChartSettings, ...viz.settings } : defaultChartSettings,
            columnMapping: hasMapping ? viz.columnMapping : defaultColumnMapping,
          });
        }
      } catch (error) {
        console.error('Failed to load visualization:', error);
      }
    };

    fetchVisualization();
  }, [visualizationId, loadVisualization]);

  // Auto-save
  const saveVisualization = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/visualizations/${visualizationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: visualizationName,
          data,
          settings,
          columnMapping,
        }),
      });
      if (res.ok) {
        setIsDirty(false);
        setLastSavedAt(new Date());
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [visualizationId, visualizationName, data, settings, columnMapping, setIsSaving, setIsDirty, setLastSavedAt]);

  // Debounced auto-save
  useEffect(() => {
    if (!isDirty) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveVisualization();
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isDirty, saveVisualization]);

  const handleExport = async (format: 'png' | 'svg' | 'html' | 'pdf') => {
    const { exportPng } = await import('@/lib/export/exportPng');
    const { exportSvg } = await import('@/lib/export/exportSvg');
    const { exportPdf } = await import('@/lib/export/exportPdf');
    const { exportHtml } = await import('@/lib/export/exportHtml');

    const container = document.getElementById('chart-container');
    if (!container) return;

    switch (format) {
      case 'png':
        await exportPng(container, visualizationName);
        break;
      case 'svg':
        await exportSvg(container, visualizationName);
        break;
      case 'pdf':
        await exportPdf(container, visualizationName);
        break;
      case 'html':
        exportHtml(settings, data, columnMapping, visualizationName);
        break;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <EditorTopBar onExport={handleExport} />
      <div className="flex-1 flex overflow-hidden">
        {/* Main content area */}
        <ChartPreview />
        <DataEditor />

        {/* Settings panel (only shown in preview tab) */}
        {activeTab === 'preview' && <SettingsPanel />}
      </div>
    </div>
  );
}
