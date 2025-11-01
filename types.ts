import React from 'react';

export interface Question {
  id: string;
  text: string;
  type: 'radio';
  options: string[];
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface Answers {
  [key: string]: string;
}

export interface ResultPoint {
  point: string;
  category: string;
}

export interface HealthTip {
  category: string;
  tip: string;
}

export interface HealthResult {
  overallScore: number;
  summary: string;
  positivePoints: ResultPoint[];
  areasForImprovement: ResultPoint[];
  healthTips: HealthTip[];
  disclaimer: string;
}

export interface HistoricalEntry {
  id: string;
  date: string;
  score: number;
  result: HealthResult;
  answers: Answers;
}
