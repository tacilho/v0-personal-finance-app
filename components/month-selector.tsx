'use client'

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Marco',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

interface MonthSelectorProps {
  year: number
  month: number
  onChange: (year: number, month: number) => void
}

export function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
  const handlePrevious = () => {
    if (month === 1) {
      onChange(year - 1, 12)
    } else {
      onChange(year, month - 1)
    }
  }

  const handleNext = () => {
    if (month === 12) {
      onChange(year + 1, 1)
    } else {
      onChange(year, month + 1)
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-2 py-1.5 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevious}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Mes anterior</span>
      </Button>
      <div className="flex min-w-[160px] items-center justify-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">
          {MONTH_NAMES[month - 1]} {year}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Proximo mes</span>
      </Button>
    </div>
  )
}
