/**
 * EcoQuest Environmental Impact Factors & Conversion Rationale
 * 
 * Every metric displayed on student, teacher, and admin dashboards traces back
 * to the conversion constants defined in this file.
 * Reference standard benchmarks: EPA WARM model, UNEP Water Footprint,
 * Arbor Day Foundation carbon sequestration models, and DEFRA Greenhouse Gas Reporting.
 */

export interface ConversionFactor {
  id: string;
  category: "WASTE" | "WATER" | "ENERGY" | "PLASTIC_FREE" | "PLANTS" | "TRANSPORT";
  metricName: string;
  unit: string;
  /** Primary metric yield per single quest completion unit */
  primaryYieldPerUnit: number;
  /** Avoided CO2 equivalent in kg per single quest completion unit */
  co2AvoidedKgPerUnit: number;
  /** Secondary benefit metric (e.g., litres water saved or items eliminated) */
  secondaryYield?: {
    name: string;
    amount: number;
    unit: string;
  };
  /** Scientific benchmark reference */
  referenceSource: string;
  /** Educational explanation suited for school audit reports */
  rationale: string;
}

export const IMPACT_FACTORS: Record<string, ConversionFactor> = {
  // 1. WASTE: Composting and cafeteria food waste reduction
  COMPOST_FOOD_WASTE: {
    id: "COMPOST_FOOD_WASTE",
    category: "WASTE",
    metricName: "Food Waste Composted",
    unit: "kg",
    primaryYieldPerUnit: 0.85, // kg organic waste diverted from landfill
    co2AvoidedKgPerUnit: 0.62, // kg CO2e avoided (prevents anaerobic methane generation in landfill)
    referenceSource: "EPA WARM Organic Waste Diverted (2023 Update)",
    rationale: "Each cafeteria meal composted diverts ~0.85kg of organic matter, eliminating potent methane emissions from anaerobic landfill decay.",
  },

  // 2. WATER: Shorter showers & tap conservation
  WATER_CONSERVATION_TAP: {
    id: "WATER_CONSERVATION_TAP",
    category: "WATER",
    metricName: "Water Saved",
    unit: "L",
    primaryYieldPerUnit: 24.0, // Litres saved per 3-minute shower reduction or turned-off faucet
    co2AvoidedKgPerUnit: 0.08, // Embedded water purification and pumping electrical footprint
    referenceSource: "Waterwise UK & US EPA WaterSense Standards",
    rationale: "Shortening daily shower by 3 minutes saves ~24 Litres of water and 0.08kg CO2 equivalent in municipal pumping & heating energy.",
  },

  // 3. ENERGY: Standby shutdown & LED switch-off
  ENERGY_PHANTOM_KILLER: {
    id: "ENERGY_PHANTOM_KILLER",
    category: "ENERGY",
    metricName: "Electricity Conserved",
    unit: "kWh",
    primaryYieldPerUnit: 0.75, // kWh saved per day by unplugging electronics & lab workstations
    co2AvoidedKgPerUnit: 0.42, // Average grid grid emission intensity (0.56 kg CO2e / kWh)
    referenceSource: "IEA Global Average Grid Emission Factor & EnergyStar Standby Audits",
    rationale: "Powering down computer labs and classroom AV switches completely overnight saves ~0.75 kWh per workstation cluster.",
  },

  // 4. PLASTIC-FREE: Reusable bottle and container substitution
  SINGLE_USE_PLASTIC_AVOIDED: {
    id: "SINGLE_USE_PLASTIC_AVOIDED",
    category: "PLASTIC_FREE",
    metricName: "Single-Use Plastics Prevented",
    unit: "items",
    primaryYieldPerUnit: 3.0, // 3 bottles / wrappers replaced per day
    co2AvoidedKgPerUnit: 0.25, // 0.25kg CO2e embodied carbon in PET production & disposal
    secondaryYield: {
      name: "Plastic Waste Diverted",
      amount: 0.09, // 90 grams of virgin plastic prevented
      unit: "kg",
    },
    referenceSource: "Ellen MacArthur Foundation - Plastic Production Life Cycle Inventory",
    rationale: "Replacing single-use plastic bottles with a thermos prevents petroleum extraction and microplastic degradation into waterways.",
  },

  // 5. PLANTS: Native sapling and garden planting
  NATIVE_SAPLING_PLANTED: {
    id: "NATIVE_SAPLING_PLANTED",
    category: "PLANTS",
    metricName: "Saplings Planted",
    unit: "trees",
    primaryYieldPerUnit: 1.0, // 1 native sapling
    co2AvoidedKgPerUnit: 22.0, // kg CO2 sequestered per tree annually once maturing
    referenceSource: "Arbor Day Foundation & USDA Forest Service Urban Tree Carbon Calculator",
    rationale: "One mature native tree sequesters approximately 22kg of atmospheric CO2 each year while restoring native pollinator habitats.",
  },

  // 6. TRANSPORT: Active commute (bike, walk, school bus vs. private car drop-off)
  ACTIVE_GREEN_COMMUTE: {
    id: "ACTIVE_GREEN_COMMUTE",
    category: "TRANSPORT",
    metricName: "Active Green Commutes",
    unit: "km",
    primaryYieldPerUnit: 3.2, // average one-way student travel distance (km)
    co2AvoidedKgPerUnit: 0.68, // average passenger car emission avoided (0.21 kg CO2e / km)
    referenceSource: "UK DEFRA GHG Conversion Factors - Light Passenger Vehicle Fleet",
    rationale: "Walking, biking, or riding the school bus for a 3.2km round trip eliminates ~0.68kg CO2 from idling private cars in school pickup lanes.",
  },
};

/**
 * Calculates environmental returns for an action based on its factor key and volume
 */
export function calculateImpact(factorKey: string, multiplier: number = 1) {
  const factor = IMPACT_FACTORS[factorKey] || IMPACT_FACTORS.COMPOST_FOOD_WASTE;
  return {
    primaryYield: factor.primaryYieldPerUnit * multiplier,
    primaryUnit: factor.unit,
    co2AvoidedKg: factor.co2AvoidedKgPerUnit * multiplier,
    secondaryYield: factor.secondaryYield
      ? {
          name: factor.secondaryYield.name,
          amount: factor.secondaryYield.amount * multiplier,
          unit: factor.secondaryYield.unit,
        }
      : null,
  };
}

/**
 * Audit table schema generator for CSV export
 */
export function getAuditFactorTable(): Array<{
  Category: string;
  Action: string;
  Unit: string;
  PrimaryYield: number;
  CO2AvoidedKg: number;
  Reference: string;
  Rationale: string;
}> {
  return Object.values(IMPACT_FACTORS).map((f) => ({
    Category: f.category,
    Action: f.metricName,
    Unit: f.unit,
    PrimaryYield: f.primaryYieldPerUnit,
    CO2AvoidedKg: f.co2AvoidedKgPerUnit,
    Reference: f.referenceSource,
    Rationale: f.rationale,
  }));
}
