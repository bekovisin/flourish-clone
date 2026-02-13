export interface Project {
  id: number;
  name: string;
  folderId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  createdAt: string;
}

export interface Visualization {
  id: number;
  projectId: number;
  name: string;
  chartType: string;
  data: Record<string, unknown>[];
  settings: Record<string, unknown>;
  columnMapping: Record<string, unknown>;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportVersion {
  id: number;
  visualizationId: number;
  versionName: string;
  width: number | null;
  height: number | null;
  isAutoSize: boolean;
  settingsSnapshot: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardTemplate {
  id: number;
  visualizationId: number;
  templateName: string;
  dataSourceType: string | null;
  dataSourceConfig: Record<string, unknown>;
  columnMappingTemplate: Record<string, unknown>;
  refreshInterval: number;
  isRealtime: boolean;
  settingsSnapshot: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
