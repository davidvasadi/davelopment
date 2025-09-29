import en from './locales/en/common.json'
import hu from './locales/hu/common.json'
import { Language } from '../types'

export const defaultLanguage: Language = 'hu'

const translations = {
  en,
  hu,
}

// Mély kulcsokat kezelő fordító
export function translate(key: string, language: Language): any {
  const keys = key.split('.')
  let result: any = translations[language]

  for (const k of keys) {
    if (result && k in result) {
      result = result[k]
    } else {
      console.warn(`Missing translation: ${key} (${language})`)
      return ''
    }
  }

  return result
}
