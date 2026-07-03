import { Link, useNavigate, useParams } from 'react-router-dom'
import { getBook } from '../lib/books'
import { loadProgress } from '../lib/storage'
import { getWrongQuestionIds } from '../lib/progress'
import Furigana from '../components/Furigana'

export default function Wrong() {
  const { bookId } = useParams<{ bookId: string }>()
  const nav = useNavigate()
  const book = bookId ? getBook(bookId) : undefined
  if (!book) return <div className="p-6">找不到題庫</div>

  const progress = loadProgress(book.meta.id)
  const ids = new Set(getWrongQuestionIds(progress))
  const wrongs = book.questions.filter(q => ids.has(q.id))

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <button onClick={() => nav('/')} className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs">← 回首頁</button>
        <h1 className="text-lg font-bold">錯題本（{wrongs.length}）</h1>
        <div className="w-12" />
      </div>

      {wrongs.length > 0 && (
        <Link
          to={`/quiz/${book.meta.id}/practice/wrong`}
          className="block rounded-2xl bg-rose-600 p-4 text-center font-semibold hover:bg-rose-500"
        >
          🎯 重練全部錯題（隨機順序）
        </Link>
      )}

      <div className="space-y-2">
        {wrongs.map(q => {
          const rec = progress.answered[q.id]
          return (
            <div key={q.id} className="rounded-xl bg-slate-900 p-3">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span>#{q.number}　{q.type}　第{q.week}週D{q.day}</span>
                  {rec.flagged && (
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                      ⚠ 不確定
                    </span>
                  )}
                </span>
                <span>連對 {rec.consecutiveCorrect}/2</span>
              </div>
              <div className="text-sm">
                <Furigana html={q.question} />
              </div>
            </div>
          )
        })}
        {wrongs.length === 0 && (
          <div className="py-12 text-center text-slate-500">尚無錯題</div>
        )}
      </div>
    </div>
  )
}
