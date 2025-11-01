
import React from 'react';
import { Question } from './types';

// --- Icon Components ---

const ExerciseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  // FIX: Replaced JSX with React.createElement to fix TypeScript errors in a .ts file.
  React.createElement('svg', { ...props, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('circle', { cx: "12", cy: "5", r: "1" }),
    React.createElement('path', { d: "m9 20 3-6 3 6" }),
    React.createElement('path', { d: "m6 12 6-3 6 3" }),
    React.createElement('path', { d: "M12 11v4" })
  )
);

const DietIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  // FIX: Replaced JSX with React.createElement to fix TypeScript errors in a .ts file.
  React.createElement('svg', { ...props, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" }),
    React.createElement('path', { d: "M10 2c1 .5 2 2 2 5" })
  )
);

const SleepIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  // FIX: Replaced JSX with React.createElement to fix TypeScript errors in a .ts file.
  React.createElement('svg', { ...props, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" })
  )
);

const StressIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  // FIX: Replaced JSX with React.createElement to fix TypeScript errors in a .ts file.
  React.createElement('svg', { ...props, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M22 17a5 5 0 0 0-8.59-3.59A3.5 3.5 0 0 0 9.5 9.5a5.5 5.5 0 0 0-1.25 10.74" }),
    React.createElement('path', { d: "m13 12-4 5h6l-4 5" })
  )
);

const MentalWellbeingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { ...props, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('circle', { cx: "12", cy: "12", r: "10" }),
    React.createElement('path', { d: "M8 14s1.5-2 4-2 4 2 4 2" }),
    React.createElement('line', { x1: "9", y1: "9", x2: "9.01", y2: "9" }),
    React.createElement('line', { x1: "15", y1: "9", x2: "15.01", y2: "9" })
  )
);

const SmokingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  // FIX: Replaced JSX with React.createElement to fix TypeScript errors in a .ts file.
  React.createElement('svg', { ...props, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('line', { x1: "2", y1: "2", x2: "22", y2: "22" }),
    React.createElement('path', { d: "M12 12H2v4h10" }),
    React.createElement('path', { d: "M18 12h-5v4h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z" }),
    React.createElement('path', { d: "M22 12v4" })
  )
);

const AlcoholIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  // FIX: Replaced JSX with React.createElement to fix TypeScript errors in a .ts file.
  React.createElement('svg', { ...props, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M8 22h8" }),
    React.createElement('path', { d: "M12 15v7" }),
    React.createElement('path', { d: "M12 15a5 5 0 0 0 5-5c0-2-1-4-4-6-1-.6-2-1-3-1s-2 .4-3 1c-3 2-4 4-4 6a5 5 0 0 0 5 5Z" })
  )
);

const SocialIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { ...props, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
    React.createElement('circle', { cx: "9", cy: "7", r: "4" }),
    React.createElement('path', { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
    React.createElement('path', { d: "M16 3.13a4 4 0 0 1 0 7.75" })
  )
);


// --- Questions ---

export const QUESTIONS: Question[] = [
  {
    id: 'exercise',
    text: 'On average, how many minutes of moderate physical activity (e.g., brisk walking, cycling) do you get per week?',
    type: 'radio',
    options: ['Less than 30 minutes', '30-75 minutes', '75-150 minutes', 'More than 150 minutes'],
    icon: ExerciseIcon,
  },
  {
    id: 'diet',
    text: 'How would you describe your typical diet?',
    type: 'radio',
    options: ['Mostly processed foods', 'A mix of processed and whole foods', 'Mostly whole foods', 'Strictly whole foods'],
    icon: DietIcon,
  },
  {
    id: 'nutrition',
    text: 'How many servings of fruits and vegetables do you eat on an average day?',
    type: 'radio',
    options: ['0-1 servings', '2-3 servings', '4-5 servings', 'More than 5 servings'],
    icon: DietIcon,
  },
  {
    id: 'sleep',
    text: 'On average, how many hours of quality sleep do you get per night?',
    type: 'radio',
    options: ['Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours'],
    icon: SleepIcon,
  },
  {
    id: 'stress',
    text: 'How would you rate your daily stress levels?',
    type: 'radio',
    options: ['Very high', 'High', 'Moderate', 'Low'],
    icon: StressIcon,
  },
  {
    id: 'mental',
    text: 'How would you rate your general mood and mental well-being?',
    type: 'radio',
    options: ['Generally low or anxious', 'Some ups and downs', 'Mostly positive', 'Very positive and resilient'],
    icon: MentalWellbeingIcon,
  },
  {
    id: 'smoking',
    text: 'Do you smoke tobacco products?',
    type: 'radio',
    options: ['Yes, daily', 'Yes, occasionally', 'I quit recently', 'Never'],
    icon: SmokingIcon,
  },
  {
    id: 'alcohol',
    text: 'How often do you consume alcoholic beverages?',
    type: 'radio',
    options: ['Multiple times a day', 'Daily', 'A few times a week', 'Rarely or never'],
    icon: AlcoholIcon,
  },
  {
    id: 'social',
    text: 'How satisfied are you with your social connections (friends, family, community)?',
    type: 'radio',
    options: ['Not satisfied, feel isolated', 'Somewhat satisfied', 'Generally satisfied', 'Very satisfied and connected'],
    icon: SocialIcon,
  },
];
