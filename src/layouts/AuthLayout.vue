<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="row no-wrap items-stretch">
        <!-- Coluna decorativa (Visível apenas em Desktop md+) -->
        <div class="col-12 col-md-5 auth-side-panel gt-sm flex flex-center text-white relative-position overflow-hidden">
          <div class="content text-center z-top q-pa-xl">
            <q-icon name="sports_tennis" size="120px" class="opacity-90" />
            <div class="text-h3 text-bold q-mt-md">Beach Tennis</div>
            <div class="text-subtitle1 opacity-70 q-mt-sm">Gerencie sua arena com eficiência e estilo.</div>
          </div>
          <!-- Elementos decorativos de fundo -->
          <div class="deco-circle-1"></div>
          <div class="deco-circle-2"></div>
          <div class="deco-dots"></div>
        </div>

        <!-- Coluna de Formulário -->
        <div class="col-12 col-md-7 flex flex-center" style="background-color: var(--main-bg)">
          <div class="full-width q-pa-md bt-form-container">
            <router-view />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>

<style scoped lang="scss">
.auth-side-panel {
  background: linear-gradient(160deg, #0f172a 0%, #1976d2 100%);
  min-height: 100vh;
  padding: 24px;

  @media (max-width: 600px) {
    display: none;
  }
}

.opacity-70 {
  opacity: 0.7;
}

.opacity-90 {
  opacity: 0.9;
}

.deco-circle-1 {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  top: -100px;
  left: -100px;
}

.deco-circle-2 {
  position: absolute;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  bottom: -50px;
  right: -50px;
}

.deco-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.3;
}

.z-top {
  z-index: 10;
}

.bt-form-container {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
