'use client'

import { useState } from 'react'
import { Plus, Settings, TrendingDown, TrendingUp, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { MonthSelector } from './month-selector'
import { SummaryCard } from './summary-card'
import { GroupCard } from './group-card'
import { SettingsModal } from './settings-modal'
import { QuickAddModal } from './quick-add-modal'
import { financeStore, useFinanceStore } from '@/lib/finance-store'

export function FinanceDashboard() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [showSettings, setShowSettings] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupType, setNewGroupType] = useState<'expense' | 'income' | null>(null)
  const [quickAddType, setQuickAddType] = useState<'expense' | 'income' | null>(null)
  const { theme, setTheme } = useTheme()

  const {
    categories,
    bankAccounts,
    getMonthData,
    calculateTotals,
    getGroupTotal,
    getMonthKey,
  } = useFinanceStore()

  const monthKey = getMonthKey(year, month)
  const monthData = getMonthData(year, month)
  const totals = calculateTotals(year, month)

  const handleAddGroup = () => {
    if (!newGroupName.trim() || !newGroupType) return

    if (newGroupType === 'expense') {
      financeStore.addExpenseGroup(monthKey, newGroupName.trim())
    } else {
      financeStore.addIncomeGroup(monthKey, newGroupName.trim())
    }

    setNewGroupName('')
    setNewGroupType(null)
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-6">
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 md:px-4 md:py-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="rounded-lg bg-primary p-1.5 md:p-2">
              <svg
                className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-base md:text-xl font-bold text-foreground">
              Financeiro
            </h1>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3">
            <MonthSelector
              year={year}
              month={month}
              onChange={(y, m) => {
                setYear(y)
                setMonth(m)
              }}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-8 w-8 md:h-9 md:w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Alternar tema</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="h-8 w-8 md:h-9 md:w-9"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Configuracoes</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Floating Action Buttons - Mobile */}
      <div className="fixed bottom-4 left-0 right-0 z-30 flex justify-center gap-3 px-4 md:hidden">
        <Button
          onClick={() => setQuickAddType('expense')}
          className="flex-1 max-w-[160px] gap-2 bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90"
          size="lg"
        >
          <TrendingDown className="h-5 w-5" />
          A Pagar
        </Button>
        <Button
          onClick={() => setQuickAddType('income')}
          className="flex-1 max-w-[160px] gap-2 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
          size="lg"
        >
          <TrendingUp className="h-5 w-5" />
          A Receber
        </Button>
      </div>

      <main className="mx-auto max-w-7xl space-y-6 px-3 py-4 md:space-y-8 md:px-4 md:py-6">
        {/* Desktop Quick Add Buttons */}
        <div className="hidden md:flex gap-3 justify-end">
          <Button
            onClick={() => setQuickAddType('expense')}
            className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <TrendingDown className="h-4 w-4" />
            Lancar Despesa
          </Button>
          <Button
            onClick={() => setQuickAddType('income')}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <TrendingUp className="h-4 w-4" />
            Lancar Recebimento
          </Button>
        </div>

        <SummaryCard
          totalExpenses={totals.totalExpenses}
          totalIncome={totals.totalIncome}
          balance={totals.balance}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-destructive/10 p-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  Contas a Pagar
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewGroupType('expense')}
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Plus className="mr-1 h-4 w-4" />
                Novo Grupo
              </Button>
            </div>

            <div className="space-y-4">
              {monthData.expenseGroups.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/50 p-8 text-center">
                  <TrendingDown className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Nenhum grupo de despesas
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setNewGroupType('expense')}
                    className="mt-2 text-destructive"
                  >
                    Criar primeiro grupo
                  </Button>
                </div>
              ) : (
                monthData.expenseGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    id={group.id}
                    name={group.name}
                    transactions={group.transactions}
                    categories={categories}
                    bankAccounts={bankAccounts}
                    type="expense"
                    total={getGroupTotal(group.transactions)}
                    onUpdateName={(name) =>
                      financeStore.updateExpenseGroup(monthKey, group.id, name)
                    }
                    onDelete={() =>
                      financeStore.deleteExpenseGroup(monthKey, group.id)
                    }
                    onAddTransaction={(data) =>
                      financeStore.addExpenseTransaction(
                        monthKey,
                        group.id,
                        data
                      )
                    }
                    onUpdateTransaction={(transactionId, data) =>
                      financeStore.updateExpenseTransaction(
                        monthKey,
                        group.id,
                        transactionId,
                        data
                      )
                    }
                    onDeleteTransaction={(transactionId) =>
                      financeStore.deleteExpenseTransaction(
                        monthKey,
                        group.id,
                        transactionId
                      )
                    }
                  />
                ))
              )}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  Contas a Receber
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewGroupType('income')}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <Plus className="mr-1 h-4 w-4" />
                Novo Grupo
              </Button>
            </div>

            <div className="space-y-4">
              {monthData.incomeGroups.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/50 p-8 text-center">
                  <TrendingUp className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Nenhum grupo de recebimentos
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setNewGroupType('income')}
                    className="mt-2 text-primary"
                  >
                    Criar primeiro grupo
                  </Button>
                </div>
              ) : (
                monthData.incomeGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    id={group.id}
                    name={group.name}
                    transactions={group.transactions}
                    categories={categories}
                    bankAccounts={bankAccounts}
                    type="income"
                    total={getGroupTotal(group.transactions)}
                    onUpdateName={(name) =>
                      financeStore.updateIncomeGroup(monthKey, group.id, name)
                    }
                    onDelete={() =>
                      financeStore.deleteIncomeGroup(monthKey, group.id)
                    }
                    onAddTransaction={(data) =>
                      financeStore.addIncomeTransaction(
                        monthKey,
                        group.id,
                        data
                      )
                    }
                    onUpdateTransaction={(transactionId, data) =>
                      financeStore.updateIncomeTransaction(
                        monthKey,
                        group.id,
                        transactionId,
                        data
                      )
                    }
                    onDeleteTransaction={(transactionId) =>
                      financeStore.deleteIncomeTransaction(
                        monthKey,
                        group.id,
                        transactionId
                      )
                    }
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <Dialog
        open={newGroupType !== null}
        onOpenChange={(open) => !open && setNewGroupType(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Novo Grupo de{' '}
              {newGroupType === 'expense' ? 'Despesas' : 'Recebimentos'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nome do grupo..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewGroupType(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddGroup}
              className={
                newGroupType === 'expense'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : ''
              }
            >
              Criar Grupo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />

      {quickAddType && (
        <QuickAddModal
          open={quickAddType !== null}
          onOpenChange={(open) => !open && setQuickAddType(null)}
          type={quickAddType}
          categories={categories}
          bankAccounts={bankAccounts}
          groups={quickAddType === 'expense' ? monthData.expenseGroups : monthData.incomeGroups}
          onAddTransaction={(groupId, data) => {
            if (quickAddType === 'expense') {
              financeStore.addExpenseTransaction(monthKey, groupId, data)
            } else {
              financeStore.addIncomeTransaction(monthKey, groupId, data)
            }
          }}
          onAddGroup={(name) => {
            if (quickAddType === 'expense') {
              financeStore.addExpenseGroup(monthKey, name)
            } else {
              financeStore.addIncomeGroup(monthKey, name)
            }
          }}
        />
      )}
    </div>
  )
}
