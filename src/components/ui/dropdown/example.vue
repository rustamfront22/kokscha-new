<script setup>
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
} from './dropdown'

const onProfile = () => console.log('profile')
const onSettings = () => console.log('settings')
const onLogout = () => console.log('logout')
</script>

<template>
  <Dropdown>
    <DropdownTrigger>
      Меню
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </DropdownTrigger>

    <DropdownContent align="start">
      <DropdownLabel>Мой аккаунт</DropdownLabel>
      <DropdownSeparator />
      <DropdownItem @select="onProfile">Профиль</DropdownItem>
      <DropdownItem @select="onSettings">Настройки</DropdownItem>
      <DropdownItem disabled>Биллинг (скоро)</DropdownItem>
      <DropdownSeparator />
      <DropdownItem @select="onLogout">Выйти</DropdownItem>
    </DropdownContent>
  </Dropdown>
</template>
