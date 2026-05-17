export type QuestionType = 'もじ' | 'ごい' | 'ぶんぽう'

export interface Question {
  id: string
  week: number
  day: number
  number: number
  page: number
  type: QuestionType
  question: string
  choices: string[]
  answer: number
  explanation: string
  isReview?: boolean
  referenceQuestion?: number
}

export interface BookMeta {
  id: string
  title: string
  level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5'
  totalQuestions: number
  weeks: number
  daysPerWeek: number
  reviewDay: number
  questionsPerNormalDay: number
  questionsPerReviewDay: number
}

export interface AnswerRecord {
  history: Array<{ choice: number; correct: boolean; ts: number }>
  flagged: boolean
  inWrongList: boolean
  consecutiveCorrect: number
}

export interface Progress {
  bookId: string
  answered: Record<string, AnswerRecord>
  lastQuestionId: string | null
  furiganaOn: boolean
}

export type QuizMode = 'practice' | 'mock'
