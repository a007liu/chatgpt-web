import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'
import { useUserStore } from '@/store'

export function setupPageGuard(router: Router) {
	router.beforeEach(async (to, from, next) => {
		next()
	})
}
