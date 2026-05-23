"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import Cookies from "js-cookie"

import zhTranslations from "./translations/zh.json"
import enTranslations from "./translations/en.json"

type Translations = typeof zhTranslations

const translations: Record<string, Translations> = {
  zh: zhTranslations,
  en: enTranslations,
}

export type Locale = "en" | "zh"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_COOKIE_KEY = "ygn_locale"
const DEFAULT_LOCALE: Locale = "zh"

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".")
  let result: unknown = obj
  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  return typeof result === "string" ? result : path
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedLocale = Cookies.get(LANGUAGE_COOKIE_KEY) as Locale | undefined
    if (savedLocale && (savedLocale === "en" || savedLocale === "zh")) {
      setLocaleState(savedLocale)
    } else {
      setLocaleState(DEFAULT_LOCALE)
    }
    setMounted(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    Cookies.set(LANGUAGE_COOKIE_KEY, newLocale, { expires: 365 })
  }, [])

  const t = useCallback(
    (key: string): string => {
      if (!mounted) return key
      const currentTranslations = translations[locale] || translations[DEFAULT_LOCALE]
      return getNestedValue(currentTranslations as unknown as Record<string, unknown>, key)
    },
    [locale, mounted]
  )

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export function useTranslations() {
  const { t } = useLanguage()
  return { t }
}