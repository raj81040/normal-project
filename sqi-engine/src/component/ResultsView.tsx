import React from 'react';
import type { SQIPayload } from '../engine/types';
import { Download, Clipboard, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  data: SQIPayload;
}

export const ResultsView: React.FC<Props> = ({ data }) => {
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SQI_Report_${data.student_id}.json`;
    link.click();
  };

  const getSqiColor = (score: number) => {
    if (score >= 80) return 'text-green-600 border-green-200 bg-green-50';
    if (score >= 50) return 'text-yellow-600 border-yellow-200 bg-yellow-50';
    return 'text-red-600 border-red-200 bg-red-50';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className={`p-6 rounded-xl border ${getSqiColor(data.overall_sqi)} flex justify-between items-center`}>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider opacity-70">Overall Student Quality Index</h2>
          <p className="text-5xl font-black">{data.overall_sqi}%</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border hover:shadow-sm transition-all"
          >
            <Download size={18} /> Download JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-bold mb-4">Topic Performance</h3>
          <div className="space-y-4">
            {data.concept_scores.slice(0, 4).map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{item.concept}</span>
                  <span>{item.sqi}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-1000" 
                    style={{ width: `${item.sqi}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-bold mb-4">Priority Focus Areas</h3>
          <div className="space-y-3">
            {data.ranked_concepts_for_summary.map((concept, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-slate-800">{concept.concept}</span>
                  <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                    Wt: {concept.weight}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {concept.reasons.map((r, i) => (
                    <span key={i} className="text-[10px] flex items-center gap-1 text-slate-500 bg-white border px-1.5 py-0.5 rounded shadow-sm">
                      <AlertCircle size={10} /> {r}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};