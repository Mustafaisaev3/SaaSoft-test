<template>
  <div class="max-w-6xl mx-auto mt-8 p-4">
    <div class="flex justify-between items-center mb-6">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-lg font-bold sm:text-xl md:text-2xl lg:text-3xl">Учетные записи</h1>
          <Button 
            variant="outline" 
            @click="addAccount"
            class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-2xl leading-none"
          > 
            <Plus class="w-5 h-5" />
          </Button>
        </div>

        <div class="text-sm text-muted-foreground flex items-center gap-2 mt-4 px-2 py-1 rounded-sm bg-gray-100">
          <span class="w-6 h-6 sm:w-7 sm:h-7 text-lg sm:text-xl font-semibold flex items-center justify-center border border-black rounded-full">
            ?
          </span>
          <p class="text-xs sm:text-sm md:text-base">
            Для указания нескольких меток для одной пары логин/пароль используйте разделитель <strong>;</strong>
          </p>
        </div>
      </div>
    </div>

    <div v-if="store.accounts.length === 0" class="text-center text-muted-foreground py-8">
      Нет учетных записей. Нажмите "+" для создания новой.
    </div>

    <div v-else class="overflow-x-auto">
      <Table class="w-full min-w-[640px]">
        <TableHeader>
          <TableRow>
            <TableHead class="w-1/4 min-w-[150px]">Метка</TableHead>
            <TableHead class="w-1/6 min-w-[120px]">Тип записи</TableHead>
            <TableHead class="w-1/4 min-w-[150px]">Логин</TableHead>
            <TableHead class="w-1/4 min-w-[150px]">Пароль</TableHead>
            <TableHead class="w-1/6 min-w-[100px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AccountItem
            v-for="account in store.accounts"
            :key="account.id"
            :account="account"
          />
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'

import AccountItem from '@/components/accounts/AccountsItem.vue'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-vue-next'

const store = useAccountsStore()

const addAccount = () => {
  store.addAccount()
}
</script>