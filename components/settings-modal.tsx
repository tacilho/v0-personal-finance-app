'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { financeStore, useFinanceStore } from '@/lib/finance-store'

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { categories, bankAccounts } = useFinanceStore()

  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editCategoryName, setEditCategoryName] = useState('')

  const [newAccount, setNewAccount] = useState('')
  const [editingAccount, setEditingAccount] = useState<string | null>(null)
  const [editAccountName, setEditAccountName] = useState('')

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      financeStore.addCategory(newCategory.trim())
      setNewCategory('')
    }
  }

  const handleUpdateCategory = (id: string) => {
    if (editCategoryName.trim()) {
      financeStore.updateCategory(id, editCategoryName.trim())
      setEditingCategory(null)
    }
  }

  const handleAddAccount = () => {
    if (newAccount.trim()) {
      financeStore.addBankAccount(newAccount.trim())
      setNewAccount('')
    }
  }

  const handleUpdateAccount = (id: string) => {
    if (editAccountName.trim()) {
      financeStore.updateBankAccount(id, editAccountName.trim())
      setEditingAccount(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Configuracoes</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="accounts">Contas Bancarias</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-4 space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nova categoria..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button onClick={handleAddCategory}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="max-h-[300px] space-y-2 overflow-y-auto">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                >
                  {editingCategory === category.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <Input
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="h-8"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter')
                            handleUpdateCategory(category.id)
                          if (e.key === 'Escape') setEditingCategory(null)
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateCategory(category.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingCategory(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-foreground">{category.name}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingCategory(category.id)
                            setEditCategoryName(category.name)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            financeStore.deleteCategory(category.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="mt-4 space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nova conta bancaria..."
                value={newAccount}
                onChange={(e) => setNewAccount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAccount()}
              />
              <Button onClick={handleAddAccount}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="max-h-[300px] space-y-2 overflow-y-auto">
              {bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                >
                  {editingAccount === account.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <Input
                        value={editAccountName}
                        onChange={(e) => setEditAccountName(e.target.value)}
                        className="h-8"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateAccount(account.id)
                          if (e.key === 'Escape') setEditingAccount(null)
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateAccount(account.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingAccount(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-foreground">{account.name}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingAccount(account.id)
                            setEditAccountName(account.name)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            financeStore.deleteBankAccount(account.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
