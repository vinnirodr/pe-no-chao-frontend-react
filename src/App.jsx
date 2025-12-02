import { useState } from "react";
import { analyzeText } from "./api/client";

export default function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleAnalyze() {
    if (!text.trim()) return alert("Digite um texto");

    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeText(text);
      setResult(data);
    } catch (e) {
      alert("Erro ao chamar API");
      console.error(e);
    }

    setLoading(false);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-bold text-center mb-4">Pé-no-Chão 🧠</h1>

      <textarea
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite seu argumento..."
      />

      <button
        onClick={handleAnalyze}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 rounded p-3 font-semibold"
      >
        Analisar
      </button>

      {loading && (
        <p className="text-center text-gray-300 mt-4">Carregando análise...</p>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          {/* Premissas */}
          <section className="bg-gray-800 p-4 rounded border border-gray-700">
            <h2 className="text-xl font-bold mb-2">Premissas</h2>
            {result.gpt.premises.map((p, i) => (
              <p key={i}>
                <strong>P{i + 1}:</strong> {p.natural}
              </p>
            ))}
