"use client";

import { useRef, useState } from "react";

interface CollectionPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string | null;
}

interface ClassifyResult {
  category: string;
  material: string;
  recyclable: boolean;
  confidence: number;
  disposal_instructions: string;
  nearest_point: CollectionPoint | null;
  distance_km: number | null;
  warning?: string;
}

export default function AiSortPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setResult(null);
    setError(null);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  }

  async function handleAnalyze() {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Не удалось проанализировать фото");
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Что-то пошло не так. Попробуйте ещё раз.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-champagne p-8">
        <h1 className="text-2xl font-bold text-codium">AI Sort</h1>
        <p className="mt-2 text-bistre">
          Сфотографируйте мусор — Gemini Vision определит категорию, материал
          и подскажет, куда его выбросить.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-codium file:mr-4 file:rounded-full file:border-0 file:bg-bistre file:px-4 file:py-2 file:text-ivory file:hover:opacity-90"
          />

          {previewUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={previewUrl}
              alt="Превью выбранного фото"
              className="max-h-80 w-full rounded-lg object-contain bg-ivory"
            />
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="self-start rounded-lg bg-peach px-6 py-3 font-medium text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Анализируем…" : "Анализировать"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="animate-pulse rounded-xl bg-champagne p-8">
          <div className="h-4 w-1/3 rounded bg-codium/20" />
          <div className="mt-4 h-4 w-2/3 rounded bg-codium/20" />
          <div className="mt-2 h-4 w-1/2 rounded bg-codium/20" />
          <div className="mt-2 h-4 w-3/4 rounded bg-codium/20" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-peach bg-champagne p-6 text-codium">
          <p className="font-medium">Ошибка</p>
          <p className="mt-1 text-bistre">{error}</p>
        </div>
      )}

      {result && !loading && (
        <div className="rounded-xl bg-champagne p-8 text-codium">
          <h2 className="text-xl font-bold">Результат анализа</h2>

          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-bistre">Категория</dt>
              <dd className="font-medium">{result.category}</dd>
            </div>
            <div>
              <dt className="text-sm text-bistre">Материал</dt>
              <dd className="font-medium">{result.material}</dd>
            </div>
            <div>
              <dt className="text-sm text-bistre">Перерабатывается</dt>
              <dd className="flex items-center gap-2 font-medium">
                {result.recyclable ? (
                  <span className="text-codium">✅ Да</span>
                ) : (
                  <span className="text-peach">❌ Нет</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-bistre">Уверенность модели</dt>
              <dd className="font-medium">
                {Math.round(result.confidence * 100)}%
              </dd>
            </div>
          </dl>

          <div className="mt-4">
            <dt className="text-sm text-bistre">Куда выбросить</dt>
            <dd className="mt-1">{result.disposal_instructions}</dd>
          </div>

          {result.nearest_point && (
            <div className="mt-4 rounded-lg bg-ivory p-4">
              <p className="text-sm text-bistre">Ближайшая точка сдачи</p>
              <p className="font-medium">{result.nearest_point.name}</p>
              {result.distance_km !== null && (
                <p className="text-sm text-bistre">
                  ~{result.distance_km.toFixed(1)} км от вас
                </p>
              )}
            </div>
          )}

          {result.warning && (
            <p className="mt-4 text-sm text-bistre">{result.warning}</p>
          )}
        </div>
      )}
    </div>
  );
}
