import { clx } from "@medusajs/ui"
import { useState, useEffect } from "react"

type ErrorMessageProps = {
  error?: string | null
  className?: string
}

export default function ErrorMessage({ error, className }: ErrorMessageProps) {
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (error) {
      setMessage(error)
      const timer = setTimeout(() => setMessage(""), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  if (!message) {
    return null
  }

  return (
    <div
      className={clx(
        "text-sm text-red-500 bg-red-50 p-3 rounded-md mt-4",
        className
      )}
    >
      {message}
    </div>
  )
}