<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { NButton, NInput, NSpin, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { SvgIcon } from '@/components/common'

import { fetchLogin } from '@/api'
import { useAuthStore } from '@/store'
import { getToken } from '@/store/modules/auth/helper'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const { isMobile } = useBasicLayout()
const router = useRouter()
const ms = useMessage()
const authStore = useAuthStore()
const pageLoading = ref(true)
const loading = ref(false)
const username = ref('')
const password = ref('')
const token = ref('')

const disabled = computed(() => !username.value.trim() || !password.value.trim() || loading.value)

const loginCls = computed(() => {
  return isMobile.value ? ['is-mobile'] : ['flex', 'items-center', 'justify-end']
})

const loginFormCls = computed(() => {
  return isMobile.value ? [] : ['w-[450px]', 'mr-[70px]']
})

// 登录
async function handleLogin() {
  const name = username.value.trim()
  const pwd = password.value.trim()
  if (!name || !pwd)
    return
  try {
    loading.value = true
    const result = await fetchLogin(name, pwd, token.value)
    await authStore.setToken(result.data.token)
    ms.success(result.message as string)
    // await router.replace({ name: 'Chat' })
    window.location.reload()
  }
  catch (error: any) {
    ms.error(error.message ?? 'error')
    password.value = ''
  }
  finally {
    loading.value = false
  }
}

// 回车登录
function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleLogin()
  }
}

onBeforeMount(async () => {
  if (getToken())
    await router.replace({ name: 'Chat' })

  pageLoading.value = false
})
</script>

<template>
  <div v-if="pageLoading" class="flex items-center justify-center w-full h-full">
    <NSpin size="large" />
  </div>
  <div
    v-else
    class="relative w-full h-full bg-white px-6 py-2 login"
    :class="loginCls"
  >
    <img v-if="!isMobile" class="absolute left-8 top-8" src="../../assets/logo_full.png">
    <div :class="loginFormCls">
      <!-- logo -->
      <div class="flex align-center w-full py-20">
        <img v-if="isMobile" class="w-20 w-20" src="../../assets/logo.png">
        <div class="flex flex-col justify-center pl-3 text-[#5D96FD]">
          <p class="text-3xl font-black  mb-1">
            欢迎登陆
          </p>
          <p class="text-base font-bold">
            富奥智慧 Al 助手
          </p>
        </div>
      </div>

      <div class="px-4">
        <div class="flex items-center mb-4">
          <SvgIcon class="mr-2 text-2xl text-[#5D96FD]" icon="bx:user" />
          <NInput
            v-model:value="username"
            class="flex-1 input-no-border"
            type="text"
            size="large"
            clearable
            :placeholder="$t('common.username')"
          />
        </div>
        <div class="flex items-center mb-16">
          <SvgIcon class="mr-2 text-2xl text-[#5D96FD]" icon="teenyicons:lock-outline" />
          <NInput
            v-model:value="password"
            class=" input-no-border"
            type="password"
            size="large"
            show-password-on="click"
            :placeholder="$t('common.password')"
            @keypress="handlePress"
          />
        </div>
        <NButton
          type="primary"
          size="large"
          block
          round
          clearable
          :disabled="disabled"
          :loading="loading"
          @click="handleLogin"
        >
          {{
            $t('common.login')
          }}
        </NButton>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.login {
	background: #fff;
	background: url("../../assets/login-bg-c.png") no-repeat;
	background-size: contain;

	&.is-mobile {
		background: url("../../assets/login-bg.png") no-repeat bottom left;
	}
}
</style>
