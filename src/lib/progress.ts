import type { Progress, AnswerRecord, Question } from '../types'

const REQUIRED_CONSECUTIVE_CORRECT = 2

export function getRecord(p: Progress, qid: string): AnswerRecord {
  return p.answered[qid] ?? {
    history: [],
    flagged: false,
    inWrongList: false,
    consecutiveCorrect: 0
  }
}

export function recordAnswer(
  p: Progress,
  qid: string,
  choice: number,
  correctIndex: number,
  flagged: boolean
): Progress {
  const correct = choice === correctIndex
  const prev = getRecord(p, qid)
  const consecutiveCorrect = correct ? prev.consecutiveCorrect + 1 : 0

  // 進入：答錯，或答對但標記不確定
  let inWrongList = prev.inWrongList
  if (!correct || flagged) {
    inWrongList = true
  }
  // 離開：在錯題本中且連對 2 次
  if (inWrongList && correct && consecutiveCorrect >= REQUIRED_CONSECUTIVE_CORRECT) {
    inWrongList = false
  }

  const next: Progress = {
    ...p,
    answered: {
      ...p.answered,
      [qid]: {
        history: [...prev.history, { choice, correct, ts: Date.now() }],
        flagged: prev.flagged || flagged,
        inWrongList,
        consecutiveCorrect
      }
    },
    lastQuestionId: qid
  }
  return next
}

export function getDayStats(p: Progress, questions: Question[], week: number, day: number) {
  const inDay = questions.filter(q => q.week === week && q.day === day)
  const total = inDay.length
  let answered = 0
  let correct = 0
  for (const q of inDay) {
    const rec = p.answered[q.id]
    if (rec && rec.history.length > 0) {
      answered++
      const last = rec.history[rec.history.length - 1]
      if (last.correct) correct++
    }
  }
  return { total, answered, correct }
}

export function getWrongQuestionIds(p: Progress): string[] {
  return Object.entries(p.answered)
    .filter(([, r]) => r.inWrongList)
    .map(([id]) => id)
}
