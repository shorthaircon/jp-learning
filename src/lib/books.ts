import type { BookMeta, Question } from '../types'
import metaN3 from '../../data/n3-完勝500/meta.json'
import questionsN3 from '../../data/n3-完勝500/questions.json'

export interface Book {
  meta: BookMeta
  questions: Question[]
}

const BOOKS: Book[] = [
  {
    meta: metaN3 as BookMeta,
    questions: questionsN3 as Question[]
  }
]

export function listBooks(): Book[] {
  return BOOKS
}

export function getBook(id: string): Book | undefined {
  return BOOKS.find(b => b.meta.id === id)
}

export function getDefaultBook(): Book {
  return BOOKS[0]
}
