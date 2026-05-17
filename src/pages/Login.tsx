import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setLoggedIn } from '../lib/storage'

const PASSWORD = import.meta.env.VITE_LOGIN_PASSWORD ?? 'jp'

export default function Login() {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const nav = useNavigate()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (pw === PASSWORD) {
      setLoggedIn()
      nav('/', { replace: true })
    } else {
      setErr(true)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <h1 className="text-center text-2xl font-bold">日文刷題</h1>
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setErr(false) }}
          placeholder="請輸入密碼"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-center text-lg outline-none focus:border-sky-500"
          autoFocus
        />
        {err && <div className="text-center text-sm text-rose-400">密碼錯誤</div>}
        <button
          type="submit"
          className="w-full rounded-xl bg-sky-600 p-3 font-semibold hover:bg-sky-500"
        >
          進入
        </button>
      </form>
    </div>
  )
}
