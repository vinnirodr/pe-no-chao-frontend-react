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
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 flex flex-col items-center px-4 py-10">
      
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">
          Pé-no-Chão <span className="text-pink-400">🧠</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Analise lógica, fatos e notícias de forma inteligente.
        </p>
      </header>

      {/* Textarea */}
      <div className="w-full max-w-3xl">
        <textarea
          className="w-full p-4 bg-[#111] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite seu argumento..."
        />

        {/* Button */}
        <button
          onClick={handleAnalyze}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-3 font-semibold transition"
        >
          Analisar
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-300 mt-6 animate-pulse">
          Analisando...
        </p>
      )}

      {/* Result */}
      {result && (
        <div className="w-full max-w-3xl mt-10 space-y-6">

          {/* Premissas */}
          <section className="bg-[#111] p-5 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-3">Premissas</h2>
            {result.gpt.premises.map((p, i) => (
              <p key={i} className="text-gray-300">
                <strong className="text-blue-400">P{i + 1}:</strong> {p.natural}
              </p>
            ))}
          </section>

          {/* Conclusão */}
          <section className="bg-[#111] p-5 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-3">Conclusão</h2>
            <p className="text-gray-300">{result.gpt.conclusion.natural}</p>
          </section>

          {/* Lógica Formal */}
          <section className="bg-[#111] p-5 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-3">Lógica Formal</h2>
            <p className="font-bold text-lg">
              {result.logic.isValid ? (
                <span className="text-green-400">✔ Válido</span>
              ) : (
                <span className="text-red-400">✘ Inválido</span>
              )}
            </p>
          </section>

          {/* Fact-check */}
          <section className="bg-[#111] p-5 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-3">Fact-check</h2>
            {result.fact_check.map((fc, i) => (
              <div key={i} className="mb-4">
                <p className="text-gray-200 font-semibold">
                  P{i + 1}:{" "}
                  {fc.verified ? (
                    <span className="text-green-400">✔ Factual</span>
                  ) : (
                    <span className="text-red-400">✘ Não verificado</span>
                  )}
                </p>
                <p className="text-gray-400 text-sm">{fc.explicacao}</p>
              </div>
            ))}
          </section>

          {/* Notícias */}
          <section className="bg-[#111] p-5 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-3">Notícias</h2>
            {result.noticias.map((item, i) => (
              <div key={i} className="mb-3">
                <h3 className="font-semibold text-gray-300">
                  Premissa: {item.premise}
                </h3>
                <ul className="list-disc ml-5 text-gray-400">
                  {item.sources.map((s, j) => (
                    <li key={j}>
                      <strong className="text-blue-400">{s.fonte}</strong>:{" "}
                      {s.opniao} —{" "}
                      <a
                        href={s.link}
                        target="_blank"
                        className="text-blue-500 underline"
                      >
                        Fonte
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Veredito */}
          <section className="bg-[#111] p-5 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-3">Veredito Geral</h2>
            <p className="text-2xl font-bold text-blue-400">
              {result.verdict}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
