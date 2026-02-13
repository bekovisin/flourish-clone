'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, BarChart3, Clock, Trash2, Loader2 } from 'lucide-react';

interface VisualizationItem {
  id: number;
  name: string;
  chartType: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [visualizations, setVisualizations] = useState<VisualizationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchVisualizations();
  }, []);

  const fetchVisualizations = async () => {
    try {
      const res = await fetch('/api/visualizations');
      if (res.ok) {
        const data = await res.json();
        setVisualizations(data);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNew = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/visualizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Untitled visualization' }),
      });
      if (res.ok) {
        const viz = await res.json();
        router.push(`/editor/${viz.id}`);
      }
    } catch (error) {
      console.error('Failed to create:', error);
    } finally {
      setCreating(false);
    }
  };

  const deleteVisualization = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this visualization?')) return;
    try {
      await fetch(`/api/visualizations/${id}`, { method: 'DELETE' });
      setVisualizations((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Flourish</h1>
          </div>
          <Button onClick={createNew} disabled={creating} className="gap-2">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            New visualization
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
          My visualizations
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : visualizations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No visualizations yet</h3>
            <p className="text-sm text-gray-500 mb-6">Create your first chart to get started</p>
            <Button onClick={createNew} disabled={creating} className="gap-2">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              New visualization
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visualizations.map((viz) => (
              <Card
                key={viz.id}
                onClick={() => router.push(`/editor/${viz.id}`)}
                className="group cursor-pointer hover:shadow-md transition-all overflow-hidden"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b">
                  <BarChart3 className="w-10 h-10 text-gray-200" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 truncate">{viz.name}</h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(viz.updatedAt)}</span>
                    </div>
                    <button
                      onClick={(e) => deleteVisualization(viz.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
