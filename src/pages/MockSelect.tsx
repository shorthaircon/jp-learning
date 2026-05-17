import { Link, useNavigate, useParams } from 'react-router-dom'
import { getBook } from '../lib/books'

export default function MockSelect() {
  const { bookId } = useParams<{ bookId: string }>()
  const nav = useNavigate()
  const book = bookId ? getBook(bookId) : undefined
  if (!book) return <div className="p-6">找不到題庫</div>

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <button onClick={() => nav('/')} className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs">← 回首頁</button>
        <h1 className="text-lg font-bold">選擇模考範圍</h1>
        <div className="w-12" />
      </div>
      <p className="text-sm text-slate-400">一份卷 = 一天份題目（一般日 15 題、複習日 35 題）</p>

      <div className="space-y-4">
        {Array.from({ length: book.meta.weeks }, (_, i) => i + 1).map(week => (
          <div key={week}>
            <h2 className="mb-2 text-sm font-semibold text-slate-300">第 {week} 週</h2>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: book.meta.daysPerWeek }, (_, i) => i + 1).map(day => {
                const has = book.questions.some(q => q.week === week && q.day === day)
                const isReview = day === book.meta.reviewDay
                if (!has) return (
                  <div key={day} className="rounded-lg bg-slate-800 p-2 text-center text-xs opacity-40">
                    D{day}
                  </div>
                )
                return (
                  <Link
                    key={day}
                    to={`/quiz/${book.meta.id}/mock/w${week}d${day}`}
                    className={`rounded-lg p-2 text-center text-xs ${isReview ? 'bg-amber-700' : 'bg-emerald-700'} hover:brightness-125`}
                  >
                    D{day}{isReview && '★'}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
