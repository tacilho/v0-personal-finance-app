'use client'

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
    <div className="sticky top-4 z-10">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Resumo do Mes</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 rounded-xl bg-primary/10 p-4">
            <div className="rounded-full bg-primary/20 p-3">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total a Receber</p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(totalIncome)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-destructive/10 p-4">
            <div className="rounded-full bg-destructive/20 p-3">
              <TrendingDown className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total a Pagar</p>
              <p className="text-xl font-bold text-destructive">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-4 rounded-xl p-4 ${
              balance >= 0 ? 'bg-primary/10' : 'bg-destructive/10'
            }`}
          >
            <div
              className={`rounded-full p-3 ${
                balance >= 0 ? 'bg-primary/20' : 'bg-destructive/20'
              }`}
            >
              <Wallet
                className={`h-6 w-6 ${
                  balance >= 0 ? 'text-primary' : 'text-destructive'
                }`}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo Geral</p>
              <p
                className={`text-xl font-bold ${
                  balance >= 0 ? 'text-primary' : 'text-destructive'
                }`}
              >
                {formatCurrency(balance)}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-4 rounded-xl p-4 ${
              balance >= 0
                ? 'bg-gradient-to-br from-primary/20 to-primary/10'
                : 'bg-gradient-to-br from-destructive/20 to-destructive/10'
            }`}
          >
            <div
              className={`rounded-full p-3 ${
                balance >= 0 ? 'bg-primary/30' : 'bg-destructive/30'
              }`}
            >
              <PiggyBank
                className={`h-6 w-6 ${
                  balance >= 0 ? 'text-primary' : 'text-destructive'
                }`}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">O Que Sobrou</p>
              <p
                className={`text-xl font-bold ${
                  balance >= 0 ? 'text-primary' : 'text-destructive'
                }`}
              >
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
