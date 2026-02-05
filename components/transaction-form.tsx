'use client'

import React from "react"

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Transaction, Category, BankAccount } from '@/lib/types'

interface TransactionFormProps {
  transaction?: Transaction
  categories: Category[]
  bankAccounts: BankAccount[]
  onSave: (data: Omit<Transaction, 'id'>) => void
  onCancel: () => void
  type: 'expense' | 'income'
}

export function TransactionForm({
  transaction,
  categories,
  bankAccounts,
  onSave,
  onCancel,
  type,
}: TransactionFormProps) {
  const [name, setName] = useState(transaction?.name || '')
  const [categoryId, setCategoryId] = useState(transaction?.categoryId || '')
  const [bankAccountId, setBankAccountId] = useState(
    transaction?.bankAccountId || ''
  )
  const [value, setValue] = useState(transaction?.value?.toString() || '')
  const [paymentDate, setPaymentDate] = useState(transaction?.paymentDate || '')
  const [notes, setNotes] = useState(transaction?.notes || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !categoryId || !bankAccountId || !value) return

    onSave({
      name,
      categoryId,
      bankAccountId,
      value: parseFloat(value),
      paymentDate: paymentDate || undefined,
      notes: notes || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">
          {transaction ? 'Editar' : 'Novo'}{' '}
          {type === 'expense' ? 'Lancamento' : 'Recebimento'}
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={
              type === 'expense' ? 'Ex: Conta de luz' : 'Ex: Salario'
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Valor (R$) *</Label>
          <Input
            id="value"
            type="number"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0,00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank">Conta Bancaria *</Label>
          <Select value={bankAccountId} onValueChange={setBankAccountId}>
            <SelectTrigger id="bank">
              <SelectValue placeholder="Selecione uma conta" />
            </SelectTrigger>
            <SelectContent>
              {bankAccounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data de Pagamento</Label>
          <Input
            id="date"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Observacoes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observacoes opcionais..."
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          className={
            type === 'expense'
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }
        >
          {transaction ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
    </form>
  )
}
