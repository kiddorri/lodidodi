// CO₂ avoidance estimate for the Analytics dashboard.
//
// Numbers are deliberately coarse — this is a demo-grade estimate, not a
// certified emissions inventory.
//
// Avoided-emission factors (kg CO₂e avoided per kg of material recycled
// instead of landfilled) are illustrative values in the range EPA's WARM model
// reports: metal ~9.0, plastic ~1.8, paper ~0.95, glass ~0.25. Materials
// outside these four are not counted.
//
// KZ_MULTIPLIER (1.1) nudges every factor up because WARM is calibrated on the
// US grid (~0.40–0.42 kg CO₂/kWh) while Kazakhstan's grid emission factor is
// higher (~0.45 kg CO₂/kWh). Applying a flat 1.1 to all factors is a
// simplification — a rigorous model would adjust per-material by the share of
// process energy that comes from electricity.

export type Co2Material = "metal" | "plastic" | "paper" | "glass";

const KZ_MULTIPLIER = 1.1;

const AVOIDED_FACTORS: Record<Co2Material, number> = {
  metal: 9.0,
  plastic: 1.8,
  paper: 0.95,
  glass: 0.25,
};

// Rough average weight of a single item per material (kg). Order-of-magnitude
// estimates for a demo — a real system would weigh items or infer scale from
// the photo.
const AVG_WEIGHT_KG: Record<Co2Material, number> = {
  metal: 0.015,
  plastic: 0.03,
  paper: 0.05,
  glass: 0.35,
};

// Gemini returns a free-text category (usually Russian), so we match by
// keyword/substring rather than exact string equality.
const KEYWORDS: Record<Co2Material, string[]> = {
  metal: ["металл", "алюмин", "жест", "консерв", "сталь", "metal", "alumin", "steel", "tin"],
  plastic: ["пластик", "пэт", "полиэтилен", "полипроп", "полимер", "plastic", "pet", "hdpe", "ldpe"],
  paper: ["бумаг", "картон", "газет", "paper", "cardboard", "carton"],
  glass: ["стекл", "glass"],
};

export function matchMaterial(category: string | null | undefined): Co2Material | null {
  if (!category) return null;
  const c = category.toLowerCase();
  for (const material of Object.keys(KEYWORDS) as Co2Material[]) {
    if (KEYWORDS[material].some((kw) => c.includes(kw))) return material;
  }
  return null;
}

// Avoided CO₂ for one item, based on its category. Items whose recyclable flag
// is explicitly false are skipped — they head to the landfill, so recycling
// avoids nothing.
export function estimateItemCO2(item: {
  category: string | null;
  recyclable?: boolean | null;
}): number {
  if (item.recyclable === false) return 0;
  const material = matchMaterial(item.category);
  if (!material) return 0;
  return AVG_WEIGHT_KG[material] * AVOIDED_FACTORS[material] * KZ_MULTIPLIER;
}

export function estimateAvoidedCO2(
  items: { category: string | null; recyclable?: boolean | null }[],
): number {
  return items.reduce((sum, item) => sum + estimateItemCO2(item), 0);
}
