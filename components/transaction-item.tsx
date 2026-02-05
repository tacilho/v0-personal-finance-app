'use client'

import { Pencil, Trash2, Calendar, CreditCard, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Transaction, Category, BankAccount } from '@/lib/types'

interface TransactionItemProps {
  transaction: Transaction
  categories: Category[]
  bankAccounts: BankAccount[]
  onEdit: () => void
  onDelete: () => void
  type: 'expense' | 'income'
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR')
}

export function TransactionItem({
  transaction,
  categories,
  bankAccounts,
  onEdit,
  onDelete,
  type,
}: TransactionItemProps) {
  const category = categories.find((c) => c.id === transaction.categoryId)
  const bankAccount = bankAccounts.find(
    (a) => a.id === transaction.bankAccountId
  )

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2 sm:justify-start">
          <h4 className="font-medium text-foreground">{transaction.name}</h4>
          <span
            className={`text-lg font-semibold sm:hidden ${
              type === 'expense' ? 'text-destructive' : 'text-primary'
            }`}
          >
            {type === 'expense' ? '-' : '+'}
            {formatCurrency(transaction.value)}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {category && (
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {category.name}
            </span>
          )}
          {bankAccount && (
            <span className="flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              {bankAccount.name}
            </span>
          )}
          {transaction.paymentDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(transaction.paymentDate)}
            </span>
          )}
        </div>
        {transaction.notes && (
          <p className="text-sm text-muted-foreground italic">
            {transaction.notes}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <span
          className={`hidden text-lg font-semibold sm:block ${
            type === 'expense' ? 'text-destructive' : 'text-primary'
          }`}
        >
          {type === 'expense' ? '-' : '+'}
          {formatCurrency(transaction.value)}
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
