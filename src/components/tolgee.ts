import { DevTools, Tolgee } from '@tolgee/react'
import { FormatIcu } from '@tolgee/format-icu'
import en from '../../public/i18n/en.json'

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

export const tolgee = Tolgee().use(DevTools()).use(FormatIcu()).init({
  defaultLanguage: 'en',
  apiKey: apiKey,
  apiUrl: apiUrl,
  staticData: {
    en
  }
})