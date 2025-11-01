import React, { useState, useEffect, lazy, Suspense } from 'react';
import { QUESTIONS } from './constants';
import { Answers, HealthResult, HistoricalEntry } from './types';
import { estimateHealth } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import ProgressTracker from './components/ProgressTracker';
import ThemeToggle from './components/ThemeToggle';

const ResultsDisplay = lazy(() => import('./components/ResultsDisplay'));

// --- Local Storage Helpers ---
const HISTORY_KEY = 'healthEstimateHistory';
const PROGRESS_KEY = 'healthEstimateProgress'; // Key for saving in-progress assessment

const getHistory = (): HistoricalEntry[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    return [];
  }
};

const saveToHistory = (result: HealthResult, answers: Answers) => {
  try {
    const history = getHistory();
    const newEntry: HistoricalEntry = {
      id: new Date().toISOString(),
      score: result.overallScore,
      // Format date to be short and readable e.g., "Jul 20"
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      result,
      answers,
    };
    // Keep the last 10 entries to avoid bloating localStorage
    const updatedHistory = [...history, newEntry].slice(-10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
  }
};

const getSavedProgress = (): { step: number; answers: Answers } => {
  try {
    const savedProgressJson = localStorage.getItem(PROGRESS_KEY);
    if (savedProgressJson) {
      const { step, answers } = JSON.parse(savedProgressJson);
      // Add validation to ensure the data is in the expected format
      if (typeof step === 'number' && typeof answers === 'object' && answers !== null) {
        return { step, answers };
      }
    }
  } catch (error) {
    console.error("Failed to parse progress from localStorage", error);
    // If parsing fails, remove the invalid item to prevent future errors
    localStorage.removeItem(PROGRESS_KEY);
  }
  return { step: 0, answers: {} };
};
// -----------------------------


const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(() => getSavedProgress().step);
  const [answers, setAnswers] = useState<Answers>(() => getSavedProgress().answers);
  const [healthResult, setHealthResult] = useState<HealthResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectionFeedbackOption, setSelectionFeedbackOption] = useState<string | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    // Save progress whenever the step or answers change, as long as we are not viewing results
    if (!healthResult) {
      try {
        const progress = {
          step: currentStep,
          answers: answers,
        };
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      } catch (error) {
        console.error("Failed to save progress to localStorage", error);
      }
    }
  }, [currentStep, answers, healthResult]);

  useEffect(() => {
    // Clear feedback when the question changes to prevent re-triggering on navigation
    setSelectionFeedbackOption(null);
  }, [currentStep]);

  useEffect(() => {
    // Create a temporary visual effect for the selected option
    if (selectionFeedbackOption) {
      const timer = setTimeout(() => {
        setSelectionFeedbackOption(null);
      }, 500); // Duration of the feedback effect
      return () => clearTimeout(timer);
    }
  }, [selectionFeedbackOption]);


  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setSelectionFeedbackOption(value); // Trigger feedback
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      // FIX: Changed step increment to decrement for 'Back' button functionality.
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await estimateHealth(answers);
      setHealthResult(result);
      saveToHistory(result, answers); // Save full result and answers to history
      localStorage.removeItem(PROGRESS_KEY); // Clear saved progress on completion
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setHealthResult(null);
    setError(null);
    localStorage.removeItem(PROGRESS_KEY); // Clear saved progress on reset
  };

  const currentQuestion = QUESTIONS[currentStep];
  const isAnswered = answers[currentQuestion?.id] !== undefined;

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return (
        <div className="text-center p-8 bg-red-100 dark:bg-red-900/50 border border-red-400 rounded-lg">
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-300">An Error Occurred</h3>
          <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
          <button onClick={handleReset} className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition">
            Try Again
          </button>
        </div>
      );
    }
    if (healthResult) {
      const history = getHistory();
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <ResultsDisplay result={healthResult} onReset={handleReset} history={history} />
        </Suspense>
      );
    }
    
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <ProgressTracker totalSteps={QUESTIONS.length} currentStep={currentStep} />
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">

          <div className="p-6 md:p-8">
            <div className="md:flex md:items-center md:space-x-6 text-center md:text-left mb-8">
              <div className="flex justify-center md:justify-start mb-4 md:mb-0">
                  <div className="flex-shrink-0 h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center ring-4 ring-indigo-50 dark:ring-indigo-900/20">
                      <currentQuestion.icon className="h-12 w-12 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  </div>
              </div>
              <h2 className="text-lg md:text-xl leading-tight text-gray-700 dark:text-gray-300">{currentQuestion.text}</h2>
            </div>
            
            <div className="space-y-3">
              {currentQuestion.options.map(option => (
                <label 
                  key={option} 
                  className={`flex items-center p-4 border-2 dark:border-gray-600 rounded-lg cursor-pointer transition-all duration-300 transform hover:bg-indigo-50 dark:hover:bg-gray-700 has-[:checked]:bg-indigo-100 has-[:checked]:border-indigo-500 dark:has-[:checked]:bg-indigo-900/50 dark:has-[:checked]:border-indigo-500 ring-2 ${selectionFeedbackOption === option ? 'scale-105 ring-indigo-400' : 'ring-transparent'}`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleAnswerChange(currentQuestion.id, option)}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-4 text-base text-gray-700 dark:text-gray-200">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-2 text-base font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Back
              </button>
              {currentStep < QUESTIONS.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  className="px-6 py-2 text-base font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isAnswered}
                  className="px-6 py-2 text-base font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Get My Estimate
                </button>
              )}
            </div>
          </div>
        </div>
        {currentStep === QUESTIONS.length - 1 && (
            <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
              This is an AI-generated estimation and not a substitute for professional medical advice. Consult a healthcare provider for any health concerns.
            </p>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen flex flex-col justify-center p-4 font-sans">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex justify-between items-center no-print">
            <div className="flex items-center justify-start gap-x-3 sm:gap-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-20 md:w-20 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        AI Overall Health Estimator
                    </h1>
                    <p className="mt-1 text-xs md:text-sm font-bold text-red-600 dark:text-red-500">Answer a few questions for an AI health estimation</p>
                </div>
            </div>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        <div className="w-full max-w-4xl mx-auto">{renderContent()}</div>
      </div>
    </main>
  );
};

export default App;