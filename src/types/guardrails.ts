// Input Guardrail Types
export interface PromptInjectionGuardrail {
  type: 'prompt_injection'
  sensitivityThreshold: number // 0.0 - 1.0
  detectionMode: 'heuristic' | 'llm_classifier'
  actionOnMatch: 'block' | 'sanitize' | 'flag'
}

export interface PIIScrubbingGuardrail {
  type: 'pii_scrubbing'
  entitySelectors: ('SSN' | 'EMAIL' | 'CREDIT_CARD' | 'IP_ADDRESS' | 'PHONE_NUMBER')[]
  anonymizationMethod: 'masking' | 'redaction' | 'hashing'
  confidenceScore: number // threshold > 0.85
}

export interface TopicFilteringGuardrail {
  type: 'topic_filtering'
  deniedTopics: string[]
  allowedTopics?: string[]
  semanticSimilarityThreshold: number // cosine similarity score
}

export type InputGuardrail = PromptInjectionGuardrail | PIIScrubbingGuardrail | TopicFilteringGuardrail

// Output Guardrail Types
export interface HallucinationCheckGuardrail {
  type: 'hallucination_check'
  groundingThreshold: number // 0.0 - 1.0
  nliLogic: 'entails' | 'neutral' | 'contradicts'
  citationsRequired: boolean
}

export interface ToxicityFilterGuardrail {
  type: 'toxicity_filter'
  severityLevels: {
    hate: 'low' | 'medium' | 'high'
    sexual: 'low' | 'medium' | 'high'
    violence: 'low' | 'medium' | 'high'
    selfHarm: 'low' | 'medium' | 'high'
  }
  targetTone: 'neutral' | 'positive' | 'professional'
  toneTolerance: number // +/- 0.2
}

export interface FormatValidationGuardrail {
  type: 'format_validation'
  schema: object // JSON Schema
  retryLimit: number
  lengthConstraints: {
    minTokens: number
    maxTokens: number
  }
}

export type OutputGuardrail = HallucinationCheckGuardrail | ToxicityFilterGuardrail | FormatValidationGuardrail

// Main Configuration
export interface GuardrailConfig {
  input: InputGuardrail[]
  output: OutputGuardrail[]
}
