<template>
  <div class="sidebar-container column full-height">
    <!-- Sidebar Header -->
    <div class="sidebar-header q-pa-lg flex flex-center">
      <img src="~assets/logo-white.png" alt="Pontua" class="sidebar-logo" />
    </div>

    <q-separator style="background-color: var(--sidebar-hover)" />

    <!-- Player Section Navigation -->
    <q-list padding class="q-mt-md">
      <q-item-label
        header
        class="text-xs text-bold text-uppercase"
        style="color: var(--sidebar-text)"
      >
        Área do Jogador
      </q-item-label>

      <q-item clickable v-ripple to="/" exact class="nav-item q-mb-xs" active-class="nav-active">
        <q-item-section avatar>
          <q-icon name="explore" size="22px" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">Descobrir</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        to="/leagues"
        exact
        class="nav-item q-mb-xs"
        active-class="nav-active"
      >
        <q-item-section avatar>
          <q-icon name="emoji_events" size="22px" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">Ligas & Torneios</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        to="/profile"
        exact
        class="nav-item q-mb-xs"
        active-class="nav-active"
      >
        <q-item-section avatar>
          <q-icon name="person" size="22px" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">Meu Perfil</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator style="background-color: var(--sidebar-hover); margin: 0 24px" />

    <!-- Admin Section Navigation -->
    <q-list padding class="q-mt-md">
      <q-item-label
        header
        class="text-xs text-bold text-uppercase"
        style="color: var(--sidebar-text)"
      >
        Gerenciador de Arenas
      </q-item-label>

      <q-item
        clickable
        v-ripple
        to="/arenas"
        exact
        class="nav-item q-mb-xs"
        active-class="nav-active"
      >
        <q-item-section avatar>
          <q-icon name="stadium" size="22px" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">Minhas Arenas</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-space />

    <!-- Footer -->
    <div class="sidebar-footer">
      <q-separator style="background-color: var(--sidebar-hover); margin: 0 0 16px 0" />
      <div class="text-center text-xs" style="color: var(--sidebar-text)">
        © 2026 Pontua
      </div>
    </div>
  </div>
</template>

<script setup>
// Componente de navegação lateral para o MainLayout
</script>

<style scoped lang="scss">
.sidebar-container {
  background-color: var(--sidebar-bg);
  color: var(--sidebar-text);
}

.sidebar-header {
  border-bottom: 1px solid var(--sidebar-hover);
  padding: 20px 24px !important;
}

.sidebar-logo {
  height: 44px;
  width: auto;
}

.sidebar-footer {
  padding: 16px;
}

.nav-item {
  color: var(--sidebar-text);
  padding: 10px 16px;
  margin: 4px 8px;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--sidebar-hover);
    color: var(--sidebar-text-hover);

    :deep(.q-icon) {
      color: var(--sidebar-text-hover);
    }
  }

  &.nav-active {
    background-color: var(--sidebar-active);
    color: #ffffff;

    :deep(.q-icon) {
      color: #ffffff;
    }
  }
}

.leading-none {
  line-height: 1;
}
</style>
