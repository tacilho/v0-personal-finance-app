'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TransactionItem } from './transaction-item'
import { TransactionForm } from './transaction-form'
import type { Transaction, Category, BankAccount } from '@/lib/types'

interface GroupCardProps {
  id: string
  name: string
  transactions: Transaction[]
  categories: Category[]
  bankAccounts: BankAccount[]
  type: 'expense' | 'income'
  total: number
  onUpdateName: (name: string) => void
  onDelete: () => void
  onAddTransaction: (data: Omit<Transaction, 'id'>) => void
  onUpdateTransaction: (
    transactionId: string,
    data: Partial<Omit<Transaction, 'id'>>
  ) => void
  onDeleteTransaction: (transactionId: string) => void
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function GroupCard({
  name,
  transactions,
  categories,
  bankAccounts,
  type,
  total,
  onUpdateName,
  onDelete,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}: GroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(name)
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)

  const handleSaveName = () => {
    if (editName.trim()) {
      onUpdateName(editName.trim())
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditName(name)
    setIsEditing(false)
  }

  return (
    <div className="overflow-hidden rounded-lg md:rounded-xl border border-border bg-card shadow-sm">
      <div
        className={`flex items-center justify-between gap-2 md:gap-4 p-3 md:p-4 ${
          type === 'expense' ? 'bg-destructive/5' : 'bg-primary/5'
        }`}
      >
        <div className="flex flex-1 items-center gap-2 md:gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 md:h-8 md:w-8 shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          {isEditing ? (
            <div className="flex flex-1 items-center gap-1.5 md:gap-2 min-w-0">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-7 md:h-8 flex-1 min-w-0"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName()
                  if (e.key === 'Escape') handleCancelEdit()
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveName}
                className="h-7 w-7 md:h-8 md:w-8 shrink-0"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancelEdit}
                className="h-7 w-7 md:h-8 md:w-8 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <h3 className="flex-1 text-sm md:text-base font-semibold text-foreground truncate">{name}</h3>
          )}
        </div>

        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <span
            className={`text-sm md:text-lg font-bold ${
              type === 'expense' ? 'text-destructive' : 'text-primary'
            }`}
          >
            {formatCurrency(total)}
          </span>
          {!isEditing && (
            <div className="hidden sm:flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-7 w-7 md:h-8 md:w-8"
              >
                <Pencil className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-7 w-7 md:h-8 md:w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-2 md:space-y-3 p-3 md:p-4">
          {/* Mobile actions for group */}
          <div className="flex sm:hidden justify-end gap-1 -mt-1 mb-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-7 text-xs"
            >
              <Pencil className="h-3 w-3 mr-1" />
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-7 text-xs text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Excluir
            </Button>
          </div>

          {transactions.map((transaction) =>
            editingTransaction?.id === transaction.id ? (
              <TransactionForm
                key={transaction.id}
                transaction={transaction}
                categories={categories}
                bankAccounts={bankAccounts}
                type={type}
                onSave={(data) => {
                  onUpdateTransaction(transaction.id, data)
                  setEditingTransaction(null)
                }}
                onCancel={() => setEditingTransaction(null)}
              />
            ) : (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                categories={categories}
                bankAccounts={bankAccounts}
                type={type}
                onEdit={() => setEditingTransaction(transaction)}
                onDelete={() => onDeleteTransaction(transaction.id)}
              />
            )
          )}

          {showForm ? (
            <TransactionForm
              categories={categories}
              bankAccounts={bankAccounts}
              type={type}
              onSave={(data) => {
                onAddTransaction(data)
                setShowForm(false)
              }}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <Button
              variant="outline"
              className="w-full border-dashed bg-transparent text-xs md:text-sm h-9 md:h-10"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
              Adicionar {type === 'expense' ? 'Despesa' : 'Recebimento'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
