import { Button } from "@medusajs/ui"
import { useFormStatus } from "react-dom"

type SubmitButtonProps = {
  children: React.ReactNode
  className?: string
  "data-testid"?: string
}

export function SubmitButton({ children, className, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      size="large"
      className={className}
      type="submit"
      isLoading={pending}
      {...props}
    >
      {children}
    </Button>
  )
}