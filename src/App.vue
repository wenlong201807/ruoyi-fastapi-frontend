<template>
  <div>
    <h1>前端--环境变量：{{ import.meta.env.VITE_APP_TITLE }}</h1>
    <router-view />
  </div>
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
})
</script>
