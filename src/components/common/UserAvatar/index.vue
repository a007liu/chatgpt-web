<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NAvatar } from 'naive-ui'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store'
import defaultAvatar from '@/assets/logo.png'
import { isString } from '@/utils/is'
import { SvgIcon } from '@/components/common'

const props = defineProps({
	isUserName: {
		type: Boolean,
		default: false
	}
})

const route = useRoute()
const userStore = useUserStore()
const showPermission = ref(false)

const userInfo = computed(() => userStore.userInfo)

onMounted(async () => {
	const sign = route.query.verifyresetpassword as string
	if (sign)
		showPermission.value = true
})
</script>

<template>
	<div class="flex items-center justify-center cursor-pointer">
		<template v-if="isString(userInfo.avatar) && userInfo.avatar.length > 0">
			<NAvatar
				round
				:src="userInfo.avatar"
				:fallback-src="defaultAvatar"
			/>
		</template>
		<template v-else>
			<NAvatar round :src="defaultAvatar"/>
		</template>
		<p v-if="isUserName" class="flex items-center ml-2 font-bold text-[#333]">
			{{ userInfo.name }}
			<SvgIcon
				v-if="isUserName"
				class="text-lg text-[#5D96FD] ml-2"
				icon="teenyicons:down-solid"/>
		</p>
	</div>
</template>
