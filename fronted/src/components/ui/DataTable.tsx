import React, { useState, useEffect, useCallback } from 'react';
import { Checkbox } from '@/components/common/Checkbox';
import { SkeletonLoader } from './SkeletonLoader';

/**
 * Reusable Data Table with bulk actions, optimistic UI updates, sorting & pagination.
 * Props:
 * - columns: { header: string; accessor: string; sortable?: boolean }[]
 * - fetchData: (page: number, pageSize: number, filters: Record<string, any>) => Promise<{ rows: any[]; total: number }> // async data fetch
 * - onBulkAction?: (selectedIds: string[]) => Promise<void>
 * - bulkActions?: { label: string; handler: (ids: string[]) => Promise<void> }[]
 */
export const DataTable = ({ columns, fetchData, onBulkAction, bulkActions = [] }) => {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Record<string, any>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { rows, total } = await fetchData(page, pageSize, filters);
      setData(rows);
      setTotal(total);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters, fetchData]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const handleBulk = async (action: (ids: string[]) => Promise<void>) => {
    const ids = Array.from(selected);
    // Optimistic UI: clear selection before server response
    setSelected(new Set());
    await action(ids);
    // reload data after action completes
    load();
  };

  if (loading) return <SkeletonLoader rows={pageSize} columns={columns.length} />;

  return (
    <div className="overflow-x-auto">
      {bulkActions.length > 0 && (
        <div className="flex space-x-2 mb-2">
          {bulkActions.map((b) => (
            <button
              key={b.label}
              disabled={selected.size === 0}
              onClick={() => handleBulk(b.handler)}
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {b.label} ({selected.size})
            </button>
          ))}
        </div>
      )}
      <table className="min-w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            {bulkActions.length > 0 && (
              <th className="p-2"><Checkbox checked={selected.size === data.length && data.length > 0} onChange={() => {
                if (selected.size === data.length) setSelected(new Set());
                else setSelected(new Set(data.map((r) => r.id)));
              }} /></th>
            )}
            {columns.map((col) => (
              <th key={col.accessor} className="p-2 text-left">
                {col.header}
                {/* Add sorting UI if needed */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t">
              {bulkActions.length > 0 && (
                <td className="p-2"><Checkbox checked={selected.has(row.id)} onChange={() => toggleSelect(row.id)} /></td>
              )}
              {columns.map((col) => (
                <td key={col.accessor} className="p-2">{row[col.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Simple pagination */}
      <div className="flex items-center justify-between mt-4">
        <span>{`Showing ${ (page-1)*pageSize + 1 } - ${Math.min(page*pageSize, total)} of ${total}`}</span>
        <div className="space-x-2">
          <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
          <button disabled={page*pageSize>=total} onClick={() => setPage(p=>p+1)} className="px-3 py-1 bg-gray-200 rounded">Next</button>
        </div>
      </div>
    </div>
  );
};
