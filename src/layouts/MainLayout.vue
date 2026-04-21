<template>
  <q-layout view="hHh Lpr lFf">
    <!-- TOPBAR (Header) - Sakai Pattern -->
    <q-header class="bt-header">
      <q-toolbar class="bt-toolbar">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          color="text-primary"
          @click="toggleLeftDrawer"
        />

        <!-- Logo and App Name -->
        <div class="row items-center q-ml-md">
          <q-icon name="sports_tennis" color="primary" size="32px" />
          <span class="text-h6 text-bold text-primary q-ml-sm gt-xs">Beach Tennis</span>
          <q-separator vertical inset class="q-mx-md gt-xs" style="background-color: var(--card-border)" />
          <span class="text-subtitle2 text-secondary gt-sm">Plataforma</span>
        </div>

        <q-space />

        <!-- Right Section - User Info -->
        <div v-if="auth.user" class="row items-center q-gutter-md">
          <div class="row items-center q-gutter-sm q-pl-md" style="border-left: 1px solid var(--card-border)">
            <div class="column items-end gt-xs">
              <span class="text-caption text-bold text-primary leading-none">{{ auth.user.name }}</span>
              <span class="text-xs text-secondary">Usuário</span>
            </div>
            <q-avatar size="36px" color="primary" text-color="white">
              {{ auth.user.name.charAt(0).toUpperCase() }}
            </q-avatar>
            <q-btn flat round dense icon="logout" color="text-secondary" @click="onLogout" class="q-ml-sm">
              <q-tooltip>Sair</q-tooltip>
            </q-btn>
          </div>
        </div>
        <div v-else>
          <q-btn flat label="Login" color="primary" to="/login" no-caps class="text-bold" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- SIDEBAR (Navigation) - Sakai Dark Pattern -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="1024"
      class="bt-sidebar"
    >
      <main-sidebar />
    </q-drawer>

    <!-- MAIN CONTENT AREA -->
    <q-page-container>
      <q-page class="bt-page">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import MainSidebar from 'src/components/MainSidebar.vue'

const auth = useAuthStore()
const router = useRouter()
const $q = useQuasar()

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function onLogout() {
  $q.dialog({
    title: 'Sair',
    message: 'Deseja realmente sair?',
    persistent: true,
    ok: { label: 'Sair', color: 'primary', unelevated: true, class: 'no-caps text-bold' },
    cancel: { label: 'Voltar', color: 'surface-500', flat: true, class: 'no-caps text-bold' },
  }).onOk(async () => {
    await auth.logout()
    router.push('/login')
  })
}
</script>

<style scoped lang="scss">
.leading-none {
  line-height: 1;
}
</style>
