import React, { useState } from 'react';
import { calculateSQI } from './engine/sqiEngine';
import { ResultsView } from './component/ResultsView'
import type { SQIPayload, Attempt } from './engine/types';
import { Layout, UploadCloud, Database, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sqiData, setSqiData] = useState<SQIPayload | null>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [prompt, setPrompt] = useState('');


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };


  const handleProcessData = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const result = calculateSQI(parsed.student_id, parsed.attempts, prompt);
      setSqiData(result);
    } catch (err) {
      alert("Invalid JSON format. Please check your student data.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl border w-full max-w-md">
          <div className="flex justify-center mb-6 text-indigo-600"><Lock size={40} /></div>
          <h1 className="text-2xl font-bold text-center mb-6">Admin SQI Console</h1>
          <input type="email" placeholder="Email (@intucate.com)" required className="w-full p-3 mb-4 border rounded-lg" />
          <input type="password" placeholder="Password (min 8 chars)" required minLength={8} className="w-full p-3 mb-6 border rounded-lg" />
          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">Login</button>
        </form>
      </div>
    );
  }

  const SAMPLES = {
    prompt: "Analyze high-priority conceptual gaps in Physics. Focus on topics with low SQI and high importance (A). Identify if the student is struggling with time management or accuracy.",
    data: {
      student_id: "INT-8821",
      attempts: [
        { topic: "Physics", concept: "Kinematics", importance: "A", difficulty: "H", type: "Practical", case_based: true, correct: false, marks: 4, neg_marks: 1, expected_time_sec: 180, time_spent_sec: 300, marked_review: false, revisits: 0 },
        { topic: "Physics", concept: "Thermodynamics", importance: "B", difficulty: "M", type: "Theory", case_based: false, correct: true, marks: 4, neg_marks: 1, expected_time_sec: 120, time_spent_sec: 110, marked_review: false, revisits: 1 }
      ]
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden lg:block">
        <div className="font-black text-xl mb-10 flex items-center gap-2">
          <Database className="text-indigo-400" /> SQI ENGINE
        </div>
        <nav className="space-y-4">
          <div className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Main</div>
          <button onClick={() => setSqiData(null)} className="flex items-center gap-3 w-full text-slate-300 hover:text-white">
            <UploadCloud size={20} /> Data Input
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {!sqiData ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-2xl border shadow-sm">
              <h2 className="text-2xl font-bold mb-2">Initialize SQI Analysis</h2>
              <p className="text-slate-500 mb-6">Paste the student diagnostic data below to generate the quality index.</p>

              <label className="block text-sm font-bold mb-2">Diagnostic Prompt Context</label>
              <textarea
                value={prompt}
                className="w-full h-24 p-3 border rounded-lg mb-6 bg-slate-50 font-mono text-sm"
                placeholder="Paste the diagnostic agent prompt here..." onChange={(e) => setPrompt(e.target.value)}
              />

              <label className="block text-sm font-bold mb-2">Student Attempt JSON</label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full h-64 p-3 border rounded-lg mb-6 font-mono text-xs"
                placeholder='{ "student_id": "ST-001", "attempts": [...] }'
              />

              <button
                onClick={handleProcessData}
                disabled={!jsonInput}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
              >
                Generate SQI Report
              </button>

            </div>

            <div className="flex gap-4 mb-4">
              <button
                onClick={() => {
                  setPrompt(SAMPLES.prompt);
                  setJsonInput(JSON.stringify(SAMPLES.data, null, 2));
                }}
                className="text-xs font-bold py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition"
              >
                ✨ Load Sample Test Case
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setSqiData(null)}
              className="text-sm text-indigo-600 font-bold mb-4 hover:underline"
            >
              ← Back to Upload
            </button>
            <ResultsView data={sqiData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;