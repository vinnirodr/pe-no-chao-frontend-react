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
    <div className="min-h-screen bg-[#0d1117] text-white p-6 flex flex-col items-center">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Pé-no-Chão 🧠
        </h1>
        <p className="text-gray-400 mt-2">
          Analise lógica, fatos e notícias de forma inteligente.
        </p>
      </header>

      {/* INPUT */}
      <div className="w-full max-w-3xl">
        <textarea
          className="w-full p-4 bg-[#161b22] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 transition-all"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite seu argumento..."
        />

        <button
          onClick={handleAnalyze}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-3 font-semibold transition-all shadow-lg hover:shadow-blue-900/30"
        >
          Analisar
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mt-10 flex flex-col items-center gap-4 animate-fadeIn">
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></span>
            <span
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></span>
            <span
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></span>
          </div>
          <p className="text-gray-400">Carregando análise...</p>
        </div>
      )}

      {/* RESULTADOS */}
      {result && (
        <div className="mt-12 w-full max-w-3xl space-y-6 animate-fadeIn">
          {/* CARD */}
          <section className="bg-[#161b22] p-5 rounded-xl border border-gray-700 shadow-md">
            <h2 className="text-xl font-bold mb-3">Premissas</h2>
            {result.gpt.premises.map((p, i) => (
              <p key={i} className="mb-1">
                <span className="font-semibold text-blue-400">P{i + 1}:</span>{" "}
                {p.natural}
              </p>
            ))}
          </section>

          <section className="bg-[#161b22] p-5 rounded-xl border border-gray-700 shadow-md">
            <h2 className="text-xl font-bold mb-3">Conclusão</h2>
            <p>{result.gpt.conclusion.natural}</p>
          </section>

          {/* Lógica */}
          <section className="bg-[#161b22] p-5 rounded-xl border border-gray-700 shadow-md">
            <h2 className="text-xl font-bold mb-3">Lógica Formal</h2>
            <p
              className={`text-lg font-semibold ${
                result.logic.isValid ? "text-green-400" : "text-red-400"
              }`}
            >
              {result.logic.isValid ? "✔ Válido" : "❌ Inválido"}
            </p>
          </section>

          {/* Fact-check */}
          <section className="bg-[#161b22] p-5 rounded-xl border border-gray-700 shadow-md">
            <h2 className="text-xl font-bold mb-3">Verificação de Fatos</h2>
            {result.fact_check.map((fc, i) => (
              <div key={i} className="mb-3">
                <p>
                  <strong>P{i + 1}:</strong>{" "}
                  <span
                    className={
                      fc.verified ? "text-green-400" : "text-yellow-400"
                    }
                  >
                    {fc.verified ? "✔ Factual" : "⚠ Não confirmado"}
                  </span>
                </p>
                <p className="text-sm text-gray-400">{fc.explicacao}</p>
              </div>
            ))}
          </section>

          {/* Notícias */}
          <section className="bg-[#161b22] p-5 rounded-xl border border-gray-700 shadow-md">
            <h2 className="text-xl font-bold mb-3">Notícias</h2>

            {result.noticias.map((item, i) => (
              <div key={i} className="mb-5">
                <h3 className="font-semibold text-blue-400">
                  Premissa: {item.premise}
                </h3>

                <ul className="list-disc ml-6 mt-2 space-y-2">
                  {item.sources.map((s, j) => (
                    <li key={j}>
                      <strong>{s.fonte}</strong>: {s.opniao} —{" "}
                      <a
                        href={s.link}
                        className="text-blue-400 underline hover:text-blue-300"
                        target="_blank"
                        rel="noreferrer"
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
          <section className="bg-[#161b22] p-5 rounded-xl border border-gray-700 shadow-md">
            <h2 className="text-xl font-bold mb-2">Veredito Geral</h2>
            <p className="text-2xl font-bold text-purple-400">
              {result.verdict}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
