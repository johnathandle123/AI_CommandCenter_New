import { HeadingField, CardLayout, ButtonWidget } from '@pglevy/sailwind'
import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'

function PositiveConfiguration() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-sm font-medium text-gray-700">Allowed Domain</label>
          <div className="relative group">
            <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute left-6 top-0 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              Define your "Safe Zone" - only these topics are allowed
            </div>
          </div>
        </div>
        <textarea 
          placeholder="Example: Only answer questions related to HR policy and employee benefits."
          className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
          defaultValue="Only answer questions related to HR policy and employee benefits."
        />
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-sm font-medium text-gray-700">Allowed Topics</label>
          <div className="relative group">
            <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute left-6 top-0 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              Specific topics that are explicitly allowed
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="HR Policies" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button className="text-red-500 hover:text-red-700 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="Employee Benefits" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button className="text-red-500 hover:text-red-700 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="Company Procedures" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button className="text-red-500 hover:text-red-700 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add topic
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">Out-of-Domain (OOD) Sensitivity</label>
        <div className="mb-2">
          <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full" />
        </div>
        <div className="flex justify-between text-xs">
          <div className="text-center">
            <div className="font-medium text-gray-700">Lenient (0.3)</div>
            <div className="text-gray-500">Allow some deviation</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">Moderate (0.7)</div>
            <div className="text-gray-500">Standard boundaries</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">Strict (0.9)</div>
            <div className="text-gray-500">Very narrow focus</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Threshold</label>
        <div className="mb-2">
          <input type="range" min="0" max="1" step="0.05" defaultValue="0.8" className="w-full" />
        </div>
        <div className="text-sm text-gray-600 mb-2">
          The model must be 80% sure the prompt is "On-Topic" to proceed. If uncertain, defaults to refusal.
        </div>
        <div className="flex justify-between text-xs">
          <div className="text-center">
            <div className="font-medium text-gray-700">Low (0.5)</div>
            <div className="text-gray-500">Accept uncertain topics</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">High (0.8)</div>
            <div className="text-gray-500">Require high confidence</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">Very High (0.95)</div>
            <div className="text-gray-500">Only obvious matches</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-sm font-medium text-gray-700">Refusal Message</label>
          <div className="relative group">
            <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute left-6 top-0 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              Message shown when topics are outside allowed domain
            </div>
          </div>
        </div>
        <textarea 
          placeholder="I can only help with HR policies and employee benefits. Please ask about those topics."
          className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
          defaultValue="I can only help with HR policies and employee benefits. Please ask about those topics."
        />
      </div>
    </div>
  )
}

function LLMConfiguration() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-sm font-medium text-gray-700">Denied Topics (Taxonomy)</label>
          <div className="relative group">
            <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute left-6 top-0 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              High-level categories to block based on semantic meaning
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="Medical Advice" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button className="text-red-500 hover:text-red-700 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="Financial Forecasting" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button className="text-red-500 hover:text-red-700 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="Adult Content" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button className="text-red-500 hover:text-red-700 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="Politics" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button className="text-red-500 hover:text-red-700 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add topic
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-sm font-medium text-gray-700">Topic Definitions</label>
          <div className="relative group">
            <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute left-6 top-0 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              One-sentence descriptions for each denied topic
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Medical Advice:</label>
            <input 
              type="text" 
              defaultValue="Any content that suggests a diagnosis, drug dosage, or treatment plan."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Financial Forecasting:</label>
            <input 
              type="text" 
              defaultValue="Predictions about market performance, investment returns, or economic outcomes."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Adult Content:</label>
            <input 
              type="text" 
              defaultValue="Sexually explicit material or content inappropriate for general audiences."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Politics:</label>
            <input 
              type="text" 
              defaultValue="Political opinions, candidate endorsements, or partisan discussions."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mt-1"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-sm font-medium text-gray-700">Few-Shot Examples</label>
          <div className="relative group">
            <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute left-6 top-0 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              Examples to help the model understand topic boundaries
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="On-Topic: How do I update my account settings?" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button className="text-red-500 hover:text-red-700 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="Off-Topic: What should I invest in for retirement?" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button className="text-red-500 hover:text-red-700 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="On-Topic: Can you explain your privacy policy?" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button className="text-red-500 hover:text-red-700 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add example
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">Similarity Threshold</label>
        <div className="mb-2">
          <input type="range" min="0" max="1" step="0.05" defaultValue="0.75" className="w-full" />
        </div>
        <div className="flex justify-between text-xs">
          <div className="text-center">
            <div className="font-medium text-gray-700">Permissive (0.5)</div>
            <div className="text-gray-500">Allow borderline topics</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">Balanced (0.75)</div>
            <div className="text-gray-500">Standard filtering</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">Strict (0.9)</div>
            <div className="text-gray-500">Block similar topics</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeuristicConfiguration() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-sm font-medium text-gray-700">Denied Keywords</label>
          <div className="relative group">
            <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute left-6 top-0 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              Block messages containing these specific words or phrases
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="bitcoin" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button className="text-red-500 hover:text-red-700 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="election" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button className="text-red-500 hover:text-red-700 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="competitor_name" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button className="text-red-500 hover:text-red-700 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add keyword
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-3">Match Type</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="radio" name="matchType" value="exact" defaultChecked className="mr-2" />
            <div>
              <span className="text-sm font-medium">Exact</span>
              <div className="text-sm text-gray-600">Block only the specific word</div>
            </div>
          </label>
          <label className="flex items-center">
            <input type="radio" name="matchType" value="fuzzy" className="mr-2" />
            <div>
              <span className="text-sm font-medium">Fuzzy/Partial</span>
              <div className="text-sm text-gray-600">Block words containing the keyword (e.g., "election" blocks "elections")</div>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-3">Action on Match</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="radio" name="action" value="reject" defaultChecked className="mr-2" />
            <div>
              <span className="text-sm font-medium">REJECT</span>
              <div className="text-sm text-gray-600">Stop the conversation immediately</div>
            </div>
          </label>
          <label className="flex items-center">
            <input type="radio" name="action" value="redirect" className="mr-2" />
            <div>
              <span className="text-sm font-medium">REDIRECT</span>
              <div className="text-sm text-gray-600">Send user to specific URL or department</div>
            </div>
          </label>
        </div>
        <div className="mt-3">
          <input 
            type="text" 
            placeholder="Redirect URL (e.g., https://example.com/finance)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <div>
            <span className="text-sm font-medium">Case Sensitivity</span>
            <div className="text-sm text-gray-600">Determine if capitalization matters</div>
          </div>
        </label>
      </div>
    </div>
  )
}

export default function TopicFiltering() {
  const [selectedMode, setSelectedMode] = useState<'heuristic' | 'llm' | 'positive'>('heuristic')

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Guardrails
          </button>
          <HeadingField text="Topic Filtering Configuration" size="LARGE" marginBelow="NONE" />
        </div>

        <div className="grid grid-cols-[1fr_1fr] gap-6 min-h-[calc(100vh-200px)]">
          {/* Left Pane - Configuration */}
          <div className="space-y-6">
            <CardLayout padding="MORE" showShadow={true}>
              <HeadingField text="Configuration" size="MEDIUM" marginBelow="STANDARD" />
              
              {/* Mode Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Filtering Mode</label>
                <div className="space-y-2">
                  <label className="flex items-start cursor-pointer">
                    <input 
                      type="radio" 
                      name="mode" 
                      value="heuristic"
                      checked={selectedMode === 'heuristic'}
                      onChange={(e) => setSelectedMode(e.target.value as 'heuristic')}
                      className="mr-3 mt-1" 
                    />
                    <div>
                      <span className="text-sm font-medium">Heuristic (Keyword-Based)</span>
                      <div className="text-sm text-gray-600">Fast blocking using specific words and phrases</div>
                    </div>
                  </label>
                  <label className="flex items-start cursor-pointer">
                    <input 
                      type="radio" 
                      name="mode" 
                      value="llm"
                      checked={selectedMode === 'llm'}
                      onChange={(e) => setSelectedMode(e.target.value as 'llm')}
                      className="mr-3 mt-1" 
                    />
                    <div>
                      <span className="text-sm font-medium">LLM-Based (Semantic)</span>
                      <div className="text-sm text-gray-600">Smart filtering using AI to understand meaning</div>
                    </div>
                  </label>
                  <label className="flex items-start cursor-pointer">
                    <input 
                      type="radio" 
                      name="mode" 
                      value="positive"
                      checked={selectedMode === 'positive'}
                      onChange={(e) => setSelectedMode(e.target.value as 'positive')}
                      className="mr-3 mt-1" 
                    />
                    <div>
                      <span className="text-sm font-medium">Positive Filtering (Domain Constraint)</span>
                      <div className="text-sm text-gray-600">Only allow specific topics, block everything else</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Configuration Content Based on Selected Mode */}
              {selectedMode === 'heuristic' && (
                <HeuristicConfiguration />
              )}
              
              {selectedMode === 'llm' && (
                <LLMConfiguration />
              )}
              
              {selectedMode === 'positive' && (
                <PositiveConfiguration />
              )}
            </CardLayout>
          </div>

          {/* Right Pane - Testing */}
          <div className="space-y-6">
            <HeadingField text="Test Configuration" size="LARGE" marginBelow="STANDARD" />
            
            <CardLayout padding="MORE" showShadow={true}>
              <HeadingField text="Input Test" size="MEDIUM" marginBelow="STANDARD" />
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Input</label>
                  <textarea 
                    placeholder="Enter test input to validate against topic filtering..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                  />
                </div>
                <ButtonWidget
                  label="Test Filter"
                  style="SOLID"
                  color="ACCENT"
                  size="STANDARD"
                />
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Results</label>
                <div className="bg-gray-50 rounded-lg p-4 min-h-32">
                  <p className="text-gray-500 text-sm">Test results will appear here...</p>
                </div>
              </div>
            </CardLayout>
          </div>
        </div>
      </div>
    </div>
  )
}
