<template>
  <div class="column full-height bg-surface-800">
    <!-- Dashboard / Home Info -->
    <div class="q-pa-lg flex items-center no-wrap">
      <q-avatar size="40px" class="bg-blue-500 shadow-sm">
        <q-icon name="home" color="white" size="24px" />
      </q-avatar>
      <div class="column q-ml-md">
        <span class="text-sm text-bold text-white leading-none">Início</span>
        <span class="text-xs text-surface-400">Beach Tennis Tournaments</span>
      </div>
    </div>

    <q-separator color="white" dark opacity="0.05" />

    <!-- Navigation -->
    <q-list padding class="q-mt-md">
      <q-item-label
        class="text-xs text-bold text-surface-500 q-mb-sm tracking-widest text-uppercase q-px-md"
      >
        ÁREA DO JOGADOR
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
        to="/profile"
        exact
        class="nav-item q-mb-xs"
        active-class="nav-active"
      >
        <q-item-section avatar>
          <q-icon name="person" size="22px" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">Área do Jogador</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator color="white" dark opacity="0.05" />

    <!-- Navigation -->
    <q-list padding class="q-mt-md">
      <q-item-label
        class="text-xs text-bold text-surface-500 q-mb-sm tracking-widest text-uppercase q-px-md"
      >
        ADMINISTRADOR DE ARENAS
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
          <q-icon name="sports_tennis" size="22px" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">Minhas Arenas</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-space />

    <!-- Footer discreto -->
    <div class="q-mt-auto">
      <q-separator color="white" dark opacity="0.05" class="q-mb-md" />

      <div class="q-pa-md">
        <div class="text-center text-surface-500 text-xs">© 2026 Beach Tennis Manager</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Componente de navegação lateral para o MainLayout
</script>

<style scoped>
.nav-item {
  color: var(--surface-400);
  padding: 10px 16px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: var(--sidebar-hover);
  color: white;
}

.nav-active {
  background-color: var(--sidebar-active-bg) !important;
  color: var(--sidebar-active-text) !important;
}

.nav-active i {
  color: var(--sidebar-active-text) !important;
}

.leading-none {
  line-height: 1;
}

.bg-blue-500 {
  background-color: #0ea5e9;
}
</style>
