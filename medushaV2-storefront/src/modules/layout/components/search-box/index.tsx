"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { getSearchSuggestions } from "@lib/data/search"
import Search from "@modules/common/icons/search"
import X from "@modules/common/icons/x"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useDebounce } from "@lib/hooks/use-debounce"

const RECENT_SEARCHES_KEY = "recent_searches"
const MAX_RECENT_SEARCHES = 10

export default function SearchBox() {
  const router = useRouter()
  const params = useParams()
  const countryCode = params.countryCode as string
  
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<HttpTypes.StoreProduct[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const debouncedQuery = useDebounce(query, 300)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to load recent searches", e)
      }
    }
  }, [])

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      setLoading(true)
      getSearchSuggestions(debouncedQuery, countryCode)
        .then((products) => {
          setSuggestions(products)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Search suggestions error:", error)
          setSuggestions([])
          setLoading(false)
        })
    } else {
      setSuggestions([])
    }
  }, [debouncedQuery, countryCode])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const saveRecentSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim()
    if (!trimmed) return

    const updated = [
      trimmed,
      ...recentSearches.filter((s) => s !== trimmed),
    ].slice(0, MAX_RECENT_SEARCHES)

    setRecentSearches(updated)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  }

  const handleSearch = useCallback((searchQuery: string) => {
    const trimmed = searchQuery.trim()
    if (!trimmed) return

    saveRecentSearch(trimmed)
    setIsOpen(false)
    setQuery("")
    router.push(`/${countryCode}/search?q=${encodeURIComponent(trimmed)}`)
  }, [countryCode, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    const itemsCount = suggestions.length > 0 ? suggestions.length : recentSearches.length

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < itemsCount - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      if (suggestions.length > 0) {
        const product = suggestions[selectedIndex]
        router.push(`/${countryCode}/products/${product.handle}`)
        setIsOpen(false)
        setQuery("")
      } else if (recentSearches.length > 0) {
        handleSearch(recentSearches[selectedIndex])
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="搜索产品..."
            className="w-full pl-10 pr-10 py-2 text-sm border border-ui-border-base rounded-md focus:outline-none focus:ring-2 focus:ring-ui-fg-interactive"
            aria-label="搜索产品"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ui-fg-subtle">
            <Search size="16" />
          </div>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                inputRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ui-fg-subtle hover:text-ui-fg-base"
              aria-label="清除搜索"
            >
              <X size="16" />
            </button>
          )}
        </div>
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-ui-border-base rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
          {loading && (
            <div className="p-4 text-center text-sm text-ui-fg-subtle">
              加载中...
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-ui-fg-subtle uppercase">
                搜索结果
              </div>
              {suggestions.map((product, index) => (
                <LocalizedClientLink
                  key={product.id}
                  href={`/products/${product.handle}`}
                  onClick={() => {
                    setIsOpen(false)
                    setQuery("")
                  }}
                  className={`block px-4 py-3 hover:bg-ui-bg-subtle transition-colors ${
                    selectedIndex === index ? "bg-ui-bg-subtle" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {product.thumbnail && (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-ui-fg-base truncate">
                        {product.title}
                      </div>
                      {product.variants?.[0]?.calculated_price && (
                        <div className="text-xs text-ui-fg-subtle">
                          ¥{(product.variants[0].calculated_price.calculated_amount / 100).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </LocalizedClientLink>
              ))}
            </div>
          )}

          {!loading && suggestions.length === 0 && query.trim().length >= 2 && (
            <div className="p-4 text-center text-sm text-ui-fg-subtle">
              未找到相关产品
            </div>
          )}

          {!loading && suggestions.length === 0 && query.trim().length < 2 && recentSearches.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-medium text-ui-fg-subtle uppercase">
                  最近搜索
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                >
                  清除
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-ui-bg-subtle transition-colors ${
                    selectedIndex === index ? "bg-ui-bg-subtle" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Search size="14" className="text-ui-fg-subtle" />
                    <span className="text-ui-fg-base">{search}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
