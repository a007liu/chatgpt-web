<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { NButton, NDrawer, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { UserPassword } from '@/components/common/Setting/model'
import { fetchUpdateUserPassword } from '@/api'
import { t } from '@/locales'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void

  (e: 'success'): void
}

const { isMobile } = useBasicLayout()
const ms = useMessage()

const formRef = ref()
const saving = ref(false)

const config = ref<UserPassword>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

function validatePassword(rule: any, value: any) {
  const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,20})$/
  return value && regex.test(value)
}

function validateNewPassword(rule: any, value: any) {
  return value && value === config.value.newPassword
}

const rules = ref({
  oldPassword: [
    {
      required: true,
      message: '请输入旧密码',
      trigger: ['input', 'blur'],
    },
  ],
  newPassword: [
    {
      required: true,
      message: '请输入新密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePassword,
      message: '8-20位，需包含字母和数字',
      trigger: ['input', 'blur'],
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: '请输入确认密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: validateNewPassword,
      message: '确认密码与新密码不一致',
      trigger: ['input', 'blur'],
    },
  ],
})

async function updatePassword() {
  formRef.value.validate(async (errors: any) => {
    if (!errors) {
      saving.value = true
      try {
        await fetchUpdateUserPassword(config.value as UserPassword)
        ms.success(t('common.success'))
        emit('success')
      }
      catch (error: any) {
        ms.error(error.message)
      }
      finally {
        saving.value = false
      }
    }
  })
}

onMounted(() => {
  config.value = new UserPassword()
})

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
  <NDrawer v-model:show="show" :height="600" :default-width="isMobile ? '100%' : 600" :placement="isMobile ? 'bottom' : 'right'" :close-on-esc="false" :mask-closable="false">
    <div class="flex flex-col h-full">
      <P class="py-4 text-xl text-[#000] font-bold text-center">
        个人信息
      </P>
      <NForm
        ref="formRef"
        class="px-4"
        label-placement="top"
        require-mark-placement="left"
        :label-width="80"
        show-label
        :model="config"
        :rules="rules"
      >
        <NFormItem path="oldPassword" :label="$t('setting.oldPassword')" :label-style="{ color: '#000' }">
          <NInput
            v-model:value="config.oldPassword"
            type="password" :placeholder="$t('setting.oldPassword')"
            @keydown.enter.prevent
          />
        </NFormItem>
        <NFormItem path="newPassword" :label="$t('setting.newPassword')" :label-style="{ color: '#000' }">
          <NInput
            v-model:value="config.newPassword"
            type="password" :placeholder="$t('setting.newPassword')"
            @keydown.enter.prevent
          />
        </NFormItem>
        <NFormItem path="confirmPassword" :label="$t('setting.confirmNewPassword')" :label-style="{ color: '#000' }">
          <NInput
            v-model:value="config.confirmPassword"
            :disabled="!config.newPassword"
            type="password" :placeholder="$t('setting.confirmNewPassword')"
            @keydown.enter.prevent
          />
        </NFormItem>
      </NForm>
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
          :loading="saving"
          type="primary" size="large" block round @click="updatePassword"
        >
          保存
        </NButton>
      </div>
    </div>
  </NDrawer>
</template>
