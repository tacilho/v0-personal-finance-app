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
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div
        className={`flex items-center justify-between gap-4 p-4 ${
          type === 'expense' ? 'bg-destructive/5' : 'bg-primary/5'
        }`}
      >
        <div className="flex flex-1 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          {isEditing ? (
            <div className="flex flex-1 items-center gap-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-8 max-w-[200px]"
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
                className="h-8 w-8"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancelEdit}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <h3 className="flex-1 font-semibold text-foreground">{name}</h3>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-lg font-bold ${
              type === 'expense' ? 'text-destructive' : 'text-primary'
            }`}
          >
            {formatCurrency(total)}
          </span>
          {!isEditing && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 p-4">
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
              className="w-full border-dashed bg-transparent"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar {type === 'expense' ? 'Despesa' : 'Recebimento'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
