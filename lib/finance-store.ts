'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type {
  FinanceData,
  MonthData,
  ExpenseGroup,
  IncomeGroup,
  Transaction,
  Category,
  BankAccount,
} from './types'

const STORAGE_KEY = 'finance-data'

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

function getMonthKey(year: number, month: number): string {
  return `${year}-${month.toString().padStart(2, '0')}`
}

const initialData: FinanceData = {
  categories: [
    { id: '1', name: 'Uber' },
    { id: '2', name: 'Transporte' },
    { id: '3', name: 'Alimentacao' },
    { id: '4', name: 'Fatura de cartao de credito' },
    { id: '5', name: 'Moradia' },
    { id: '6', name: 'Salario' },
    { id: '7', name: 'Freelance' },
  ],
  bankAccounts: [
    { id: '1', name: 'Nubank' },
    { id: '2', name: 'Itau' },
    { id: '3', name: 'Carteira' },
    { id: '4', name: 'Dinheiro' },
  ],
  monthlyData: {
    '2026-02': {
      expenseGroups: [
        {
          id: '1',
          name: 'Despesas Fixas',
          transactions: [
            {
              id: '1',
              name: 'Aluguel',
              categoryId: '5',
              bankAccountId: '1',
              value: 1500,
              paymentDate: '2026-02-05',
              notes: 'Apartamento',
            },
            {
              id: '2',
              name: 'Internet',
              categoryId: '5',
              bankAccountId: '1',
              value: 120,
              paymentDate: '2026-02-10',
            },
            {
              id: '3',
              name: 'Conta de luz',
              categoryId: '5',
              bankAccountId: '2',
              value: 180,
              paymentDate: '2026-02-15',
            },
          ],
        },
        {
          id: '2',
          name: 'Despesas Variaveis',
          transactions: [
            {
              id: '4',
              name: 'Uber para o trabalho',
              categoryId: '1',
              bankAccountId: '1',
              value: 45.5,
            },
            {
              id: '5',
              name: 'Supermercado',
              categoryId: '3',
              bankAccountId: '1',
              value: 650,
              notes: 'Compras do mes',
            },
            {
              id: '6',
              name: 'Restaurante',
              categoryId: '3',
              bankAccountId: '4',
              value: 89,
            },
          ],
        },
        {
          id: '3',
          name: 'Transporte',
          transactions: [
            {
              id: '7',
              name: 'Gasolina',
              categoryId: '2',
              bankAccountId: '2',
              value: 250,
            },
            {
              id: '8',
              name: 'Estacionamento',
              categoryId: '2',
              bankAccountId: '4',
              value: 60,
            },
          ],
        },
      ],
      incomeGroups: [
        {
          id: '1',
          name: 'Salario',
          transactions: [
            {
              id: '9',
              name: 'Salario empresa X',
              categoryId: '6',
              bankAccountId: '1',
              value: 5500,
              paymentDate: '2026-02-05',
            },
          ],
        },
        {
          id: '2',
          name: 'Freelance',
          transactions: [
            {
              id: '10',
              name: 'Projeto website',
              categoryId: '7',
              bankAccountId: '1',
              value: 1200,
              paymentDate: '2026-02-20',
              notes: 'Cliente ABC',
            },
            {
              id: '11',
              name: 'Consultoria',
              categoryId: '7',
              bankAccountId: '2',
              value: 800,
            },
          ],
        },
        {
          id: '3',
          name: 'Extras',
          transactions: [
            {
              id: '12',
              name: 'Venda de item usado',
              categoryId: '7',
              bankAccountId: '4',
              value: 150,
            },
          ],
        },
      ],
    },
  },
}

let financeData: FinanceData = initialData
let listeners: Set<() => void> = new Set()

function loadFromStorage(): FinanceData {
  if (typeof window === 'undefined') return initialData
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return initialData
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
  return initialData
}

function saveToStorage(data: FinanceData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): FinanceData {
  return financeData
}

function getServerSnapshot(): FinanceData {
  return initialData
}

// Initialize store
if (typeof window !== 'undefined') {
  financeData = loadFromStorage()
}

// Store actions
export const financeStore = {
  // Categories
  addCategory(name: string): Category {
    const category: Category = { id: generateId(), name }
    financeData = {
      ...financeData,
      categories: [...financeData.categories, category],
    }
    saveToStorage(financeData)
    emitChange()
    return category
  },

  updateCategory(id: string, name: string) {
    financeData = {
      ...financeData,
      categories: financeData.categories.map((c) =>
        c.id === id ? { ...c, name } : c
      ),
    }
    saveToStorage(financeData)
    emitChange()
  },

  deleteCategory(id: string) {
    financeData = {
      ...financeData,
      categories: financeData.categories.filter((c) => c.id !== id),
    }
    saveToStorage(financeData)
    emitChange()
  },

  // Bank Accounts
  addBankAccount(name: string): BankAccount {
    const account: BankAccount = { id: generateId(), name }
    financeData = {
      ...financeData,
      bankAccounts: [...financeData.bankAccounts, account],
    }
    saveToStorage(financeData)
    emitChange()
    return account
  },

  updateBankAccount(id: string, name: string) {
    financeData = {
      ...financeData,
      bankAccounts: financeData.bankAccounts.map((a) =>
        a.id === id ? { ...a, name } : a
      ),
    }
    saveToStorage(financeData)
    emitChange()
  },

  deleteBankAccount(id: string) {
    financeData = {
      ...financeData,
      bankAccounts: financeData.bankAccounts.filter((a) => a.id !== id),
    }
    saveToStorage(financeData)
    emitChange()
  },

  // Expense Groups
  addExpenseGroup(monthKey: string, name: string): ExpenseGroup {
    const group: ExpenseGroup = { id: generateId(), name, transactions: [] }
    const monthData = financeData.monthlyData[monthKey] || {
      expenseGroups: [],
      incomeGroups: [],
    }
    financeData = {
      ...financeData,
      monthlyData: {
        ...financeData.monthlyData,
        [monthKey]: {
          ...monthData,
          expenseGroups: [...monthData.expenseGroups, group],
        },
      },
    }
    saveToStorage(financeData)
    emitChange()
    return group
  },

  updateExpenseGroup(monthKey: string, groupId: string, name: string) {
    const monthData = financeData.monthlyData[monthKey]
    if (!monthData) return
    financeData = {
      ...financeData,
      monthlyData: {
        ...financeData.monthlyData,
        [monthKey]: {
          ...monthData,
          expenseGroups: monthData.expenseGroups.map((g) =>
            g.id === groupId ? { ...g, name } : g
          ),
        },
      },
    }
    saveToStorage(financeData)
    emitChange()
  },

  deleteExpenseGroup(monthKey: string, groupId: string) {
    const monthData = financeData.monthlyData[monthKey]
    if (!monthData) return
    financeData = {
      ...financeData,
      monthlyData: {
        ...financeData.monthlyData,
        [monthKey]: {
          ...monthData,
          expenseGroups: monthData.expenseGroups.filter((g) => g.id !== groupId),
        },
      },
    }
    saveToStorage(financeData)
    emitChange()
  },

  // Income Groups
  addIncomeGroup(monthKey: string, name: string): IncomeGroup {
    const group: IncomeGroup = { id: generateId(), name, transactions: [] }
    const monthData = financeData.monthlyData[monthKey] || {
      expenseGroups: [],
      incomeGroups: [],
    }
    financeData = {
      ...financeData,
      monthlyData: {
        ...financeData.monthlyData,
        [monthKey]: {
          ...monthData,
          incomeGroups: [...monthData.incomeGroups, group],
        },
      },
    }
    saveToStorage(financeData)
    emitChange()
    return group
  },

  updateIncomeGroup(monthKey: string, groupId: string, name: string) {
    const monthData = financeData.monthlyData[monthKey]
    if (!monthData) return
    financeData = {
      ...financeData,
      monthlyData: {
        ...financeData.monthlyData,
        [monthKey]: {
          ...monthData,
          incomeGroups: monthData.incomeGroups.map((g) =>
            g.id === groupId ? { ...g, name } : g
          ),
        },
      },
    }
    saveToStorage(financeData)
    emitChange()
  },

  deleteIncomeGroup(monthKey: string, groupId: string) {
    const monthData = financeData.monthlyData[monthKey]
    if (!monthData) return
    financeData = {
      ...financeData,
      monthlyData: {
        ...financeData.monthlyData,
        [monthKey]: {
          ...monthData,
          incomeGroups: monthData.incomeGroups.filter((g) => g.id !== groupId),
        },
      },
    }
    saveToStorage(financeData)
    emitChange()
  },

  // Expense Transactions
  addExpenseTransaction(
    monthKey: string,
    groupId: string,
    transaction: Omit<Transaction, 'id'>
  ): Transaction {
    const newTransaction: Transaction = { ...transaction, id: generateId() }
    const monthData = financeData.monthlyData[monthKey]
    if (!monthData) return newTransaction
    financeData = {
      ...financeData,
      monthlyData: {
        ...financeData.monthlyData,
        [monthKey]: {
          ...monthData,
          expenseGroups: monthData.expenseGroups.map((g) =>
            g.id === groupId
              ? { ...g, transactions: [...g.transactions, newTransaction] }
              : g
          ),
        },
      },
    }
    saveToStorage(financeData)
    emitChange()
    return newTransaction
  },

  updateExpenseTransaction(
    monthKey: string,
    groupId: string,
    transactionId: string,
    updates: Partial<Omit<Transaction, 'id'>>
  ) {
    const monthData = financeData.monthlyData[monthKey]
    if (!monthData) return
    financeData = {
      ...financeData,
      monthlyData: {
        ...financeData.monthlyData,
        [monthKey]: {
          ...monthData,
          expenseGroups: monthData.expenseGroups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  transactions: g.transactions.map((t) =>
                    t.id === transactionId ? { ...t, ...updates } : t
                  ),
                }
              : g
          ),
        },
      },
    }
    saveToStorage(financeData)
    emitChange()
  },

  deleteExpenseTransaction(
    monthKey: string,
    groupId: string,
    transactionId: string
  ) {
    const monthData = financeData.monthlyData[monthKey]
    if (!monthData) return
    financeData = {
      ...financeData,
      monthlyData: {
        ...financeData.monthlyData,
        [monthKey]: {
          ...monthData,
          expenseGroups: monthData.expenseGroups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  transactions: g.transactions.filter(
                    (t) => t.id !== transactionId
                  ),
                }
              : g
          ),
        },
      },
    }
    saveToStorage(financeData)
    emitChange()
  },

  // Income Transactions
  addIncomeTransaction(
    monthKey: string,
    groupId: string,
    transaction: Omit<Transaction, 'id'>
  ): Transaction {
    const newTransaction: Transaction = { ...transaction, id: generateId() }
    const monthData = financeData.monthlyData[monthKey]
    if (!monthData) return newTransaction
    financeData = {
      ...financeData,
      monthlyData: {
        ...financeData.monthlyData,
        [monthKey]: {
          ...monthData,
          incomeGroups: monthData.incomeGroups.map((g) =>
            g.id === groupId
              ? { ...g, transactions: [...g.transactions, newTransaction] }
              : g
          ),
        },
      },
    }
    saveToStorage(financeData)
    emitChange()
    return newTransaction
  },

  updateIncomeTransaction(
    monthKey: string,
    groupId: string,
    transactionId: string,
    updates: Partial<Omit<Transaction, 'id'>>
  ) {
    const monthData = financeData.monthlyData[monthKey]
    if (!monthData) return
    financeData = {
      ...financeData,
      monthlyData: {
        ...financeData.monthlyData,
        [monthKey]: {
          ...monthData,
          incomeGroups: monthData.incomeGroups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  transactions: g.transactions.map((t) =>
                    t.id === transactionId ? { ...t, ...updates } : t
                  ),
                }
              : g
          ),
        },
      },
    }
    saveToStorage(financeData)
    emitChange()
  },

  deleteIncomeTransaction(
    monthKey: string,
    groupId: string,
    transactionId: string
  ) {
    const monthData = financeData.monthlyData[monthKey]
    if (!monthData) return
    financeData = {
      ...financeData,
      monthlyData: {
        ...financeData.monthlyData,
        [monthKey]: {
          ...monthData,
          incomeGroups: monthData.incomeGroups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  transactions: g.transactions.filter(
                    (t) => t.id !== transactionId
                  ),
                }
              : g
          ),
        },
      },
    }
    saveToStorage(financeData)
    emitChange()
  },

  // Reset data
  resetData() {
    financeData = initialData
    saveToStorage(financeData)
    emitChange()
  },
}

// Custom hook
export function useFinanceStore() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const getMonthData = useCallback(
    (year: number, month: number): MonthData => {
      const key = getMonthKey(year, month)
      return (
        data.monthlyData[key] || {
          expenseGroups: [],
          incomeGroups: [],
        }
      )
    },
    [data.monthlyData]
  )

  const calculateTotals = useCallback(
    (year: number, month: number) => {
      const monthData = getMonthData(year, month)

      const totalExpenses = monthData.expenseGroups.reduce(
        (sum, group) =>
          sum + group.transactions.reduce((s, t) => s + t.value, 0),
        0
      )

      const totalIncome = monthData.incomeGroups.reduce(
        (sum, group) =>
          sum + group.transactions.reduce((s, t) => s + t.value, 0),
        0
      )

      const balance = totalIncome - totalExpenses

      return {
        totalExpenses,
        totalIncome,
        balance,
      }
    },
    [getMonthData]
  )

  const getGroupTotal = useCallback(
    (transactions: Transaction[]) =>
      transactions.reduce((sum, t) => sum + t.value, 0),
    []
  )

  return {
    ...data,
    getMonthData,
    calculateTotals,
    getGroupTotal,
    getMonthKey,
  }
}
