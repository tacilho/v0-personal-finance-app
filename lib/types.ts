export interface Category {
  id: string
  name: string
}

export interface BankAccount {
  id: string
  name: string
}

export interface Transaction {
  id: string
  name: string
  categoryId: string
  bankAccountId: string
  value: number
  paymentDate?: string
  notes?: string
}

export interface ExpenseGroup {
  id: string
  name: string
  transactions: Transaction[]
}

export interface IncomeGroup {
  id: string
  name: string
  transactions: Transaction[]
}

export interface MonthData {
  expenseGroups: ExpenseGroup[]
  incomeGroups: IncomeGroup[]
}

export interface FinanceData {
  categories: Category[]
  bankAccounts: BankAccount[]
  monthlyData: Record<string, MonthData>
}

export type TransactionType = 'expense' | 'income'
