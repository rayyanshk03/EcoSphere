// ─────────────────────────────────────────────────────────────────────────────
// EcoSphere — ESG Scoring Rollups & History Service
// Computes company-wide ESG summaries and department weighted averages.
// ─────────────────────────────────────────────────────────────────────────────

import type { Department, ESGScoreHistory, AppSettings } from '@/types';

interface ScoreChangeSummary {
  score: number;
  change: number; // percentage change vs prior month
}

export interface OrgESGSummary {
  environmental: ScoreChangeSummary;
  social: ScoreChangeSummary;
  governance: ScoreChangeSummary;
  overall: ScoreChangeSummary;
}

/**
 * Computes the company-wide ESG scores and compares them against the prior snapshot.
 *
 * @param activeDepartments    Array of active departments with computed live ESG scores
 * @param esgScoreHistory      Historical snapshots array
 * @param settings             Current weight configurations
 * @returns                    An aggregated summary with percentage change comparisons
 */
export function getOrgESGSummary(
  activeDepartments: Department[],
  esgScoreHistory: ESGScoreHistory[],
  settings: AppSettings
): OrgESGSummary {
  const count = activeDepartments.length;
  if (count === 0) {
    return {
      environmental: { score: 0, change: 0 },
      social: { score: 0, change: 0 },
      governance: { score: 0, change: 0 },
      overall: { score: 0, change: 0 },
    };
  }

  // 1. Compute current averages
  const env = Math.round(
    activeDepartments.reduce((sum, d) => sum + d.score, 0) / count
  );
  
  const soc = Math.round(
    activeDepartments.reduce((sum, d: any) => sum + (d.socialScore ?? 70), 0) / count
  );

  const gov = Math.round(
    activeDepartments.reduce((sum, d: any) => sum + (d.governanceScore ?? 80), 0) / count
  );

  const { envWeight = 40, socWeight = 30, govWeight = 30 } = settings;
  const overall = Math.round(
    (env * envWeight + soc * socWeight + gov * govWeight) / 100
  );

  // 2. Fetch prior snapshot (most recent company-wide history record, e.g. previous month)
  const companyHistory = (esgScoreHistory || [])
    .filter((h) => h.departmentId === null)
    .sort((a, b) => b.date.localeCompare(a.date)); // descending YYYY-MM
  
  const prior = companyHistory[0]; // most recent historical snapshot

  const calcChange = (current: number, priorVal?: number): number => {
    if (!priorVal || priorVal === 0) return 0;
    const diff = current - priorVal;
    return parseFloat(((diff / priorVal) * 100).toFixed(1));
  };

  return {
    environmental: {
      score: env,
      change: calcChange(env, prior?.environmentalScore),
    },
    social: {
      score: soc,
      change: calcChange(soc, prior?.socialScore),
    },
    governance: {
      score: gov,
      change: calcChange(gov, prior?.governanceScore),
    },
    overall: {
      score: overall,
      change: calcChange(overall, prior?.overallScore),
    },
  };
}

/**
 * Computes a single department's dynamic total ESG score based on active weights.
 */
export function calculateDepartmentESGScore(
  dept: Department & { socialScore?: number; governanceScore?: number },
  settings: AppSettings
): number {
  const { envWeight = 40, socWeight = 30, govWeight = 30 } = settings;
  const env = dept.score;
  const soc = dept.socialScore ?? 70;
  const gov = dept.governanceScore ?? 80;
  return Math.round((env * envWeight + soc * socWeight + gov * govWeight) / 100);
}
