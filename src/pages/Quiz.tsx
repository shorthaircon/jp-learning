import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getBook } from '../lib/books'
import { loadProgress, saveProgress } from '../lib/storage'
import { recordAnswer, getWrongQuestionIds } from '../lib/progress'
import QuestionCard from '../components/QuestionCard'
import Explanation from '../components/Explanation'
import type { Progress, Question } from '../types'

export default function Quiz() {
  const { bookId, mode, scope } = useParams<{ bookId: string; mode: 'practice' | 'mock'; scope: string }>()
  const [searchParams] = useSearchParams()
  const nav = useNavigate()

  const book = bookId ? getBook(bookId) : undefined
  const [progress, setProgress] = useState<Progress>(() => loadProgress(bookId ?? ''))

  // 解析 scope：w{week}d{day}, wrong, all
  // 注意：只依 book/scope，不依 progress。錯題本模式進入 session 時洗牌一次就固定，
  // 中途答對脫離錯題本的題目仍留在本次練習裡，避免題目陣列動到、造成錯位。
  const questions = useMemo<Question[]>(() => {
    if (!book) return []
    if (scope === 'wrong') {
      const ids = new Set(getWrongQuestionIds(progress))
      return book.questions.filter(q => ids.has(q.id)).sort(() => Math.random() - 0.5)
    }
    const m = scope?.match(/^w(\d+)d(\d+)$/)
    if (m) {
      const w = parseInt(m[1], 10)
      const d = parseInt(m[2], 10)
      return book.questions.filter(q => q.week === w && q.day === d)
    }
    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, scope])

  // 起始 index：如果有 ?from=qid 則跳到該題
  const startIdx = useMemo(() => {
    const from = searchParams.get('from')
    if (!from) return 0
    const idx = questions.findIndex(q => q.id === from)
    return idx >= 0 ? idx : 0
  }, [searchParams, questions])

  const [idx, setIdx] = useState(startIdx)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [flagged, setFlagged] = useState(false)
  const [mockAnswers, setMockAnswers] = useState<Record<string, number>>({})

  useEffect(() => { setIdx(startIdx) }, [startIdx])

  if (!book) return <div className="p-6">找不到題庫</div>
  if (questions.length === 0) {
    return (
      <div className="p-6 text-center">
        <div>這個範圍還沒有題目</div>
        <button onClick={() => nav('/')} className="mt-4 rounded-lg bg-sky-600 px-4 py-2">回首頁</button>
      </div>
    )
  }

  const q = questions[idx]
  const isPractice = mode === 'practice'
  const isMock = mode === 'mock'

  function handleSelect(choice: number) {
    setSelected(choice)
    if (isPractice) {
      setRevealed(true)
      const next = recordAnswer(progress, q.id, choice, q.answer, flagged)
      setProgress(next)
      saveProgress(next)
    } else {
      // 模考：記錄但不顯示對錯
      setMockAnswers(prev => ({ ...prev, [q.id]: choice }))
    }
  }

  function next() {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1)
      setSelected(null)
      setRevealed(false)
      setFlagged(false)
    } else {
      // 結束
      if (isMock) {
        // 統一寫入 progress
        let p = progress
        for (const qq of questions) {
          const choice = mockAnswers[qq.id]
          if (choice !== undefined) {
            p = recordAnswer(p, qq.id, choice, qq.answer, false)
          }
        }
        saveProgress(p)
        // 帶答案到結果頁
        const params = new URLSearchParams()
        params.set('answers', JSON.stringify(mockAnswers))
        params.set('scope', scope ?? '')
        nav(`/result/${bookId}?${params.toString()}`)
      } else {
        nav('/')
      }
    }
  }

  function prev() {
    if (idx > 0) {
      setIdx(idx - 1)
      setSelected(null)
      setRevealed(false)
      setFlagged(false)
    }
  }

  function toggleFurigana() {
    const next = { ...progress, furiganaOn: !progress.furiganaOn }
    setProgress(next)
    saveProgress(next)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-24">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <button onClick={() => nav('/')} className="rounded-lg bg-slate-800 px-3 py-1.5">← 返回</button>
        <div>{idx + 1} / {questions.length}　{isMock ? '模考' : '練習'}</div>
        <button onClick={toggleFurigana} className="rounded-lg bg-slate-800 px-3 py-1.5">
          ふ {progress.furiganaOn ? '✓' : ''}
        </button>
      </div>

      <QuestionCard
        question={q}
        selected={isPractice ? selected : (mockAnswers[q.id] ?? null)}
        revealed={isPractice && revealed}
        onSelect={handleSelect}
        flagged={flagged}
        onToggleFlag={() => setFlagged(f => !f)}
        furiganaOn={progress.furiganaOn}
      />

      {isPractice && revealed && (
        <div className="rounded-2xl bg-slate-900/60 p-4">
          <div className="mb-2 text-sm font-semibold text-slate-300">解析</div>
          <Explanation text={q.explanation} />
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="rounded-xl bg-slate-800 px-4 py-3 disabled:opacity-40"
        >
          上一題
        </button>
        <button
          onClick={next}
          disabled={isPractice && !revealed}
          className="flex-1 rounded-xl bg-sky-600 px-4 py-3 font-semibold disabled:opacity-40"
        >
          {idx + 1 < questions.length ? '下一題' : (isMock ? '看結果' : '完成')}
        </button>
      </div>
    </div>
  )
}
