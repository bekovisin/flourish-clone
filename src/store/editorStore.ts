import { create } from 'zustand';
import { ChartSettings, ColumnMapping } from '@/types/chart';
import { DataRow } from '@/types/data';
import { defaultChartSettings, defaultData, defaultColumnMapping } from '@/lib/chart/config';

export type EditorTab = 'preview' | 'data';
export type PreviewDevice = 'desktop' | 'tablet' | 'mobile' | 'fullscreen' | 'custom';

interface EditorState {
  // Visualization metadata
  visualizationId: number | null;
  visualizationName: string;
  chartType: string;

  // Tabs & UI
  activeTab: EditorTab;
  previewDevice: PreviewDevice;
  customPreviewWidth: number;
  customPreviewHeight: number;
  settingsSearchQuery: string;

  // Data
  data: DataRow[];
  columnMapping: ColumnMapping;

  // Settings
  settings: ChartSettings;

  // Dirty tracking
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;

  // Actions
  setVisualizationId: (id: number | null) => void;
  setVisualizationName: (name: string) => void;
  setActiveTab: (tab: EditorTab) => void;
  setPreviewDevice: (device: PreviewDevice) => void;
  setCustomPreviewSize: (width: number, height: number) => void;
  setSettingsSearchQuery: (query: string) => void;
  setData: (data: DataRow[]) => void;
  setColumnMapping: (mapping: ColumnMapping) => void;
  updateSettings: <K extends keyof ChartSettings>(section: K, updates: Partial<ChartSettings[K]>) => void;
  setSettings: (settings: ChartSettings) => void;
  setIsDirty: (dirty: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  setLastSavedAt: (date: Date | null) => void;
  resetEditor: () => void;
  loadVisualization: (data: {
    id: number;
    name: string;
    chartType: string;
    data: DataRow[];
    settings: ChartSettings;
    columnMapping: ColumnMapping;
  }) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  visualizationId: null,
  visualizationName: 'Untitled visualization',
  chartType: 'bar_stacked',
  activeTab: 'preview',
  previewDevice: 'desktop',
  customPreviewWidth: 800,
  customPreviewHeight: 600,
  settingsSearchQuery: '',
  data: defaultData,
  columnMapping: defaultColumnMapping,
  settings: defaultChartSettings,
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,

  setVisualizationId: (id) => set({ visualizationId: id }),
  setVisualizationName: (name) => set({ visualizationName: name, isDirty: true }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setPreviewDevice: (device) => set({ previewDevice: device }),
  setCustomPreviewSize: (width, height) => set({ customPreviewWidth: width, customPreviewHeight: height }),
  setSettingsSearchQuery: (query) => set({ settingsSearchQuery: query }),
  setData: (data) => set({ data, isDirty: true }),
  setColumnMapping: (mapping) => set({ columnMapping: mapping, isDirty: true }),

  updateSettings: (section, updates) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [section]: { ...state.settings[section], ...updates },
      },
      isDirty: true,
    })),

  setSettings: (settings) => set({ settings, isDirty: true }),
  setIsDirty: (dirty) => set({ isDirty: dirty }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setLastSavedAt: (date) => set({ lastSavedAt: date }),

  resetEditor: () =>
    set({
      visualizationId: null,
      visualizationName: 'Untitled visualization',
      chartType: 'bar_stacked',
      activeTab: 'preview',
      previewDevice: 'desktop',
      customPreviewWidth: 800,
      customPreviewHeight: 600,
      settingsSearchQuery: '',
      data: defaultData,
      columnMapping: defaultColumnMapping,
      settings: defaultChartSettings,
      isDirty: false,
      isSaving: false,
      lastSavedAt: null,
    }),

  loadVisualization: (viz) =>
    set({
      visualizationId: viz.id,
      visualizationName: viz.name,
      chartType: viz.chartType,
      data: viz.data,
      settings: viz.settings,
      columnMapping: viz.columnMapping,
      isDirty: false,
      lastSavedAt: new Date(),
    }),
}));
