<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NButton, NInput, NDrawer, NSpace, useMessage } from 'naive-ui'
import { t } from '@/locales'
import { fetchUpdateChatRoomPrompt } from '@/api'
import { useChatStore } from '@/store'

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const chatStore = useChatStore()
const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)
const ms = useMessage()
const testing = ref(false)
const title = `Prompt For [${currentChatHistory.value?.title}]`

interface Props {
	visible: boolean
	roomId: string
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

async function handleSaveChatRoomPrompt() {
	if (!currentChatHistory.value || !currentChatHistory.value)
		return

	testing.value = true
	try {
		const { message } = await fetchUpdateChatRoomPrompt(currentChatHistory.value.prompt ?? '', +props.roomId) as { status: string; message: string }
		ms.success(message)
		show.value = false
	} catch (error: any) {
		ms.error(error.message)
	}
	testing.value = false
}
</script>

<template>
	<NDrawer v-model:show="show" height="600px" placement="bottom" :close-on-esc="false" :mask-closable="false">
		<div class="flex flex-col">
			<P class="py-4 text-xl text-[#000] font-bold text-center">提词器</P>
			<div class="px-4">
				<NInput
					:value="currentChatHistory && currentChatHistory.prompt"
					type="textarea"
					:rows="20"
					placeholder="提示为这个房间，如果为空将使用设置->高级->角色"
					@input="(val) => { if (currentChatHistory) currentChatHistory.prompt = val }">
				</NInput>
			</div>
			<div class="flex px-4 mt-4">
				<div class="flex-1 mr-2">
					<NButton
						type="primary"
						size="large"
						color="#E9F0FD"
						text-color="#5D96FD"
						block
						round
						@click="show=false">
						取消
					</NButton>
				</div>
				<div class="flex-1 ml-2">
					<NButton
						type="primary" size="large" block round @click="handleSaveChatRoomPrompt">
						保存
					</NButton>
				</div>
			</div>
		</div>
	</NDrawer>
</template>
