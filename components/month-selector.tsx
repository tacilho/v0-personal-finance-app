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

const MONTH_NAMES_SHORT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
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
    <div className="flex items-center gap-1 md:gap-3 rounded-lg border border-border bg-card px-1.5 md:px-2 py-1 md:py-1.5 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevious}
        className="h-7 w-7 md:h-8 md:w-8"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Mes anterior</span>
      </Button>
      <div className="flex min-w-[90px] md:min-w-[160px] items-center justify-center gap-1.5 md:gap-2">
        <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground hidden md:block" />
        <span className="text-sm md:text-base font-medium">
          <span className="md:hidden">{MONTH_NAMES_SHORT[month - 1]} {year}</span>
          <span className="hidden md:inline">{MONTH_NAMES[month - 1]} {year}</span>
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        className="h-7 w-7 md:h-8 md:w-8"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Proximo mes</span>
      </Button>
    </div>
  )
}
