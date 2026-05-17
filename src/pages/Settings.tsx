import { useNavigate } from 'react-router-dom'
import { exportProgress, clearLogin } from '../lib/storage'
import { getDefaultBook } from '../lib/books'

export default function Settings() {
  const nav = useNavigate()
  const book = getDefaultBook()

  function exportJson() {
    const data = exportProgress(book.meta.id)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `progress-${book.meta.id}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function logout() {
    clearLogin()
    nav('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <button onClick={() => nav('/')} className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs">← 回首頁</button>
        <h1 className="text-lg font-bold">設定</h1>
        <div className="w-12" />
      </div>

      <button onClick={exportJson} className="w-full rounded-xl bg-slate-800 p-4 text-left hover:bg-slate-700">
        <div className="font-semibold">📥 匯出進度 JSON</div>
        <div className="text-xs text-slate-400">備份目前的作答記錄、錯題本</div>
      </button>

      <button onClick={logout} className="w-full rounded-xl bg-rose-700 p-4 text-left hover:bg-rose-600">
        <div className="font-semibold">🚪 登出</div>
        <div className="text-xs text-rose-200">下次開啟需要重新輸入密碼</div>
      </button>
    </div>
  )
}
