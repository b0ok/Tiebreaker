export type ImpactLevel = 'critical' | 'high' | 'moderate' | 'minor';

export interface ProItem {
  id: string;
  text: string;
  impact: ImpactLevel;
  explanation?: string;
  userAdded?: boolean;
}

export interface ConItem {
  id: string;
  text: string;
  severity: ImpactLevel;
  mitigation?: string;
  userAdded?: boolean;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionAnalysis {
  id: string;
  name: string;
  tagline: string;
  pros: ProItem[];
  cons: ConItem[];
  swot: SwotAnalysis;
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  weight: number; // 1 to 5
  description: string;
  scores: Record<string, number>; // optionId -> score (1-10)
  justifications: Record<string, string>; // optionId -> reason
}

export interface AlternativeCondition {
  optionName: string;
  condition: string;
}

export interface TiebreakerVerdict {
  winnerId: string;
  winnerName: string;
  confidenceScore: number; // 0-100%
  headline: string;
  rationale: string;
  whenToPickOther: AlternativeCondition[];
  overlookedBlindspot: string;
  tiebreakerQuestion: string;
  immediateNextStep: string;
}

export interface RandomTiebreakerResult {
  winnerId: string;
  winnerName: string;
  timestamp: number;
  flipCount: number;
  gutCheckAdvice: string;
  psychologicalInsight: string;
  suggestedAction: string;
}

export type TiebreakerMethod = 'pros-cons' | 'comparison' | 'swot' | 'verdict' | 'random';

export type TabView = TiebreakerMethod;

export interface DecisionResult {
  id: string;
  timestamp: number;
  dilemma: string;
  summary: string;
  activeMethod: TiebreakerMethod;
  options: OptionAnalysis[];
  comparisonCriteria?: ComparisonCriterion[];
  verdict?: TiebreakerVerdict;
  randomResult?: RandomTiebreakerResult;
  loadedMethods: TiebreakerMethod[];
  notes?: string;
}

export interface DecisionPreset {
  id: string;
  title: string;
  category: string;
  iconName: string;
  dilemma: string;
  options: string[];
  context: string;
}

