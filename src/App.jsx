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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center px-6 py-14">
      
      {/* HEADER */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-semibold tracking-tight">
          Pé-no-Chão
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Análise lógica e factual, com clareza e simplicidade.
        </p>
      </header>

      {/* CARD PRINCIPAL */}
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        
        <textarea
          className="w-full p-4 rounded-lg border border-gray-300 bg-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite seu argumento..."
        />

        <button
          onClick={handleAnalyze}
          className="mt-5 w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          {loading ? "Analisando..." : "Analisar"}
        </button>
      </div>

      {loading && (
        <p className="mt-6 text-gray-500 text-lg animate-pulse">
          Processando análise...
        </p>
      )}

      {/* RESULTADOS */}
      {result && (
        <div className="w-full max-w-2xl mt-10 space-y-6">

          {/* BLOCO COMPONENTIZADO */}
          {[
            {
              title: "Premissas",
              render: (
                result.gpt.premises.map((p, i) => (
                  <p key={i} className="text-gray-700">
                    <strong className="text-gray-900">P{i + 1}:</strong> {p.natural}
                  </p>
                ))
              )
            },
            {
              title: "Conclusão",
              render: <p className="text-gray-700">{result.gpt.conclusion.natural}</p>
            },
            {
              title: "Lógica Formal",
              render: (
                <p className="text-lg font-medium">
                  {result.logic.isValid ? 
                    <span className="text-green-600">✔ Argumento Válido</span> : 
                    <span className="text-red-600">✘ Argumento Inválido</span>
                  }
                </p>
              )
            },
            {
              title: "Fact-check",
              render: (
                result.fact_check.map((fc, i) => (
                  <div key={i}>
                    <p className="font-medium text-gray-900">
                      P{i + 1}: {fc.verified ?
                        <span className="text-green-600">✔ Factual</span> :
                        <span className="text-red-600">✘ Não verificado</span>
                      }
                    </p>
                    <p className="text-gray-600 text-sm mb-3">{fc.explicacao}</p>
                  </div>
                ))
              )
            },
            {
              title: "Notícias",
              render: (
                result.noticias.map((item, i) => (
                  <div key={i} className="mb-4">
                    <h3 className="font-medium text-gray-800 mb-1">
                      Premissa: {item.premise}
                    </h3>
                    <ul className="list-disc ml-5 text-gray-600">
                      {item.sources.map((s, j) => (
                        <li key={j}>
                          <strong className="text-gray-900">{s.fonte}</strong>: {s.opniao} —{" "}
                          <a
                            href={s.link}
                            target="_blank"
                            className="text-blue-600 underline"
                          >
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
                <p className="text-xl font-semibold text-gray-900">
                  {result.verdict}
                </p>
              )
            }
          ].map((section, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {section.title}
              </h2>
              <div className="space-y-3">{section.render}</div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
