<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-xl">
      <div class="col">
        <h1 class="text-h4 text-bold text-primary q-my-none">Explorar Arenas</h1>
        <div class="text-subtitle1 text-grey-7">Encontre o lugar perfeito para o seu próximo jogo</div>
      </div>
    </div>

    <!-- Search Section -->
    <q-card class="q-mb-xl rounded-borders shadow-2">
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-5">
            <q-input
              v-model="filters.name"
              placeholder="Nome da arena..."
              outlined
              dense
              bg-color="white"
              @keyup.enter="onSearch"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="grey-6" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-5">
            <q-input
              v-model="filters.city"
              placeholder="Cidade..."
              outlined
              dense
              bg-color="white"
              @keyup.enter="onSearch"
            >
              <template v-slot:prepend>
                <q-icon name="location_on" color="grey-6" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-2">
            <q-btn
              label="Buscar"
              color="primary"
              unelevated
              class="full-width text-bold q-py-sm"
              @click="onSearch"
              :loading="loading"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Arenas Grid -->
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="arenaStore.publicArenas.length === 0" class="row justify-center q-pa-xl text-center">
      <div class="col-12 text-grey-6">
        <q-icon name="search_off" size="64px" class="q-mb-md" />
        <div class="text-h6">Nenhuma arena encontrada</div>
        <div>Tente ajustar seus filtros de busca.</div>
      </div>
    </div>

    <div v-else class="row q-col-gutter-lg">
      <div
        v-for="arena in arenaStore.publicArenas"
        :key="arena.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="arena-card rounded-borders shadow-3 full-height cursor-pointer" @click="viewArena(arena.id)">
          <div class="arena-image-container relative-position">
            <q-img
              v-if="arena.logo_url"
              :src="arena.logo_url"
              class="arena-image"
              ratio="16/9"
            />
            <div v-else class="arena-placeholder bg-grey-2 flex flex-center">
              <q-icon name="sports_tennis" size="64px" color="grey-4" />
            </div>
          </div>

          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="col text-h6 text-bold text-grey-9 truncate">{{ arena.name }}</div>
            </div>
            <div class="row items-center text-grey-7 q-mt-xs">
              <q-icon name="location_on" size="14px" class="q-mr-xs" />
              <div class="text-caption">{{ arena.city }}</div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn
              label="Ver Arena"
              color="secondary"
              outline
              class="text-bold full-width"
              @click.stop="viewArena(arena.id)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useArenaStore } from 'src/stores/arena'
import { useRouter } from 'vue-router'

const arenaStore = useArenaStore()
const router = useRouter()
const loading = ref(false)

const filters = reactive({
  name: '',
  city: '',
})

onMounted(async () => {
  await onSearch()
})

async function onSearch() {
  loading.value = true
  try {
    await arenaStore.fetchPublicArenas(filters)
  } finally {
    loading.value = false
  }
}

function viewArena(id) {
  router.push({ name: 'arena-public', params: { id } })
}
</script>

<style scoped>
.arena-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.arena-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
}

.arena-image-container {
  height: 180px;
  overflow: hidden;
}

.arena-image {
  height: 100%;
}

.arena-placeholder {
  height: 180px;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
