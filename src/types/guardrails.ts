// Input Guardrail Types
export interface PromptInjectionGuardrail {
  type: 'prompt_injection'
  sensitivityThreshold: number // 0.0 - 1.0
  detectionMode: 'heuristic' | 'llm_classifier'
  actionOnMatch: 'block' | 'sanitize' | 'flag'
  
  // V2: Detection Method & Thresholds
  confidenceThreshold: number // 0.7 - 0.9, determines certainty before blocking
  scannerEngine: 'pattern_based' | 'model_based' // pattern_based: regex-heavy, model_based: LlamaGuard 3/PromptGuard
  includeReasoning: boolean // returns why input was flagged for audit logs
  
  // V2: Advanced Heuristic Patterns
  instructionKeywords: string[] // e.g., ["ignore all previous", "developer mode", "system prompt", "verbatim", "disregard guidelines"]
  encodingDetection: {
    detectBase64: boolean
    detectHexEncoding: boolean
    detectLeetspeak: boolean // e.g., "h4ck3d"
  }
  obfuscationFilters: {
    detectZeroWidthSpaces: boolean
    detectHiddenUnicode: boolean // invisible characters that confuse tokenizers
  }
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

// V2 Jailbreak Detection Default Configuration Example
export const defaultJailbreakGuardrail: PromptInjectionGuardrail = {
  type: 'prompt_injection',
  sensitivityThreshold: 0.8,
  detectionMode: 'llm_classifier',
  actionOnMatch: 'block',
  
  // V2: Detection Method & Thresholds
  confidenceThreshold: 0.75, // Start lower in development, raise if too many false positives
  scannerEngine: 'model_based', // Use LlamaGuard 3 or PromptGuard for better accuracy
  includeReasoning: true, // Essential for audit logs and debugging
  
  // V2: Advanced Heuristic Patterns
  instructionKeywords: [
    "ignore all previous",
    "developer mode", 
    "system prompt",
    "verbatim",
    "disregard guidelines",
    "override instructions",
    "bypass safety",
    "jailbreak mode"
  ],
  encodingDetection: {
    detectBase64: true,
    detectHexEncoding: true,
    detectLeetspeak: true
  },
  obfuscationFilters: {
    detectZeroWidthSpaces: true,
    detectHiddenUnicode: true
  }
}

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
