<script lang="ts" setup>
import { storeToRefs } from "pinia";
import AdminProfile from "@/components/AdminProfile.vue";

import TutorProfile from "@/components/TutorProfile.vue";
import UserProfile from "@/components/UserProfile.vue";
import { useAppStore } from "@/stores/app";

defineOptions({ name: "ProfilePage" });

const { currentAdmin, currentTutor, currentUser } = storeToRefs(useAppStore());
</script>

<template>
	<div>
		<AdminProfile v-if="currentAdmin" />
		<TutorProfile v-else-if="currentTutor" />
		<UserProfile v-else-if="currentUser" />
		<div v-else class="loginSignup">
			<h3>Please login or signup!</h3>
		</div>
	</div>
</template>

<style scoped>
div.loginSignup {
	text-align: center;
}

div {
	margin: 22% 0;
}
</style>
