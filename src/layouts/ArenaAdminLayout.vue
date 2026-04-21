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
          <span class="text-subtitle2 text-secondary gt-sm">{{ arenaStore.currentArena?.name }}</span>
        </div>

        <q-space />

        <!-- Right Section - Notifications & User -->
        <div class="row items-center q-gutter-md">
          <q-btn flat round dense icon="notifications" color="text-secondary">
            <q-badge color="red" floating size="xs">2</q-badge>
          </q-btn>

          <div class="row items-center q-gutter-sm q-pl-md" style="border-left: 1px solid var(--card-border)">
            <div class="column items-end gt-xs">
              <span class="text-caption text-bold text-primary leading-none">{{ authStore.user?.name }}</span>
              <span class="text-xs text-secondary">Administrador</span>
            </div>
            <q-avatar size="36px" color="primary" text-color="white">
              {{ authStore.user?.name.charAt(0).toUpperCase() || 'U' }}
            </q-avatar>
            <q-btn flat round dense icon="logout" color="text-secondary" @click="onLogout" class="q-ml-sm" />
          </div>
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
      <!-- Sidebar Header - Arena Logo -->
      <div class="sidebar-header q-pa-lg row items-center no-wrap">
        <q-avatar size="40px" color="primary" text-color="white">
          <img v-if="arenaStore.currentArena?.logo_url" :src="arenaStore.currentArena.logo_url" />
          <q-icon v-else name="sports_tennis" size="24px" />
        </q-avatar>
        <div class="column q-ml-md">
          <span class="text-sm text-bold text-white leading-none truncate" style="max-width: 140px">
            {{ arenaStore.currentArena?.name }}
          </span>
          <span class="text-xs" style="color: var(--sidebar-text)">Manager</span>
        </div>
      </div>

      <q-separator style="background-color: var(--sidebar-hover); margin: 0 24px" />

      <!-- Navigation Menu -->
      <q-list class="col q-px-md q-mt-md">
        <q-item-label header class="text-xs text-bold text-uppercase" style="color: var(--sidebar-text)">
          Menu Principal
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

      <!-- Sidebar Footer -->
      <div class="q-pa-md">
        <q-separator style="background-color: var(--sidebar-hover); margin: 0 0 16px 0" />
        <q-btn
          flat
          icon="arrow_back"
          label="Minhas Arenas"
          class="full-width no-caps text-bold sidebar-footer-btn"
          style="color: var(--sidebar-text)"
          @click="$router.push('/arenas')"
        />
      </div>
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

<style scoped lang="scss">
.sidebar-header {
  border-bottom: 1px solid var(--sidebar-hover);
}

.nav-item {
  border-radius: var(--radius-md);
  color: var(--sidebar-text);
  padding: 10px 16px;
  transition: all 0.2s ease;
  margin-left: 8px;
  margin-right: 8px;

  &:hover {
    background-color: var(--sidebar-hover);
    color: var(--sidebar-text-hover);
  }

  &.nav-active {
    background-color: var(--sidebar-active);
    color: #ffffff;

    :deep(.q-icon) {
      color: #ffffff;
    }
  }
}

.sidebar-footer-btn {
  border-radius: var(--radius-md);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--sidebar-hover);
    color: var(--sidebar-text-hover) !important;
  }
}

.leading-none {
  line-height: 1;
}
</style>
