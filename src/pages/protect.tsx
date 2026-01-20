import { HeadingField, CardLayout, ButtonWidget } from '@pglevy/sailwind'
import { Link } from 'wouter'
import { useState } from 'react'
import { Shield, AlertTriangle, Zap } from 'lucide-react'

type GroupingMode = 'input-output' | 'security-level' | 'detection-method'

export default function Protect() {
  const [groupingMode, setGroupingMode] = useState<GroupingMode>('input-output')

  const guardrails = {
    'prompt_injection': { name: 'Prompt Injection', description: 'Detect and block jailbreak attempts', icon: Shield },
    'pii_scrubbing': { name: 'PII Scrubbing', description: 'Remove sensitive personal information', icon: Shield },
    'topic_filtering': { name: 'Topic Filtering', description: 'Block restricted topics and content', icon: AlertTriangle },
    'hallucination_check': { name: 'Hallucination Check', description: 'Verify factual accuracy of responses', icon: Zap },
    'toxicity_filter': { name: 'Toxicity Filter', description: 'Remove harmful or offensive content', icon: AlertTriangle },
    'format_validation': { name: 'Format Validation', description: 'Ensure proper response structure', icon: Zap }
  }

  const getGroupedGuardrails = () => {
    switch (groupingMode) {
      case 'input-output':
        return {
          'Input Guardrails': ['prompt_injection', 'pii_scrubbing', 'topic_filtering'],
          'Output Guardrails': ['hallucination_check', 'toxicity_filter', 'format_validation']
        }
      case 'security-level':
        return {
          'Security & Cyber-Defense': ['prompt_injection', 'malicious_code_detection', 'sensitive_data_leakage'],
          'Privacy & Compliance': ['pii_scrubbing', 'pii_redaction', 'compliance_check'],
          'Brand & Safety': ['toxicity_filter', 'topic_filtering'],
          'Knowledge Integrity': ['hallucination_check', 'factual_accuracy']
        }
      case 'detection-method':
        return {
          'Pattern-Based': ['pii_scrubbing', 'format_validation', 'topic_filtering'],
          'AI-Based': ['prompt_injection', 'hallucination_check', 'toxicity_filter']
        }
    }
  }

  const groupedGuardrails = getGroupedGuardrails()

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">← Back to Home</Link>
        
        <HeadingField
          text="Protect - Guardrail Configuration"
          size="LARGE"
          headingTag="H1"
          marginBelow="MORE"
        />

        {/* Guardrail Groups */}
        <div className="space-y-6">
          {Object.entries(groupedGuardrails).map(([groupName, guardrailKeys]) => (
            <CardLayout key={groupName} padding="MORE" showShadow={true}>
              <div className="flex items-center justify-between mb-4">
                <HeadingField text={groupName} size="MEDIUM" marginBelow="NONE" />
                <div className="flex items-center gap-3">
                  <select 
                    value={groupingMode}
                    onChange={(e) => setGroupingMode(e.target.value as GroupingMode)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                  >
                    <option value="input-output">Version 1: Input/Output</option>
                    <option value="security-level">Version 2: Security Level</option>
                    <option value="detection-method">Version 3: Detection Method</option>
                  </select>
                  <ButtonWidget
                    label="Add Guardrail"
                    style="OUTLINE"
                    color="ACCENT"
                    onClick={() => console.log(`Add guardrail to ${groupName}`)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {guardrailKeys.map((key: string) => {
                  const guardrail = guardrails[key as keyof typeof guardrails]
                  const IconComponent = guardrail.icon
                  return (
                    <div
                      key={key}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent size={16} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{guardrail.name}</h3>
                          <p className="text-sm text-gray-600">{guardrail.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardLayout>
          ))}
        </div>
      </div>
    </div>
  )
}
