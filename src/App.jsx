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
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] to-[#111] text-gray-100 flex flex-col items-center px-4 py-12">
      
      {/* HEADER */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Pé-no-Chão
        </h1>
        <p className="text-gray-400 mt-3 text-lg">
          Análise lógica, fatos e notícias — simples, clara e confiável.
        </p>
      </header>

      {/* CARD CENTRAL */}
      <div className="w-full max-w-3xl bg-[#0f0f0f]/60 backdrop-blur-sm border border-white/5 rounded-2xl p-8 shadow-xl shadow-black/30">
        
        {/* Textarea */}
        <textarea
          className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:outline-none transition shadow-inner"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite seu argumento…"
        />

        {/* Botão */}
        <button
          onClick={handleAnalyze}
          className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition font-semibold shadow-lg shadow-blue-900/30"
        >
          {loading ? "Analisando..." : "Analisar"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="mt-6 text-gray-300 animate-pulse text-lg">
          Processando análise...
        </p>
      )}

      {/* RESULTADOS */}
      {result && (
        <div className="w-full max-w-3xl mt-10 space-y-6">

          {/* COMPONENTE DE BLOCO */}
          {[
            {
              title: "Premissas",
              render: (
                result.gpt.premises.map((p, i) => (
                  <p key={i} className="text-gray-300">
                    <span className="text-blue-400 font-semibold">P{i + 1}:</span> {p.natural}
                  </p>
                ))
              )
            },
            {
              title: "Conclusão",
              render: <p className="text-gray-300">{result.gpt.conclusion.natural}</p>
            },
            {
              title: "Lógica Formal",
              render: (
                <p className="text-lg font-bold">
                  {result.logic.isValid ? 
                    <span className="text-green-400">✔ Argumento Válido</span> : 
                    <span className="text-red-400">✘ Argumento Inválido</span>
                  }
                </p>
              )
            },
            {
              title: "Fact-check",
              render: (
                result.fact_check.map((fc, i) => (
                  <div key={i}>
                    <p className="font-semibold text-gray-200">
                      P{i + 1}: {fc.verified ?
                        <span className="text-green-400">✔ Factual</span> :
                        <span className="text-red-400">✘ Não verificado</span>
                      }
                    </p>
                    <p className="text-gray-400 text-sm mb-3">{fc.explicacao}</p>
                  </div>
                ))
              )
            },
            {
              title: "Notícias",
              render: (
                result.noticias.map((item, i) => (
                  <div key={i} className="mb-4">
                    <h3 className="font-semibold text-purple-300">
                      Premissa: {item.premise}
                    </h3>
                    <ul className="list-disc ml-5 text-gray-400">
                      {item.sources.map((s, j) => (
                        <li key={j}>
                          <strong className="text-blue-400">{s.fonte}</strong>: {s.opniao} —{" "}
                          <a href={s.link} target="_blank" className="text-blue-500 underline">
                            Fonte
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )
            },
            {
              title: "Veredito Geral",
              render: (
                <p className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  {result.verdict}
                </p>
              )
            }
          ].map((section, index) => (
            <div
              key={index}
              className="bg-[#0f0f0f]/60 border border-white/5 p-6 rounded-2xl shadow-md shadow-black/20 backdrop-blur-sm"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-200">
                {section.title}
              </h2>

              <div className="space-y-3">
                {section.render}
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
