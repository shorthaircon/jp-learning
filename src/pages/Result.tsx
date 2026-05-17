import { useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getBook } from '../lib/books'
import Furigana from '../components/Furigana'
import Explanation from '../components/Explanation'

export default function Result() {
  const { bookId } = useParams<{ bookId: string }>()
  const [searchParams] = useSearchParams()
  const nav = useNavigate()
  const book = bookId ? getBook(bookId) : undefined

  const answers: Record<string, number> = useMemo(() => {
    try {
      return JSON.parse(searchParams.get('answers') ?? '{}')
    } catch { return {} }
  }, [searchParams])
  const scope = searchParams.get('scope') ?? ''

  const questions = useMemo(() => {
    if (!book) return []
    const m = scope.match(/^w(\d+)d(\d+)$/)
    if (m) {
      const w = parseInt(m[1], 10)
      const d = parseInt(m[2], 10)
      return book.questions.filter(q => q.week === w && q.day === d)
    }
    return []
  }, [book, scope])

  if (!book) return <div className="p-6">找不到題庫</div>

  const total = questions.length
  const correct = questions.filter(q => answers[q.id] === q.answer).length
  const wrong = questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== q.answer)

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-24">
      <button onClick={() => nav('/')} className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs">← 回首頁</button>

      <div className="rounded-2xl bg-slate-900 p-6 text-center">
        <div className="text-sm text-slate-400">模考結果</div>
        <div className="my-2 text-4xl font-bold">{correct} / {total}</div>
        <div className="text-sm text-slate-300">
          答對率 {total > 0 ? Math.round((correct / total) * 100) : 0}%
        </div>
      </div>

      {wrong.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-300">錯題檢討</h2>
          <div className="space-y-3">
            {wrong.map(q => (
              <div key={q.id} className={`rounded-2xl bg-slate-900 p-4 ${''}`}>
                <div className="mb-2 text-xs text-slate-400">#{q.number}　{q.type}</div>
                <div className="mb-2 text-base">
                  <Furigana html={q.question} />
                </div>
                <div className="mb-2 text-sm">
                  <span className="text-rose-400">你的答案：{answers[q.id] + 1}　</span>
                  <span className="text-emerald-400">正解：{q.answer + 1}</span>
                </div>
                <Explanation text={q.explanation} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
