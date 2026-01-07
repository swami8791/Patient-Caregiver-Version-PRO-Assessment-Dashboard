
import { Profile, CategoryScore, DiscrepantItem, QuestionDetail, FilterType } from './types';

export const PROFILE_DATA: Profile = {
  name: 'Jane Doe',
  role: 'Child',
  relationship: 'Dad (John Doe)',
  submissionDate: '12-13-2021',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
};

export const HEALTH_SCORES: CategoryScore = {
  title: 'Future Health',
  metrics: [
    { label: 'Score', value: 55.6, type: 'score' },
    { label: 'Parent', value: 61.1, type: 'parent' },
    { label: 'Diff', value: -5.5, type: 'diff' },
  ],
};

export const COPING_SCORES: CategoryScore = {
  title: 'Coping & Adjustment',
  metrics: [
    { label: 'Score', value: 68.8, type: 'score' },
    { label: 'Parent', value: 71.9, type: 'parent' },
    { label: 'Diff', value: -3.1, type: 'diff' },
  ],
};

export const SOCIAL_SCORES: CategoryScore = {
  title: 'Social - Emotional',
  metrics: [
    { label: 'Score', value: 50.0, type: 'score' },
    { label: 'Parent', value: 50.0, type: 'parent' },
    { label: 'Diff', value: 0.0, type: 'diff' },
  ],
};

export const DISCREPANT_ITEMS: DiscrepantItem[] = [
  { id: '3', label: 'Q3', color: 'blue' },
  { id: '8', label: 'Q8', color: 'green' },
  { id: '13', label: 'Q13', color: 'orange' },
  { id: '14', label: 'Q14', color: 'blue' },
  { id: '16', label: 'Q16', color: 'green' },
];

/**
 * Historical trend data for visualizations in Omni Assistant
 */
export const HISTORICAL_TRENDS = {
  health: [
    { label: 'Jan', child: 45, parent: 50 },
    { label: 'Mar', child: 48, parent: 54 },
    { label: 'Jun', child: 52, parent: 58 },
    { label: 'Sep', child: 54, parent: 60 },
    { label: 'Dec', child: 55.6, parent: 61.1 },
  ],
  coping: [
    { label: 'Jan', child: 55, parent: 60 },
    { label: 'Mar', child: 58, parent: 64 },
    { label: 'Jun', child: 62, parent: 68 },
    { label: 'Sep', child: 65, parent: 70 },
    { label: 'Dec', child: 68.8, parent: 71.9 },
  ],
  social: [
    { label: 'Jan', child: 40, parent: 40 },
    { label: 'Mar', child: 45, parent: 45 },
    { label: 'Jun', child: 48, parent: 48 },
    { label: 'Sep', child: 50, parent: 50 },
    { label: 'Dec', child: 50.0, parent: 50.0 },
  ],
};

// Reconstructed from the CSV data provided
// Options are typically 5-point scales.
const OPTIONS_FREQUENCY = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'];
const OPTIONS_DIFFICULTY = ['Very easy', 'Quite easy', 'Not easy but not hard', 'Quite hard', 'Very hard'];
const OPTIONS_BOTHER = ['It does not bother me at all', 'It rarely bothers me', 'It sometimes bothers me', 'It often bothers me', 'It very often bothers me'];
// Parent versions often mirror these but with "my child"

export const QUESTIONS_DB: QuestionDetail[] = [
  {
    id: 1,
    category: 'Coping Adjustments',
    tag: 'Coping',
    childText: 'How easy is it to talk about your feelings?',
    parentText: 'Does your child find it easy to talk about their feelings?',
    options: OPTIONS_DIFFICULTY,
    childAnswer: 'Quite easy',
    childAnswerIndex: 1,
    parentAnswer: 'Not easy but not hard',
    parentAnswerIndex: 2,
    isDiscrepant: false
  },
  {
    id: 2,
    category: 'Social Emotional',
    tag: 'Social',
    childText: 'How easy is it for you to concentrate?',
    parentText: 'How easy is it for your child to concentrate?',
    options: OPTIONS_DIFFICULTY,
    childAnswer: 'Quite easy',
    childAnswerIndex: 1,
    parentAnswer: 'Quite easy',
    parentAnswerIndex: 1,
    isDiscrepant: false
  },
  {
    id: 3,
    category: 'Coping Adjustments',
    tag: 'Discrepant', // Tagged for filter demo
    childText: 'How do you feel about taking medicine everyday?',
    parentText: 'How does your child feel about taking medicine everyday?',
    options: OPTIONS_BOTHER,
    childAnswer: 'It rarely bothers me',
    childAnswerIndex: 1,
    parentAnswer: 'It often bothers my child',
    parentAnswerIndex: 3,
    isDiscrepant: true
  },
  {
    id: 5,
    category: 'Future Health',
    tag: 'Future',
    childText: 'How do you feel about changing to a health care team that takes care of adults when you get older?',
    parentText: 'How does your child feel about changing to a health care team that takes care of adults when they get older?',
    options: OPTIONS_BOTHER,
    childAnswer: 'It rarely bothers me',
    childAnswerIndex: 1,
    parentAnswer: 'It sometimes bothers my child',
    parentAnswerIndex: 2,
    isDiscrepant: false
  },
  {
    id: 8,
    category: 'Future Health',
    tag: 'Discrepant',
    childText: 'Do you worry if you miss taking your medicine?',
    parentText: 'Does your child worry if they miss taking their medicine?',
    options: OPTIONS_FREQUENCY,
    childAnswer: 'Never',
    childAnswerIndex: 0,
    parentAnswer: 'Often',
    parentAnswerIndex: 3,
    isDiscrepant: true
  },
  {
    id: 13,
    category: 'Future Health',
    tag: 'Discrepant',
    childText: 'Do you worry about infections you may get?',
    parentText: 'Does your child worry about getting infections?',
    options: OPTIONS_FREQUENCY,
    childAnswer: 'Rarely',
    childAnswerIndex: 1,
    parentAnswer: 'Very often',
    parentAnswerIndex: 4,
    isDiscrepant: true
  },
  {
    id: 14,
    category: 'Future Health',
    tag: 'Discrepant',
    childText: 'Do you think about needing another liver transplant in the future?',
    parentText: 'Does your child think about needing another liver transplant in the future?',
    options: OPTIONS_FREQUENCY,
    childAnswer: 'Never',
    childAnswerIndex: 0,
    parentAnswer: 'Sometimes',
    parentAnswerIndex: 2,
    isDiscrepant: true
  },
  {
    id: 16,
    category: 'Social Emotional',
    tag: 'Discrepant',
    childText: 'Do you feel that you have to stay away from people to make sure you do not get sick?',
    parentText: 'Does your child feel that they have to stay away from people to make sure they do not get sick?',
    options: OPTIONS_FREQUENCY,
    childAnswer: 'Sometimes',
    childAnswerIndex: 2,
    parentAnswer: 'Never',
    parentAnswerIndex: 0,
    isDiscrepant: true
  },
  {
    id: 24,
    category: 'Coping Adjustments',
    tag: 'Coping',
    childText: 'How do you feel about how your scar looks?',
    parentText: 'How does your child feel about how their scar looks?',
    options: ['I love how my scar looks', 'I like how my scar looks', 'I do not like or dislike', 'I dislike', 'I really dislike'],
    childAnswer: 'I like how my scar looks',
    childAnswerIndex: 1,
    parentAnswer: 'My child likes how their scar looks',
    parentAnswerIndex: 1,
    isDiscrepant: false
  },
  {
    id: 26,
    category: 'Social Emotional',
    tag: 'Social',
    childText: 'In the past two weeks, how have you been feeling?',
    parentText: 'In the past two weeks, how has your child been feeling?',
    options: ['Excellent', 'Very well', 'Well', 'Not very well', 'Terrible'],
    childAnswer: 'Very well',
    childAnswerIndex: 1,
    parentAnswer: 'Well',
    parentAnswerIndex: 2,
    isDiscrepant: false
  }
];

export const FILTER_OPTIONS = [
  FilterType.ALL,
  FilterType.SOCIAL,
  FilterType.FUTURE,
  FilterType.COPING,
  FilterType.DISCREPANT,
];
