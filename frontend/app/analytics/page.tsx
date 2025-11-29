"use client";

import { useState } from "react";

type AnalyticsOutput = {
  user_id: string;
  event_name: string;
  timestamp: string;
  views: number;
  clicks: number;
  time_spent_seconds: number;
  engagement_score: number;
  processed_at: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export default function AnalyticsPage() {
  const [rawJson, setRawJson] = useState("");
  const [data, setData] = useState<AnalyticsOutput[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // const exampleJson = [
  //   {
  //     user_id: "user_1",
  //     event_name: "page_view",
  //     timestamp: "2025-01-01T10:00:00Z",
  //     views: 5,
  //     clicks: 2,
  //     time_spent_seconds: 120,
  //   },
  //   {
  //     user_id: "user_2",
  //     event_name: "signup",
  //     timestamp: "2025-01-01T10:05:00Z",
  //     views: 1,
  //     clicks: 1,
  //     time_spent_seconds: 30,
  //   },
  // ];

  const handleCompute = async () => {
    setError(null);
    setData(null);

    if (!rawJson.trim()) {
      setError("Please paste a JSON array of analytics records.");
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      setError("Invalid JSON.");
      return;
    }

    if (!Array.isArray(parsed)) {
      setError("Input must be a JSON array.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/compute-metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message ?? "API error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-8 py-6">
      <h1 className="text-3xl font-bold mb-4">Analytics Metrics</h1>

      <label className="block text-sm mb-2">Input JSON</label>

      <textarea
        className="w-full h-48 bg-slate-900 border border-slate-700 p-3 rounded"
        value={rawJson}
        onChange={(e) => setRawJson(e.target.value)}
        placeholder="[ { ... }, { ... } ]"
      />

      <div className="flex gap-3 mt-3">
        {/* <button
          className="bg-emerald-500 text-black px-4 py-2 rounded font-semibold"
          onClick={() => setRawJson(JSON.stringify(exampleJson, null, 2))}
        >
          Example
        </button> */}

        <button
          className="bg-blue-500 px-4 py-2 rounded font-semibold"
          disabled={loading}
          onClick={handleCompute}
        >
          {loading ? "Computing..." : "Compute Metrics"}
        </button>
      </div>

      {error && (
        <p className="mt-4 text-red-400 border border-red-700 bg-red-900/40 p-2 rounded">
          {error}
        </p>
      )}

      {data && (
        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-800">
              <th className="border border-slate-700 p-2">User</th>
              <th className="border border-slate-700 p-2">Event</th>
              <th className="border border-slate-700 p-2">Views</th>
              <th className="border border-slate-700 p-2">Clicks</th>
              <th className="border border-slate-700 p-2">Time (s)</th>
              <th className="border border-slate-700 p-2">Score</th>
              <th className="border border-slate-700 p-2">Processed At</th>
            </tr>
          </thead>

          <tbody>
            {data.map((r, i) => (
              <tr key={i}>
                <td className="border border-slate-700 p-2">{r.user_id}</td>
                <td className="border border-slate-700 p-2">{r.event_name}</td>
                <td className="border border-slate-700 p-2">{r.views}</td>
                <td className="border border-slate-700 p-2">{r.clicks}</td>
                <td className="border border-slate-700 p-2">{r.time_spent_seconds}</td>
                <td className="border border-slate-700 p-2">{r.engagement_score}</td>
                <td className="border border-slate-700 p-2 whitespace-nowrap">
                  {new Date(r.processed_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
