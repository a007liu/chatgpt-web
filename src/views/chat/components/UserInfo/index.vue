<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NButton, NDrawer, NInput, useMessage } from 'naive-ui'
import { t } from '@/locales'
import { useUserStore } from '@/store'

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const userStore = useUserStore()

const ms = useMessage()
const userInfo = computed(() => userStore.userInfo)
const avatar = ref(userInfo.value.avatar ?? '')

const name = ref(userInfo.value.name ?? '')

interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

const handleSaveUserInfo = async () => {
  await userStore.updateUserInfo(true, userInfo.value)
  ms.success(t('common.success'))
}
</script>

<template>
  <NDrawer v-model:show="show" height="600px" placement="bottom" :close-on-esc="false" :mask-closable="false">
    <div class="flex flex-col h-full">
      <P class="py-4 text-xl text-[#000] font-bold text-center">
        个人信息
      </P>
      <div class="px-4">
        <div class="mb-6">
          <p class="text-[#000] font-bold mb-2">
            {{ $t('setting.name') }}
          </p>
          <div class="">
            <NInput v-model:value="name" size="large" placeholder="请输入用户名称" />
          </div>
        </div>
        <div class="mb-6">
          <p class="text-[#000] font-bold mb-2">
            {{ $t('setting.avatarLink') }}
          </p>
          <div class="">
            <NInput v-model:value="avatar" size="large" placeholder="请输入头像链接" />
          </div>
        </div>
      </div>
      <div class="flex-1 flex items-end px-4 pb-4">
        <div class="flex-1 mr-2">
          <NButton
            type="primary"
            size="large"
            color="#E9F0FD"
            text-color="#5D96FD"
            block
            round
            @click="show = false"
          >
            取消
          </NButton>
        </div>
        <div class="flex-1 ml-2">
          <NButton
            type="primary" size="large" block round @click="handleSaveUserInfo"
          >
            保存
          </NButton>
        </div>
      </div>
    </div>
  </NDrawer>
</template>
