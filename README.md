# Intucate Admin SQI Console & Diagnostic Engine

This project is a specialized internal tool built for Intucate admins to process student diagnostic data and generate a **Student Quality Index (SQI)** for downstream LLM agents.

## 📁 Project Structure
- **Core Engine:** `sqi-engine/src/engine/sqiEngine.ts` (The mathematical logic)
- **Dashboard:** `sqi-engine/src/App.tsx` (Admin interface)
- **Visuals:** `sqi-engine/src/component/ResultsView.tsx` (Visualizing the quality gaps)

## 🧠 The SQI Algorithm
The engine uses a multi-factor approach to determine student quality:
- **Accuracy & Speed:** Detects "Over-thinking" (time spent > expected) and applies a 20% penalty.
- **Importance Scaling:** Weights results by factor (1.0 for 'A', 0.7 for 'B', 0.5 for 'C').
- **Reason Mapping:** Automatically tags issues like "Wrong earlier" or "High importance" for the summary agent.

## 🚀 Setup & Execution
1. Navigate to the folder: `cd sqi-engine`
2. Install dependencies: `npm install`
3. Run locally: `npm run dev`

## 🛠️ Tech Stack
- React + Vite + TypeScript
- Tailwind CSS (Styling)
- Lucide React (Icons)
