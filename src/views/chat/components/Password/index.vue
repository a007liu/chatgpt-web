<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { NButton, NDrawer, NInput, useMessage } from 'naive-ui'
import { UserPassword } from '@/components/common/Setting/model'
import { fetchUpdateUserPassword } from '@/api'
import { t } from '@/locales'

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const ms = useMessage()

const saving = ref(false)

const config = ref<UserPassword>()

async function updatePassword() {
  saving.value = true
  try {
    if (!config.value)
      throw new Error(t('common.invalid'))
    if (config.value.newPassword !== config.value.confirmPassword)
      throw new Error(t('setting.validatePasswordStartWith'))
    if (config.value.oldPassword === config.value.newPassword)
      throw new Error(t('setting.passwodSame'))
    await fetchUpdateUserPassword(config.value as UserPassword)
    ms.success(t('common.success'))
  }
  catch (error: any) {
    ms.error(error.message)
  }
  saving.value = false
}

onMounted(() => {
  config.value = new UserPassword()
})

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
            {{ $t('setting.oldPassword') }}
          </p>
          <div class="">
            <NInput
              type="password"
              :value="config && config.oldPassword"
              :placeholder="$t('setting.oldPassword')"
              @input="(val) => { if (config) config.oldPassword = val }"
            />
          </div>
        </div>
        <div class="mb-6">
          <p class="text-[#000] font-bold mb-2">
            {{ $t('setting.newPassword') }}
          </p>
          <div class="">
            <NInput
              type="password"
              :value="config && config.newPassword"
              :placeholder="$t('setting.newPassword')"
              @input="(val) => { if (config) config.newPassword = val }"
            />
          </div>
        </div>
        <div class="mb-6">
          <p class="text-[#000] font-bold mb-2">
            {{ $t('setting.confirmNewPassword') }}
          </p>
          <div class="">
            <NInput
              type="password"
              :value="config && config.confirmPassword"
              :disabled="!config || !config.newPassword"
              :placeholder="$t('setting.confirmNewPassword')"
              @input="(val) => { if (config) config.confirmPassword = val }"
            />
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
            type="primary" size="large" block round @click="updatePassword"
          >
            保存
          </NButton>
        </div>
      </div>
    </div>
  </NDrawer>
</template>
