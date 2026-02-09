"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"

type SortOption = {
  value: string
  label: string
}

const SORT_OPTIONS: SortOption[] = [
  { value: "relevance", label: "相关性" },
  { value: "price_asc", label: "价格：从低到高" },
  { value: "price_desc", label: "价格：从高到低" },
  { value: "created_at", label: "最新上架" },
]

export default function SearchFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get("sort") || "relevance"

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }

      // Reset to page 1 when changing filters
      if (key !== "page") {
        params.set("page", "1")
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-ui-fg-subtle">
          排序：
        </label>
        <select
          id="sort"
          value={currentSort}
          onChange={(e) => updateParams("sort", e.target.value)}
          className="px-3 py-2 text-sm border border-ui-border-base rounded-md focus:outline-none focus:ring-2 focus:ring-ui-fg-interactive bg-white"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
