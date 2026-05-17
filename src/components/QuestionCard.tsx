import type { Question } from '../types'
import Furigana from './Furigana'

interface Props {
  question: Question
  selected: number | null
  revealed: boolean // 立即回饋模式答完顯示對錯時為 true
  onSelect: (index: number) => void
  flagged: boolean
  onToggleFlag: () => void
  furiganaOn: boolean
}

export default function QuestionCard({
  question,
  selected,
  revealed,
  onSelect,
  flagged,
  onToggleFlag,
  furiganaOn
}: Props) {
  const wrapperCls = furiganaOn ? 'furigana-on' : ''

  return (
    <div className={`rounded-2xl bg-slate-900 p-5 shadow-lg ${wrapperCls}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs">#{question.number}</span>
          <span className="rounded-full bg-sky-700/60 px-2 py-0.5 text-xs">{question.type}</span>
          {question.isReview && (
            <span className="rounded-full bg-amber-700/60 px-2 py-0.5 text-xs">複習</span>
          )}
        </div>
        <button
          onClick={onToggleFlag}
          className={`rounded-lg px-2 py-1 text-xs ${
            flagged ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-200'
          }`}
        >
          ⚑ {flagged ? '已標記' : '不確定'}
        </button>
      </div>

      <div className="mb-5 text-lg leading-relaxed">
        <Furigana html={question.question} />
      </div>

      {question.referenceQuestion && (
        <div className="mb-3 text-xs text-slate-400">📖 對應原題 #{question.referenceQuestion}</div>
      )}

      <div className="space-y-2">
        {question.choices.map((c, i) => {
          const isSelected = selected === i
          const isCorrect = revealed && i === question.answer
          const isWrongPick = revealed && isSelected && i !== question.answer

          let cls = 'border-slate-700 bg-slate-800 hover:bg-slate-700'
          if (isCorrect) cls = 'border-emerald-500 bg-emerald-900/40'
          else if (isWrongPick) cls = 'border-rose-500 bg-rose-900/40'
          else if (isSelected) cls = 'border-sky-500 bg-sky-900/40'

          return (
            <button
              key={i}
              onClick={() => !revealed && onSelect(i)}
              disabled={revealed}
              className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition ${cls}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm">
                {i + 1}
              </span>
              <span className="text-base">
                <Furigana html={c} />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
