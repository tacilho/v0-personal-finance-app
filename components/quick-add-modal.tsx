'use client'

import React from "react"

import { useState } from 'react'
import { TrendingDown, TrendingUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Transaction, Category, BankAccount, Group } from '@/lib/types'

interface QuickAddModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: 'expense' | 'income'
  categories: Category[]
  bankAccounts: BankAccount[]
  groups: Group[]
  onAddTransaction: (groupId: string, data: Omit<Transaction, 'id'>) => void
  onAddGroup: (name: string) => void
}

export function QuickAddModal({
  open,
  onOpenChange,
  type,
  categories,
  bankAccounts,
  groups,
  onAddTransaction,
  onAddGroup,
}: QuickAddModalProps) {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [bankAccountId, setBankAccountId] = useState('')
  const [value, setValue] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [notes, setNotes] = useState('')
  const [groupId, setGroupId] = useState('')
  const [newGroupName, setNewGroupName] = useState('')
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)

  const resetForm = () => {
    setName('')
    setCategoryId('')
    setBankAccountId('')
    setValue('')
    setPaymentDate('')
    setNotes('')
    setGroupId('')
    setNewGroupName('')
    setIsCreatingGroup(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    let targetGroupId = groupId

    if (isCreatingGroup && newGroupName.trim()) {
      onAddGroup(newGroupName.trim())
      resetForm()
      onOpenChange(false)
      return
    }

    if (!name || !categoryId || !bankAccountId || !value || !targetGroupId) return

    onAddTransaction(targetGroupId, {
      name,
      categoryId,
      bankAccountId,
      value: parseFloat(value),
      paymentDate: paymentDate || undefined,
      notes: notes || undefined,
    })

    resetForm()
    onOpenChange(false)
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`rounded-full p-1.5 ${type === 'expense' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
              {type === 'expense' ? (
                <TrendingDown className={`h-4 w-4 text-destructive`} />
              ) : (
                <TrendingUp className={`h-4 w-4 text-primary`} />
              )}
            </div>
            {type === 'expense' ? 'Nova Despesa' : 'Novo Recebimento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {groups.length === 0 || isCreatingGroup ? (
            <div className="space-y-2">
              <Label htmlFor="newGroup">Nome do Novo Grupo *</Label>
              <Input
                id="newGroup"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder={type === 'expense' ? 'Ex: Casa, Carro...' : 'Ex: Salarios, Freelance...'}
                required
              />
              {groups.length > 0 && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setIsCreatingGroup(false)}
                  className="h-auto p-0 text-xs"
                >
                  Usar grupo existente
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="group">Grupo *</Label>
              <Select value={groupId} onValueChange={setGroupId}>
                <SelectTrigger id="group">
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => setIsCreatingGroup(true)}
                className="h-auto p-0 text-xs"
              >
                Criar novo grupo
              </Button>
            </div>
          )}

          {!isCreatingGroup && groups.length > 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={type === 'expense' ? 'Ex: Conta de luz' : 'Ex: Salario'}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <Label htmlFor="date">Data Pagamento</Label>
                  <Input
                    id="date"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione" />
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
                  <Label htmlFor="bank">Conta *</Label>
                  <Select value={bankAccountId} onValueChange={setBankAccountId}>
                    <SelectTrigger id="bank">
                      <SelectValue placeholder="Selecione" />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observacoes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observacoes opcionais..."
                  rows={2}
                />
              </div>
            </>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button
              type="submit"
              className={`flex-1 ${
                type === 'expense'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isCreatingGroup || groups.length === 0 ? 'Criar Grupo' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
