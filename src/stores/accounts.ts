import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AccountType } from '@/types'
import type { Account } from '@/types'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  // Возвращает true, если аккаунт валиден, false в противном случае
  const isAccountValid = (account: Account): boolean => {
    // Проверка логина: должен существовать и быть не длиннее 100 символов
    if (!account.login || account.login.length > 100) return false
    // Для локальных аккаунтов проверяем пароль: должен существовать и быть не длиннее 100 символов
    if (account.type === AccountType.LOCAL && (!account.password || account.password.length > 100)) return false
    return true
  }

  // Загрузка аккаунтов из localStorage
  const loadAccounts = () => {
    const savedAccounts = localStorage.getItem('accounts')
    if (savedAccounts) {
      const parsedAccounts = JSON.parse(savedAccounts)
      // Фильтруем валидные аккаунты и добавляем поля ошибок
      accounts.value = parsedAccounts
        .filter((account: Account) => isAccountValid(account))
        .map((account: Account) => ({
          ...account,
          errors: {
            login: false,
            password: false
          }
        }))
    }
  }

  // Сохранение аккаунтов в localStorage
  const saveAccounts = () => {
    // Фильтруем только валидные аккаунты и убираем поля ошибок
    const validAccounts = accounts.value
      .filter(isAccountValid)
      .map(({ errors, ...account }) => account)

    localStorage.setItem('accounts', JSON.stringify(validAccounts))
  }

  // Добавление нового аккаунта
  const addAccount = () => {
    // Создаем новый аккаунт с начальными значениями
    const newAccount: Account = {
      id: Date.now().toString(),
      labels: [],
      type: AccountType.LOCAL,
      login: '',
      password: '',
      errors: {
        login: false,
        password: false
      }
    }
    // Добавляем новый аккаунт в массив (пока только в pinia стор)
    accounts.value.push(newAccount)
  }

  // Удаление аккаунта по ID
  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter(account => account.id !== id)
    saveAccounts()
  }

  // Обновление данных аккаунта
  const updateAccount = (id: string, updates: Partial<Account>) => {
    // Находим индекс аккаунта в массиве
    const accountIndex = accounts.value.findIndex(acc => acc.id === id)
    if (accountIndex !== -1) {
      // Обновляем аккаунт, сохраняя существующие данные и применяя изменения
      accounts.value[accountIndex] = {
        ...accounts.value[accountIndex],
        ...updates
      }
      
      // Проверяем валидность обновленного аккаунта
      validateAccount(id)
    }
  }

  // Валидация аккаунта по ID. Возвращает true, если аккаунт валиден, false в противном случае
  const validateAccount = (id: string) => {
    const account = accounts.value.find(acc => acc.id === id)
    if (!account) return false

    // Проверяем наличие ошибок
    const errors = {
      // Ошибка логина: пустой или длиннее 100 символов
      login: !account.login || account.login.length > 100,
      // Ошибка пароля для локальных аккаунтов: пустой или длиннее 100 символов
      password: account.type === AccountType.LOCAL && (!account.password || account.password.length > 100)
    }

    const accountIndex = accounts.value.findIndex(acc => acc.id === id)
    if (accountIndex !== -1) {
      // Обновляем аккаунт с новыми значениями ошибок
      accounts.value[accountIndex] = {
        ...account,
        errors
      }
    }

    // Сохраняем в localStorage
    saveAccounts()

    // Возвращаем true, если нет ошибок
    return !errors.login && !errors.password
  }

  // Инициализация: загрузка аккаунтов при создании store
  loadAccounts()

  return {
    accounts,
    addAccount,
    removeAccount,
    updateAccount,
    validateAccount
  }
})