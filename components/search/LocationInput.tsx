import Input from "@/components/ui/Input"

type LocationInputProps = {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

export default function LocationInput({ value, onChange, className, placeholder }: LocationInputProps) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder ?? "Enter a destination"}
      className={className}
    />
  )
}
