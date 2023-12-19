<script lang="ts" setup>
import { computed, defineAsyncComponent, h, ref } from 'vue'
import type { DropdownDividerOption, DropdownGroupOption, DropdownOption, DropdownRenderOption } from 'naive-ui'
import { NDropdown, useDialog } from 'naive-ui'
import UserInfo from '../UserInfo/index.vue'
import Password from '../Password/index.vue'

import { SvgIcon, UserAvatar } from '@/components/common'
import { useAppStore, useAuthStore, useChatStore, useUserStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'

defineProps<Props>()

const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'))

interface Props {
  usingContext: boolean
}

const appStore = useAppStore()
const authStore = useAuthStore()
const chatStore = useChatStore()
const userStore = useUserStore()

// 移动端自适应相关
const { isMobile } = useBasicLayout()

const dialog = useDialog()

const showUserInfo = ref(false)
const showPassword = ref(false)
const showSetting = ref(false)

const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)

const renderIcon = (icon: string) => {
  return () => {
    return h(SvgIcon, {
      icon,
      class: 'text-xl text-[#5D96FD]',
    })
  }
}

const renderCustomHeader = () => {
  return h(
    'div',
    { style: 'display: flex; align-items: center; padding: 8px 12px;' },
    [
      h(UserAvatar, {
        isUserName: true,
        style: 'margin-right: 6px;',
      }),
    ],
  )
}

const options = [
  {
    key: 'header',
    type: 'render',
    render: renderCustomHeader,
    show: isMobile.value,
  },
  {
    label: '个人信息',
    key: 'userInfo',
    icon: renderIcon('bx:user'),
  },
  {
    label: '修改密码',
    key: 'password',
    icon: renderIcon('teenyicons:lock-outline'),
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon('ic:baseline-logout'),
  },
] as Array<DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption>

const collapsed = computed(() => appStore.siderCollapsed)

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

// 选择
const handleSelect = async (key: string) => {
  if (key === 'userInfo') {
    showUserInfo.value = true
  }
  else if (key === 'password') {
    showPassword.value = true
  }
  else if (key === 'logout') {
    dialog.info({
      content: () => {
        return h(
          'div', {
            class: 'text-lg font-bold mb-10',
            style: {},
          }, '确定退出登录？',
        )
      },
      positiveText: '确定',
      negativeText: '取消',
      style: { 'width': '70%', 'max-width': '400px' },
      showIcon: false,
      closable: false,
      onPositiveClick: async () => {
        await authStore.removeToken()
      },
    })
  }
}
</script>

<template>
  <header
    class="sticky top-0 left-0 right-0 z-30 border-b dark:border-neutral-800 bg-white/80 dark:bg-black/20 backdrop-blur"
  >
    <div class="flex items-center px-4 py-2 border-b">
      <div class="flex">
        <img class="h-6" src="../../../../assets/logo_full.png" alt="">
      </div>
      <div class="flex-1 flex items-center justify-end">
        <SvgIcon
          v-if="userStore.userInfo.root"
          class="text-2xl text-[#5D96FD]"
          :class="{ 'mr-4': !isMobile, 'text-4xl': !isMobile }"
          icon="ri:settings-4-line"
          @click="showSetting = true"
        />
        <button
          v-if="isMobile"
          class="flex items-center justify-center w-12 h-12 mx-2"
          @click="handleUpdateCollapsed"
        >
          <SvgIcon
            v-if="collapsed"
            class="text-2xl text-[#5D96FD]"
            icon="ri:align-justify"
          />
          <SvgIcon
            v-else
            class="text-2xl text-[#5D96FD]"
            icon="ri:align-right"
          />
        </button>
        <NDropdown class="user-drop" :options="options" show-arrow @select="handleSelect">
          <UserAvatar :is-user-name="!isMobile" />
        </NDropdown>
      </div>
    </div>
    <p class="flex justify-center py-2">
      <SvgIcon
        class="text-2xl text-[#5D96FD]"
        icon="fluent:chat-20-filled"
      />
      <span class="pl-1 font-bold text-ellipsis text-[#333]">{{ currentChatHistory?.title ?? '' }}</span>
    </p>
  </header>
  <UserInfo v-if="showUserInfo" v-model:visible="showUserInfo" @success="showUserInfo = false" />
  <Password v-if="showPassword" v-model:visible="showPassword" @success="showPassword = false" />
  <Setting v-if="showSetting" v-model:visible="showSetting" />
</template>

<style lang="less">
.user-drop {
	.n-dropdown-option {
		border-bottom: 1px solid #eee;

		&:nth-child(4) {
			border-bottom: none;
		}

		.n-dropdown-option-body__label {
			color: #333333;
			font-weight: 600;
		}
	}
}
</style>
