export interface Profile {
  name: string;
  role: string;
  relationship: string;
  submissionDate: string;
  avatarUrl: string;
}

export interface ScoreMetric {
  label: string;
  value: number | string;
  type: 'score' | 'parent' | 'diff';
}

export interface CategoryScore {
  title: string;
  metrics: ScoreMetric[];
}

export interface DiscrepantItem {
  id: string; // e.g., '3', '8'
  label: string; // e.g., 'Q3'
  color: 'blue' | 'green' | 'orange';
}

export interface QuestionOption {
  value: string;
  label: string;
  score?: number; // Hypothetical score value for the option
}

export interface QuestionDetail {
  id: number;
  category: string;
  
  childText: string;
  childAnswer: string;
  childAnswerIndex: number; // 0-4
  
  parentText: string;
  parentAnswer: string;
  parentAnswerIndex: number; // 0-4

  options: string[]; // The 5 options (a-e)
  
  tag: 'Social' | 'Future' | 'Coping' | 'Discrepant';
  isDiscrepant: boolean;
}

export enum FilterType {
  ALL = 'All',
  SOCIAL = 'Social',
  FUTURE = 'Future',
  COPING = 'Coping',
  DISCREPANT = 'Discrepant',
}