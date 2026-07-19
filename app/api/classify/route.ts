import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { createWasteItem, getCollectionPoints } from "@/lib/supabase";
import { findNearestCollectionPoint } from "@/lib/geo";

const MODEL = "gemini-2.5-flash";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      description:
        "Общая категория мусора, например: пластик, стекло, бумага, органика, металл, электроника, опасные отходы",
    },
    material: {
      type: Type.STRING,
      description: "Конкретный материал предмета, например: ПЭТ, картон, алюминий",
    },
    recyclable: {
      type: Type.BOOLEAN,
      description: "Можно ли переработать этот предмет",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Уверенность модели в классификации, число от 0 до 1",
    },
    disposal_instructions: {
      type: Type.STRING,
      description: "Короткая инструкция на русском языке, куда и как выбросить этот предмет",
    },
  },
  required: [
    "category",
    "material",
    "recyclable",
    "confidence",
    "disposal_instructions",
  ],
};

interface ClassificationResult {
  category: string;
  material: string;
  recyclable: boolean;
  confidence: number;
  disposal_instructions: string;
}

function isClassificationResult(value: unknown): value is ClassificationResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.category === "string" &&
    typeof v.material === "string" &&
    typeof v.recyclable === "boolean" &&
    typeof v.confidence === "number" &&
    typeof v.disposal_instructions === "string"
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY не настроен на сервере" },
      { status: 500 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Не удалось прочитать данные запроса" },
      { status: 400 },
    );
  }

  const file = formData.get("photo");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Фото не найдено в запросе" },
      { status: 400 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = file.type || "image/jpeg";

  let classification: ClassificationResult;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "Проанализируй фото мусора на изображении. Определи категорию отхода, " +
                "материал, можно ли его переработать, дай короткую инструкцию на русском " +
                "языке куда и как его правильно выбросить, и укажи свою уверенность в " +
                "классификации числом от 0 до 1.",
            },
            { inlineData: { data: base64Data, mimeType } },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("empty response");
    }

    const parsed: unknown = JSON.parse(text);
    if (!isClassificationResult(parsed)) {
      throw new Error("unexpected response shape");
    }
    classification = parsed;
  } catch (error) {
    console.error("Gemini classification failed", error);
    return NextResponse.json(
      {
        error:
          "Не удалось распознать фото. Попробуйте сделать снимок при хорошем освещении и повторить попытку.",
      },
      { status: 502 },
    );
  }

  let nearestPoint = null;
  try {
    const points = await getCollectionPoints();
    nearestPoint = findNearestCollectionPoint(points ?? []);
  } catch (error) {
    console.error("Failed to load collection points", error);
  }

  try {
    const wasteItem = await createWasteItem({
      image_url: null,
      category: classification.category,
      material: classification.material,
      recyclable: classification.recyclable,
      confidence: classification.confidence,
      disposal_instructions: classification.disposal_instructions,
      nearest_point_id: nearestPoint?.point.id ?? null,
    });

    return NextResponse.json({
      ...classification,
      nearest_point: nearestPoint?.point ?? null,
      distance_km: nearestPoint?.distanceKm ?? null,
      waste_item_id: wasteItem.id,
    });
  } catch (error) {
    console.error("Failed to save waste item", error);
    return NextResponse.json(
      {
        ...classification,
        nearest_point: nearestPoint?.point ?? null,
        distance_km: nearestPoint?.distanceKm ?? null,
        warning: "Результат распознан, но не сохранился в базе данных",
      },
      { status: 200 },
    );
  }
}
