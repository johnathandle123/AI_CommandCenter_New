// Stakeholder-Based Guardrail Organization
// Version 2: Security Level - Persona-Based Grouping

// A. Security & Cyber-Defense
// Focus: Protecting the infrastructure from attacks
export interface PromptInjectionGuardrail {
  type: 'prompt_injection'
  category: 'security_cyber_defense'
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

export interface MaliciousCodeGuardrail {
  type: 'malicious_code_detection'
  category: 'security_cyber_defense'
  codePatterns: string[]
  languageSupport: ('javascript' | 'python' | 'sql' | 'bash')[]
  actionOnMatch: 'block' | 'sanitize' | 'flag'
}

export interface DataLeakageGuardrail {
  type: 'sensitive_data_leakage'
  category: 'security_cyber_defense'
  dataTypes: ('api_keys' | 'passwords' | 'tokens' | 'certificates')[]
  scanDepth: 'surface' | 'deep'
  actionOnMatch: 'block' | 'redact'
}

// B. Privacy & Compliance
// Focus: Legal liability and data regulations (GDPR/HIPAA)
export interface PIIScrubbingGuardrail {
  type: 'pii_scrubbing'
  category: 'privacy_compliance'
  entitySelectors: ('SSN' | 'EMAIL' | 'CREDIT_CARD' | 'IP_ADDRESS' | 'PHONE_NUMBER')[]
  anonymizationMethod: 'masking' | 'redaction' | 'hashing'
  confidenceScore: number // threshold > 0.85
}

export interface PIIRedactionGuardrail {
  type: 'pii_redaction'
  category: 'privacy_compliance'
  outputScrubbing: boolean
  retentionPolicy: 'immediate' | 'delayed' | 'audit_only'
  complianceStandard: 'GDPR' | 'HIPAA' | 'CCPA'
}

export interface ComplianceGuardrail {
  type: 'compliance_check'
  category: 'privacy_compliance'
  regulations: ('GDPR' | 'HIPAA' | 'SOX' | 'PCI_DSS')[]
  auditLogging: boolean
  dataResidency: string[] // allowed regions
}

// C. Brand & Safety
// Focus: Reputation, tone, and user experience
export interface ToxicityFilterGuardrail {
  type: 'toxicity_filter'
  category: 'brand_safety'
  severityLevels: {
    hate: 'low' | 'medium' | 'high'
    sexual: 'low' | 'medium' | 'high'
    violence: 'low' | 'medium' | 'high'
    selfHarm: 'low' | 'medium' | 'high'
  }
  targetTone: 'neutral' | 'positive' | 'professional'
  toneTolerance: number // +/- 0.2
}

export interface TopicFilteringGuardrail {
  type: 'topic_filtering'
  category: 'brand_safety'
  deniedTopics: string[]
  allowedTopics?: string[]
  competitorFiltering: boolean
  semanticSimilarityThreshold: number // cosine similarity score
}

// D. Knowledge Integrity
// Focus: Accuracy and reliability of the AI's brain
export interface HallucinationCheckGuardrail {
  type: 'hallucination_check'
  category: 'knowledge_integrity'
  groundingThreshold: number // 0.0 - 1.0
  nliLogic: 'entails' | 'neutral' | 'contradicts'
  citationsRequired: boolean
}

export interface FactualAccuracyGuardrail {
  type: 'factual_accuracy'
  category: 'knowledge_integrity'
  verificationSources: string[]
  confidenceThreshold: number
  allowUncertainty: boolean
}

// Stakeholder Group Types
export type SecurityCyberDefenseGuardrail = PromptInjectionGuardrail | MaliciousCodeGuardrail | DataLeakageGuardrail
export type PrivacyComplianceGuardrail = PIIScrubbingGuardrail | PIIRedactionGuardrail | ComplianceGuardrail
export type BrandSafetyGuardrail = ToxicityFilterGuardrail | TopicFilteringGuardrail
export type KnowledgeIntegrityGuardrail = HallucinationCheckGuardrail | FactualAccuracyGuardrail

// Legacy type unions for backward compatibility
export type InputGuardrail = PromptInjectionGuardrail | PIIScrubbingGuardrail | TopicFilteringGuardrail
export type OutputGuardrail = HallucinationCheckGuardrail | ToxicityFilterGuardrail | FactualAccuracyGuardrail

// Format validation (utility guardrail)
export interface FormatValidationGuardrail {
  type: 'format_validation'
  category: 'utility'
  schema: object // JSON Schema
  retryLimit: number
  lengthConstraints: {
    minTokens: number
    maxTokens: number
  }
}

// V2 Stakeholder-Based Default Configurations

// Security & Cyber-Defense Default
export const defaultJailbreakGuardrail: PromptInjectionGuardrail = {
  type: 'prompt_injection',
  category: 'security_cyber_defense',
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

// Stakeholder-Based Configuration
export interface StakeholderGuardrailConfig {
  securityCyberDefense: SecurityCyberDefenseGuardrail[]
  privacyCompliance: PrivacyComplianceGuardrail[]
  brandSafety: BrandSafetyGuardrail[]
  knowledgeIntegrity: KnowledgeIntegrityGuardrail[]
}

// Main Configuration (backward compatible)
export interface GuardrailConfig {
  input: InputGuardrail[]
  output: OutputGuardrail[]
  
  // V2: Stakeholder-based organization
  stakeholders?: StakeholderGuardrailConfig
}
