import type { Progress } from '../types'

const KEY_PROGRESS = (bookId: string) => `jp:progress:${bookId}`
const KEY_LOGGED_IN = 'jp:loggedIn'

export function isLoggedIn(): boolean {
  return localStorage.getItem(KEY_LOGGED_IN) === '1'
}

export function setLoggedIn(): void {
  localStorage.setItem(KEY_LOGGED_IN, '1')
}

export function clearLogin(): void {
  localStorage.removeItem(KEY_LOGGED_IN)
}

export function loadProgress(bookId: string): Progress {
  const raw = localStorage.getItem(KEY_PROGRESS(bookId))
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch {
      // fallthrough
    }
  }
  return {
    bookId,
    answered: {},
    lastQuestionId: null,
    furiganaOn: false
  }
}

export function saveProgress(p: Progress): void {
  localStorage.setItem(KEY_PROGRESS(p.bookId), JSON.stringify(p))
}

export function exportProgress(bookId: string): string {
  return JSON.stringify(loadProgress(bookId), null, 2)
}
