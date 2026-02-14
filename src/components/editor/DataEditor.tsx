'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, ColDef, CellValueChangedEvent } from 'ag-grid-community';
import { useEditorStore } from '@/store/editorStore';
import { DataRow } from '@/types/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, Search, Trash2 } from 'lucide-react';
import { ColumnMapper } from './ColumnMapper';

ModuleRegistry.registerModules([AllCommunityModule]);

export function DataEditor() {
  const { data, setData, activeTab } = useEditorStore();
  const gridRef = useRef<AgGridReact>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState('');

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const columnDefs: ColDef[] = useMemo(() => {
    return columns.map((col) => {
      const isNumeric = data.some((row) => {
        const val = row[col];
        return val !== null && val !== '' && !isNaN(Number(val));
      });
      return {
        field: col,
        headerName: `${col} ${isNumeric ? '(123)' : '(ABC)'}`,
        editable: true,
        sortable: true,
        filter: true,
        resizable: true,
        minWidth: 100,
      };
    });
  }, [columns, data]);

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
      editable: true,
      sortable: true,
      filter: true,
    }),
    []
  );

  const onCellValueChanged = useCallback(
    (event: CellValueChangedEvent) => {
      const newData = [...data];
      newData[event.rowIndex!] = { ...newData[event.rowIndex!], [event.colDef.field!]: event.newValue };
      setData(newData);
    },
    [data, setData]
  );

  const addRow = () => {
    const newRow: DataRow = {};
    columns.forEach((col) => (newRow[col] = ''));
    setData([...data, newRow]);
  };

  const addColumn = () => {
    const newColName = `Column ${columns.length + 1}`;
    const newData = data.map((row) => ({ ...row, [newColName]: '' }));
    setData(newData);
  };

  const deleteSelectedRows = () => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) return;
    const selectedIndices = new Set(selectedNodes.map((node) => node.rowIndex));
    const newData = data.filter((_, i) => !selectedIndices.has(i));
    setData(newData.length > 0 ? newData : [{ label: '' }]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv') {
      const Papa = (await import('papaparse')).default;
      const text = await file.text();
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setData(results.data as DataRow[]);
          }
        },
      });
    }

    // Reset file input
    e.target.value = '';
  };

  if (activeTab !== 'data') return null;

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Spreadsheet area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={addColumn} className="gap-1.5 text-xs">
              <Plus className="w-3 h-3" />
              Column
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-1.5 text-xs"
            >
              <Upload className="w-3 h-3" />
              Upload data
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={deleteSelectedRows}
              className="gap-1.5 text-xs text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
              Delete rows
            </Button>
          </div>
          <div className="relative w-48">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                gridRef.current?.api.setGridOption('quickFilterText', e.target.value);
              }}
              placeholder="Search data..."
              className="h-7 pl-7 text-xs"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 ag-theme-alpine" style={{ width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onCellValueChanged={onCellValueChanged}
            rowSelection={{ mode: 'multiRow' }}
            suppressMovableColumns={false}
            undoRedoCellEditing={true}
            undoRedoCellEditingLimit={20}
          />
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-4 py-1.5 border-t bg-gray-50 text-xs text-gray-500">
          <button onClick={addRow} className="flex items-center gap-1 hover:text-gray-700">
            <Plus className="w-3 h-3" />
            Add row
          </button>
          <span>
            {data.length} rows &middot; {columns.length} columns
          </span>
        </div>
      </div>

      {/* Column Mapper (right side) */}
      <ColumnMapper />
    </div>
  );
}
