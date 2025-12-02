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
        <p className="text-center text-gray-300 mt-4">
          Carregando análise...
        </p>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <section className="bg-gray-800 p-4 rounded border border-gray-700">
            <h2 className="text-xl font-bold mb-2">Premissas</h2>
            {result.gpt.premises.map((p, i) => (
              <p key={i}>
                <strong>P{i + 1}:</strong> {p.natural}
              </p>
            ))}
          </section>

          <section className="bg-gray-800 p-4 rounded border border-gray-700">
            <h2 className="text-xl font-bold mb-2">Conclusão</h2>
            <p>{result.gpt.conclusion.natural}</p>
          </section>

          <section className="bg-gray-800 p-4 rounded border border-gray-700">
            <h2 className="text-xl font-bold mb-2">Lógica Formal</h2>
            <p>{result.logic.isValid ? "✔ Válido" : "❌ Inválido"}</p>
          </section>

          <section className="bg-gray-800 p-4 rounded border border-gray-700">
            <h2 className="text-xl font-bold mb-2">Fact-check</h2>
            {result.fact_check.map((fc, i) => (
              <div key={i} className="mb-2">
                <p>
                  <strong>P{i + 1}:</strong>{" "}
                  {fc.verified ? "✔ Factual" : "❌ Não verificado"}
                </p>
                <p className="text-sm text-gray-400">{fc.explicacao}</p>
              </div>
            ))}
          </section>

          <section className="bg-gray-800 p-4 rounded border border-gray-700">
            <h2 className="text-xl font-bold mb-2">Notícias</h2>

            {result.noticias.map((item, i) => (
              <div key={i} className="mb-3">
                <h3 className="font-semibold">Premissa: {item.premise}</h3>
                <ul className="list-disc ml-5">
                  {item.sources.map((s, j) => (
                    <li key={j}>
                      <strong>{s.fonte}</strong>: {s.opniao} —{" "}
                      <a
                        href={s.link}
                        className="text-blue-400 underline"
                        target="_blank"
                      >
                        Fonte
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="bg-gray-800 p-4 rounded border border-gray-700">
            <h2 className="text-xl font-bold mb-2">Veredito Geral</h2>
            <p className="text-lg font-semibold">{result.verdict}</p>
          </section>
        </div>
      )}
    </div>
  );
}

