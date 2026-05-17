import { Link } from 'react-router-dom'
import { getDefaultBook } from '../lib/books'
import { loadProgress } from '../lib/storage'
import { getDayStats, getWrongQuestionIds } from '../lib/progress'

export default function Home() {
  const book = getDefaultBook()
  const progress = loadProgress(book.meta.id)
  const wrongCount = getWrongQuestionIds(progress).length

  const lastQid = progress.lastQuestionId
  const lastQ = lastQid ? book.questions.find(q => q.id === lastQid) : null

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-5 pb-20">
      <header className="pt-4 text-center">
        <h1 className="text-2xl font-bold">{book.meta.title}</h1>
        <div className="mt-1 text-sm text-slate-400">
          {book.meta.totalQuestions} 題　目前已輸入 {book.questions.length} 題
        </div>
      </header>

      {/* 三個快速入口 */}
      <div className="grid grid-cols-3 gap-3">
        <Link
          to={lastQ ? `/quiz/${book.meta.id}/practice/w${lastQ.week}d${lastQ.day}?from=${lastQ.id}` : `/quiz/${book.meta.id}/practice/w1d1`}
          className="rounded-2xl bg-sky-600 p-4 text-center hover:bg-sky-500"
        >
          <div className="text-xs text-sky-100">繼續</div>
          <div className="mt-1 font-bold">上次</div>
          {lastQ && <div className="mt-1 text-[11px] text-sky-100">第 {lastQ.week} 週 第 {lastQ.day} 天</div>}
        </Link>
        <Link
          to={`/mock/${book.meta.id}/select`}
          className="rounded-2xl bg-emerald-600 p-4 text-center hover:bg-emerald-500"
        >
          <div className="text-xs text-emerald-100">模考</div>
          <div className="mt-1 font-bold">一份卷</div>
        </Link>
        <Link
          to={`/wrong/${book.meta.id}`}
          className="rounded-2xl bg-rose-600 p-4 text-center hover:bg-rose-500"
        >
          <div className="text-xs text-rose-100">錯題本</div>
          <div className="mt-1 font-bold">{wrongCount}</div>
        </Link>
      </div>

      {/* 目錄：4 週 × 7 天 */}
      <div className="space-y-4">
        {Array.from({ length: book.meta.weeks }, (_, i) => i + 1).map(week => (
          <div key={week}>
            <h2 className="mb-2 text-sm font-semibold text-slate-300">第 {week} 週</h2>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: book.meta.daysPerWeek }, (_, i) => i + 1).map(day => {
                const stats = getDayStats(progress, book.questions, week, day)
                const isReview = day === book.meta.reviewDay
                let bg = 'bg-slate-800'
                if (stats.total > 0) {
                  if (stats.answered === 0) bg = 'bg-slate-800'
                  else if (stats.answered < stats.total) bg = 'bg-amber-700'
                  else bg = 'bg-emerald-700'
                }
                const disabled = stats.total === 0
                const inner = (
                  <div className="text-center">
                    <div className="text-[11px] text-slate-300">D{day}{isReview && '★'}</div>
                    <div className="text-xs font-bold">
                      {disabled ? '—' : `${stats.answered}/${stats.total}`}
                    </div>
                  </div>
                )
                return disabled ? (
                  <div key={day} className={`${bg} cursor-not-allowed rounded-lg p-2 opacity-50`}>{inner}</div>
                ) : (
                  <Link
                    key={day}
                    to={`/quiz/${book.meta.id}/practice/w${week}d${day}`}
                    className={`${bg} rounded-lg p-2 hover:brightness-125`}
                  >
                    {inner}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 text-center text-xs text-slate-500">
        <Link to="/settings" className="underline">設定</Link>
      </div>
    </div>
  )
}
