import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { HealthResult, HistoricalEntry } from '../types';
import { QUESTIONS } from '../constants';

// --- Icon Components ---
const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.186 2.25 2.25 0 00-3.933 2.186z" />
  </svg>
);

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
  </svg>
);

const PrintIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6 18.25m0-4.421c.24.03.48.062.72.096m-1.141-0a2.253 2.253 0 01-2.253-2.253V4.5A2.253 2.253 0 016.75 2.25h10.5c1.243 0 2.253 1.01 2.253 2.253v7.076c0 .99-.646 1.836-1.547 2.122m-13.409 0a2.253 2.253 0 012.253 2.253h8.312a2.253 2.253 0 012.253-2.253m-12.818 0A2.253 2.253 0 005.609 18h12.781c.99 0 1.836-.646 2.122-1.547m-16.903 0a2.253 2.253 0 00-2.253 2.253v.004c0 1.242 1.01 2.253 2.253 2.253h12.781c1.243 0 2.253-1.01 2.253-2.253v-.004a2.253 2.253 0 00-2.253-2.253m-12.818 0h12.818" />
  </svg>
);


interface ResultsDisplayProps {
  result: HealthResult;
  onReset: () => void;
  history: HistoricalEntry[];
}

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const data = [{ name: 'score', value: score }];
  const scoreColor = score >= 50 ? '#10B981' : '#EF4444';

  return (
    <div className="w-48 h-48 md:w-56 md:h-56 mx-auto relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={-180}
          barSize={20}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background
            dataKey="value"
            angleAxisId={0}
            fill={scoreColor}
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl md:text-5xl font-bold" style={{ color: scoreColor }}>{score}</span>
          <span className="text-lg text-gray-500 dark:text-gray-400">/100</span>
        </div>
      </div>
    </div>
  );
};

const HistoryChart: React.FC<{ data: HistoricalEntry[] }> = ({ data }) => {
  if (data.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        <p className="text-center text-gray-600 dark:text-gray-300 font-medium">
          Your progress chart will appear here.
        </p>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-1">
          Complete the assessment again to start tracking your score.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.7}/>
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
          <XAxis dataKey="date" tick={{ fill: 'currentColor' }} className="text-xs text-gray-600 dark:text-gray-400" />
          <YAxis dataKey="score" domain={[0, 100]} tick={{ fill: 'currentColor' }} className="text-xs text-gray-600 dark:text-gray-400" />
          <Tooltip
            cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: 'rgba(31, 41, 55, 0.9)',
              borderColor: 'rgba(75, 85, 99, 0.5)',
              borderRadius: '0.5rem',
              color: '#f3f4f6'
            }}
            labelStyle={{ fontWeight: 'bold' }}
            itemStyle={{ color: '#a5b4fc', fontWeight: 'bold' }}
          />
          <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" name="Health Score" />
          <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} name="Health Score" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Helper to find the right icon for a result point ---
const FallbackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const getIconForPoint = (category: string): React.FC<React.SVGProps<SVGSVGElement>> => {
  const lowerCategory = category.toLowerCase();
  const question = QUESTIONS.find(q => q.id === lowerCategory);
  return question ? question.icon : FallbackIcon;
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset, history }) => {
  const [isShareLinkCopied, setIsShareLinkCopied] = useState(false);
  const [isResultCopied, setIsResultCopied] = useState(false);
  const [localHistory, setLocalHistory] = useState<HistoricalEntry[]>(history);

  const [displayedResult, setDisplayedResult] = useState<HealthResult>(result);
  const latestEntryInHistory = history.length > 0 ? history[history.length - 1] : null;
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(latestEntryInHistory ? latestEntryInHistory.id : null);
  
  useEffect(() => {
    setLocalHistory(history);
    setDisplayedResult(result);
    const newLatest = history.length > 0 ? history[history.length - 1] : null;
    setActiveHistoryId(newLatest ? newLatest.id : null);
  }, [history, result]);

  const handleViewHistory = (entry: HistoricalEntry) => {
    setDisplayedResult(entry.result);
    setActiveHistoryId(entry.id);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    const textToCopy = `
My AI Health Estimate
Score: ${displayedResult.overallScore}/100

Summary:
${displayedResult.summary}

Positive Points:
${displayedResult.positivePoints.map(p => `- ${p.point}`).join('\n')}

Areas for Improvement:
${displayedResult.areasForImprovement.map(a => `- ${a.point}`).join('\n')}

Health Tips:
${displayedResult.healthTips.map(t => `- ${t.category}: ${t.tip}`).join('\n')}

Disclaimer: ${displayedResult.disclaimer}
    `.trim().replace(/^\s+/gm, '');
  
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsResultCopied(true);
      setTimeout(() => setIsResultCopied(false), 2500);
    } catch (error) {
      console.error('Failed to copy results to clipboard:', error);
      alert('Could not copy results to clipboard.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My AI Health Estimate',
      text: `I just got my AI health estimate! My score is ${displayedResult.overallScore}/100. Summary: "${displayedResult.summary}"`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing results:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\nView the app: ${shareData.url}`);
        setIsShareLinkCopied(true);
        setTimeout(() => setIsShareLinkCopied(false), 2500);
      } catch (error) {
        console.error('Failed to copy results to clipboard:', error);
        alert('Could not copy results to clipboard. You can manually copy the summary from the page.');
      }
    }
  };
  
  const handleClearHistory = () => {
    const isConfirmed = window.confirm("Are you sure you want to clear your health history? This action cannot be undone.");
    if (isConfirmed) {
        try {
            localStorage.removeItem('healthEstimateHistory');
            setLocalHistory([]);
        } catch (error) {
            console.error("Failed to clear history", error);
            alert("Could not clear history. Please try again.");
        }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Hero Section: Score and Summary */}
      <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">Your Health Estimate</h2>
        <ScoreGauge score={displayedResult.overallScore} />
        <p className="mt-6 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{displayedResult.summary}</p>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6" style={{ animationDelay: '150ms' }}>
          <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
            Positive Points
          </h3>
          <div className="space-y-4">
            {displayedResult.positivePoints.map((item, index) => {
              const Icon = getIconForPoint(item.category);
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center ring-4 ring-green-50 dark:ring-green-900/20">
                    <Icon className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{item.point}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6" style={{ animationDelay: '300ms' }}>
          <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-400 mb-4">
            Areas for Improvement
          </h3>
          <div className="space-y-4">
            {displayedResult.areasForImprovement.map((item, index) => {
              const Icon = getIconForPoint(item.category);
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center ring-4 ring-amber-50 dark:ring-amber-900/20">
                    <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{item.point}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {localHistory && localHistory.length > 0 && (
        <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6" style={{ animationDelay: '450ms' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              Your Progress Over Time
            </h3>
            <button 
              onClick={handleClearHistory} 
              className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded"
              aria-label="Clear health history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Clear History
            </button>
          </div>
          <HistoryChart data={localHistory} />
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Assessment History</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {localHistory.slice().reverse().map(entry => (
                <div key={entry.id} className={`p-3 rounded-lg transition-colors ${activeHistoryId === entry.id ? 'bg-indigo-50 dark:bg-indigo-900/40 ring-2 ring-indigo-300' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{entry.date}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Score: {entry.score}</p>
                    </div>
                    <button
                      onClick={() => handleViewHistory(entry)}
                      disabled={activeHistoryId === entry.id}
                      className="px-4 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-900/70 dark:text-indigo-300 dark:hover:bg-indigo-900"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6" style={{ animationDelay: '600ms' }}>
        <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Actionable Health Tips
        </h3>
        <div className="space-y-4">
          {displayedResult.healthTips.map((tip, index) => {
             const Icon = getIconForPoint(tip.category);
            return (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center ring-4 ring-indigo-50 dark:ring-indigo-900/20">
                  <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{tip.category}</p>
                  <p className="text-gray-600 dark:text-gray-300">{tip.tip}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="animate-fade-in no-print" style={{ animationDelay: '750ms' }}>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
            <button
              onClick={handleShare}
              className="flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-all transform hover:scale-105"
              aria-label="Share your health results"
            >
              <ShareIcon className="h-5 w-5 mr-2" />
              {isShareLinkCopied ? 'Link Copied!' : 'Share'}
            </button>
            <button
              onClick={handleCopy}
              disabled={isResultCopied}
              className="flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-all transform hover:scale-105 disabled:opacity-70"
              aria-label="Copy results to clipboard"
            >
              <CopyIcon className="h-5 w-5 mr-2" />
              {isResultCopied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-all transform hover:scale-105"
              aria-label="Print results"
            >
              <PrintIcon className="h-5 w-5 mr-2" />
              Print
            </button>
          </div>
          <button 
              onClick={onReset} 
              className="px-8 py-3 w-full sm:w-auto bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
              aria-label="Take the health assessment again"
          >
              Take the Assessment Again
          </button>
        </div>
        
        <div className="text-center mt-6 text-xs text-red-600 dark:text-red-500">
          <p><strong>Disclaimer:</strong> {displayedResult.disclaimer}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;