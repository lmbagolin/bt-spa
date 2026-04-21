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
          <span class="text-subtitle2 text-surface-400 gt-sm">{{ arenaStore.currentArena?.name }}</span>
        </div>

        <q-space />

        <div class="row items-center q-gutter-md">
          <q-btn flat round dense icon="notifications" color="surface-400">
            <q-badge color="red" floating size="xs">2</q-badge>
          </q-btn>

          <div class="row items-center q-gutter-sm q-pl-md border-left">
            <div class="column items-end gt-xs">
              <span class="text-caption text-bold text-surface-900 leading-none">{{ authStore.user?.name }}</span>
              <span class="text-xs text-surface-400">Administrador</span>
            </div>
            <q-avatar size="36px" color="primary" text-color="white">
              {{ authStore.user?.name.charAt(0).toUpperCase() || 'U' }}
            </q-avatar>
            <q-btn flat round dense icon="logout" color="surface-400" @click="onLogout" class="q-ml-sm" />
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar escura abaixo do header -->
    <q-drawer v-model="leftDrawerOpen" show-if-above :width="240" class="sakai-sidebar">
      <div class="column full-height bg-surface-800">
        <!-- Logo da Arena (Topo da Sidebar) -->
        <div class="q-pa-lg flex items-center no-wrap">
          <q-avatar size="40px" class="bg-blue-500 shadow-sm">
            <img v-if="arenaStore.currentArena?.logo_url" :src="arenaStore.currentArena.logo_url" />
            <q-icon v-else name="sports_tennis" color="white" size="24px" />
          </q-avatar>
          <div class="column q-ml-md">
            <span class="text-sm text-bold text-white leading-none truncate" style="max-width: 140px;">
              {{ arenaStore.currentArena?.name }}
            </span>
            <span class="text-xs text-surface-400">Beach Tennis Manager</span>
          </div>
        </div>

        <q-separator color="white" dark opacity="0.05" class="q-mx-lg" />

        <!-- Navigation -->
        <q-list padding class="col q-px-md q-mt-md">
          <q-item-label
            header
            class="text-xs text-bold text-surface-500 q-mb-sm tracking-widest text-uppercase"
          >
            MENU PRINCIPAL
          </q-item-label>

          <q-item
            v-for="link in links"
            :key="link.title"
            clickable
            v-ripple
            :to="link.to"
            exact
            class="nav-item q-mb-xs"
            active-class="nav-active"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" size="22px" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ link.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Footer discreto -->
        <div class="q-pa-md">
          <q-separator color="white" dark opacity="0.05" class="q-mb-md" />
          <q-btn
            flat
            color="surface-400"
            icon="arrow_back"
            label="Minhas Arenas"
            class="full-width no-caps text-bold sidebar-footer-btn"
            @click="$router.push('/arenas')"
          />
        </div>
      </div>
    </q-drawer>

    <!-- Content -->
    <q-page-container>
      <div class="page-content">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArenaStore } from 'src/stores/arena'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const authStore = useAuthStore()
const arenaStore = useArenaStore()
const route = useRoute()
const router = useRouter()
const leftDrawerOpen = ref(false)

const arenaId = ref(route.params.id)

const links = ref([
  { title: 'Dashboard', icon: 'dashboard', to: `/admin/arena/${arenaId.value}/dashboard` },
  { title: 'Torneios', icon: 'emoji_events', to: `/admin/arena/${arenaId.value}/tournaments` },
  { title: 'Jogadores', icon: 'people', to: `/admin/arena/${arenaId.value}/players` },
  { title: 'Ligas', icon: 'sports_soccer', to: `/admin/arena/${arenaId.value}/leagues` },
  { title: 'Configurações', icon: 'settings', to: `/admin/arena/${arenaId.value}/settings` },
])

watch(() => route.params.id, (newId) => {
  if (newId) {
    arenaId.value = newId
    links.value = [
      { title: 'Dashboard', icon: 'dashboard', to: `/admin/arena/${newId}/dashboard` },
      { title: 'Torneios', icon: 'emoji_events', to: `/admin/arena/${newId}/tournaments` },
      { title: 'Jogadores', icon: 'people', to: `/admin/arena/${newId}/players` },
      { title: 'Ligas', icon: 'sports_soccer', to: `/admin/arena/${newId}/leagues` },
      { title: 'Configurações', icon: 'settings', to: `/admin/arena/${newId}/settings` },
    ]
  }
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function onLogout() {
  $q.dialog({
    title: 'Sair',
    message: 'Deseja encerrar sua sessão?',
    persistent: true,
    ok: { label: 'Sair', color: 'primary', unelevated: true, class: 'no-caps text-bold' },
    cancel: { label: 'Voltar', color: 'surface-500', flat: true, class: 'no-caps text-bold' },
  }).onOk(async () => {
    await authStore.logout()
    router.push('/login')
  })
}

onMounted(async () => {
  if (arenaStore.arenas.length === 0) {
    await arenaStore.fetchArenas()
  }
  const arena = arenaStore.arenas.find((a) => a.id == arenaId.value)
  if (arena) {
    arenaStore.setCurrentArena(arena)
  }
})
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

.nav-item {
  border-radius: var(--radius-md);
  color: var(--surface-400);
  padding: 10px 16px;
  transition: all 0.2s ease;
  margin-left: 8px;
  margin-right: 8px;
}

.nav-item:hover {
  background-color: var(--sidebar-hover);
  color: white;
}

/* Os estilos .nav-active agora são definidos globalmente no app.scss para maior controle */

.leading-none {
  line-height: 1;
}

.sidebar-footer-btn {
  border-radius: var(--radius-md);
}

.sidebar-footer-btn:hover {
  background-color: var(--sidebar-hover);
  color: white !important;
}

.bg-blue-500 {
  background-color: #0ea5e9;
}

.page-content {
  min-height: calc(100vh - 60px);
  background-color: var(--surface-50);
}
</style>
