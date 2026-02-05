import { TrendingDown, TrendingUp, Wallet, PiggyBank } from 'lucide-react'

interface SummaryCardProps {
  totalExpenses: number
  totalIncome: number
  balance: number
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function SummaryCard({
  totalExpenses,
  totalIncome,
  balance,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl md:rounded-2xl border border-border bg-card p-4 md:p-6 shadow-lg">
      <h2 className="mb-3 md:mb-4 text-base md:text-lg font-semibold text-foreground">Resumo do Mes</h2>

      <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4">
        <div className="flex items-center gap-2 md:gap-4 rounded-lg md:rounded-xl bg-primary/10 p-2.5 md:p-4">
          <div className="rounded-full bg-primary/20 p-2 md:p-3">
            <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground truncate">A Receber</p>
            <p className="text-sm md:text-xl font-bold text-primary truncate">
              {formatCurrency(totalIncome)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 rounded-lg md:rounded-xl bg-destructive/10 p-2.5 md:p-4">
          <div className="rounded-full bg-destructive/20 p-2 md:p-3">
            <TrendingDown className="h-4 w-4 md:h-6 md:w-6 text-destructive" />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground truncate">A Pagar</p>
            <p className="text-sm md:text-xl font-bold text-destructive truncate">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 md:gap-4 rounded-lg md:rounded-xl p-2.5 md:p-4 ${
            balance >= 0 ? 'bg-primary/10' : 'bg-destructive/10'
          }`}
        >
          <div
            className={`rounded-full p-2 md:p-3 ${
              balance >= 0 ? 'bg-primary/20' : 'bg-destructive/20'
            }`}
          >
            <Wallet
              className={`h-4 w-4 md:h-6 md:w-6 ${
                balance >= 0 ? 'text-primary' : 'text-destructive'
              }`}
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground truncate">Saldo</p>
            <p
              className={`text-sm md:text-xl font-bold truncate ${
                balance >= 0 ? 'text-primary' : 'text-destructive'
              }`}
            >
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 md:gap-4 rounded-lg md:rounded-xl p-2.5 md:p-4 ${
            balance >= 0 ? 'bg-primary/15' : 'bg-destructive/15'
          }`}
        >
          <div
            className={`rounded-full p-2 md:p-3 ${
              balance >= 0 ? 'bg-primary/30' : 'bg-destructive/30'
            }`}
          >
            <PiggyBank
              className={`h-4 w-4 md:h-6 md:w-6 ${
                balance >= 0 ? 'text-primary' : 'text-destructive'
              }`}
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground truncate">Sobrou</p>
            <p
              className={`text-sm md:text-xl font-bold truncate ${
                balance >= 0 ? 'text-primary' : 'text-destructive'
              }`}
            >
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
