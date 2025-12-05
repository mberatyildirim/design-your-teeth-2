// Admin Panel Component - Tüm form verilerini görüntülemek için

import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { LogOut, Download, Trash2, RefreshCw } from 'lucide-react';
import { getSubmissionsFromSupabase, clearSubmissionsFromSupabase, FormSubmission } from '../utils/supabase';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);

  // Supabase'den verileri yükle
  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await getSubmissionsFromSupabase();
      setSubmissions(data);
    } catch (error) {
      console.error("❌ [AdminPanel] Failed to load submissions:", error);
    }
  };

  // Verileri JSON olarak indir
  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(submissions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `design-your-teeth-submissions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Verileri CSV olarak indir
  const handleDownloadCSV = () => {
    const headers = ['TIMESTAMP', 'NAME', 'PHONE', 'EMAIL', 'FREE TREATMENT', 'SELECTED TOOTH TYPE', 'SELECTED TOOTH COLOR', 'OUTPUT IMG URL'];
    const rows = submissions.map(sub => [
      sub.timestamp,
      sub.name,
      sub.phone,
      sub.email,
      sub.freeTreatment ? 'Yes' : 'No',
      sub.selectedToothType,
      sub.selectedToothColor,
      sub.outputImgUrl
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `design-your-teeth-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Tüm verileri sil
  const handleClearAll = async () => {
    if (confirm('Are you sure you want to delete all submissions? This cannot be undone.')) {
      try {
        await clearSubmissionsFromSupabase();
        setSubmissions([]);
      } catch (error) {
        console.error("❌ [AdminPanel] Failed to clear submissions:", error);
        alert('Failed to clear submissions. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 mb-2">Admin Panel</h1>
            <p className="text-stone-500">Total Submissions: {submissions.length}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={loadSubmissions} variant="ghost" className="flex items-center gap-2">
              <RefreshCw size={18} />
              Refresh
            </Button>
            <Button onClick={handleDownloadJSON} variant="ghost" className="flex items-center gap-2">
              <Download size={18} />
              Download JSON
            </Button>
            <Button onClick={handleDownloadCSV} variant="ghost" className="flex items-center gap-2">
              <Download size={18} />
              Download CSV
            </Button>
            <Button onClick={handleClearAll} variant="ghost" className="flex items-center gap-2 text-red-600 hover:text-red-700">
              <Trash2 size={18} />
              Clear All
            </Button>
            <Button onClick={onLogout} variant="ghost" className="flex items-center gap-2">
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Free Treatment</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Tooth Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Tooth Color</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Output Image</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-stone-500">
                      No submissions yet
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub, index) => (
                    <tr key={index} className="hover:bg-stone-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">
                        {new Date(sub.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                        {sub.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                        {sub.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                        {sub.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          sub.freeTreatment 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {sub.freeTreatment ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                        {sub.selectedToothType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                        {sub.selectedToothColor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {sub.outputImgUrl ? (
                          <a 
                            href={sub.outputImgUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View Image
                          </a>
                        ) : (
                          <span className="text-stone-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

