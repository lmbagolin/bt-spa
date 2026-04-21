<template>
  <q-layout view="hHh Lpr lFf">
    <!-- Header principal largura total -->
    <q-header class="q-py-xs shadow-sm bg-white text-surface-900 border-bottom">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          color="surface-600"
          @click="toggleLeftDrawer"
        />

        <div class="row items-center q-ml-md">
          <q-icon name="sports_tennis" color="primary" size="32px" />
          <span class="text-h6 text-bold text-primary q-ml-sm gt-xs">Beach Tennis</span>
          <q-separator vertical inset class="q-mx-md gt-xs" color="surface-100" />
          <span class="text-subtitle2 text-surface-400 gt-sm">Plataforma</span>
        </div>

        <q-space />

        <div v-if="auth.user" class="row items-center q-gutter-md">
          <div class="row items-center q-gutter-sm q-pl-md border-left">
            <div class="column items-end gt-xs">
              <span class="text-caption text-bold text-surface-900 leading-none">{{ auth.user.name }}</span>
              <span class="text-xs text-surface-400">Usuário</span>
            </div>
            <q-avatar size="36px" color="primary" text-color="white">
              {{ auth.user.name.charAt(0).toUpperCase() }}
            </q-avatar>
            <q-btn flat round dense icon="logout" color="surface-400" @click="onLogout" class="q-ml-sm">
              <q-tooltip>Sair</q-tooltip>
            </q-btn>
          </div>
        </div>
        <div v-else>
          <q-btn flat label="Login" color="primary" to="/login" no-caps class="text-bold" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar escura abaixo do header -->
    <q-drawer v-model="leftDrawerOpen" show-if-above :width="280" class="sakai-sidebar">
      <main-sidebar />
    </q-drawer>

    <q-page-container>
      <div class="page-content">
        <router-view />
      </div>
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

<style scoped>
.border-bottom {
  border-bottom: 1px solid var(--surface-100);
}

.border-left {
  border-left: 1px solid var(--surface-100);
}

.sakai-sidebar {
  border-right: none;
}

.page-content {
  min-height: calc(100vh - 60px);
  background-color: var(--surface-50);
}
</style>
