export interface DataRow {
  [key: string]: string | number | null;
}

export interface DataColumn {
  field: string;
  headerName: string;
  type: 'text' | 'number';
  editable: boolean;
}

export interface SpreadsheetData {
  columns: DataColumn[];
  rows: DataRow[];
}

export interface CsvImportResult {
  data: DataRow[];
  columns: DataColumn[];
  errors: string[];
}
