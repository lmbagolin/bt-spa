<template>
  <q-page class="q-pa-lg">
    <div class="row q-col-gutter-lg justify-center">
      <div class="col-12 col-md-10">
        <!-- Header Section -->
        <div class="row items-center q-mb-xl">
          <div class="col">
            <h1 class="text-2xl text-bold q-my-none text-surface-900">Minhas Arenas</h1>
            <div class="text-sm text-surface-500">Gerencie suas unidades de Beach Tennis</div>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="add"
              label="Nova Arena"
              unelevated
              class="q-px-md"
              @click="openForm()"
            />
          </div>
        </div>

        <!-- Content Area -->
        <q-inner-loading :showing="arenaStore.loading">
          <q-spinner-tail size="50px" color="primary" />
        </q-inner-loading>

        <div v-if="!arenaStore.loading">
          <div v-if="arenaStore.arenas.length > 0" class="row q-col-gutter-md">
            <div v-for="arena in arenaStore.arenas" :key="arena.id" class="col-12 col-sm-6 col-lg-4">
              <q-card class="arena-card transition-all overflow-hidden full-height flex column">
                <q-card-section class="q-pa-lg col">
                  <div class="row items-center no-wrap">
                    <q-avatar v-if="arena.logo_url" size="56px" rounded class="q-mr-md shadow-sm bg-white">
                      <img :src="arena.logo_url">
                    </q-avatar>
                    <div v-else class="q-mr-md bg-surface-100 flex flex-center rounded-borders" style="width: 56px; height: 56px">
                      <q-icon name="sports_tennis" size="md" color="surface-400" />
                    </div>
                    <div class="col overflow-hidden">
                      <div class="text-lg text-bold text-surface-900 ellipsis">{{ arena.name }}</div>
                      <div class="text-sm text-surface-500 flex items-center ellipsis">
                        <q-icon name="location_on" color="primary" size="14px" class="q-mr-xs" />
                        {{ arena.city || 'Cidade não informada' }}
                      </div>
                    </div>
                  </div>
                </q-card-section>

                <q-card-actions align="right" class="q-pa-md bg-surface-50 border-top-surface-100">
                  <q-btn
                    flat
                    round
                    dense
                    color="negative"
                    icon="delete"
                    class="q-mr-sm"
                    @click="confirmDelete(arena)"
                  >
                    <q-tooltip>Excluir</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    label="Editar"
                    color="primary"
                    icon="edit"
                    class="q-mr-sm"
                    @click="openForm(arena)"
                  />
                  <q-btn
                    label="Gerenciar"
                    color="primary"
                    icon="dashboard"
                    unelevated
                    class="q-px-md"
                    @click="manageArena(arena)"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </div>

          <!-- State: No Arenas -->
          <q-card v-else class="empty-card q-pa-xl text-center border-dashed bg-surface-50">
            <q-card-section>
              <q-icon name="add_business" size="80px" class="text-surface-300" />
              <div class="text-xl text-bold q-mt-md text-surface-900">Nenhuma arena cadastrada</div>
              <p class="text-sm text-surface-500 q-mb-xl">
                Cadastre sua primeira unidade para começar a gerenciar seus torneios.
              </p>
              <q-btn
                color="primary"
                label="Cadastrar Primeira Arena"
                icon="add"
                unelevated
                class="q-px-lg"
                @click="openForm()"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Form Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 480px; max-width: 90vw; border-radius: var(--radius-xl)">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="add_business" color="primary" text-white size="40px" class="q-mr-md" />
          <div class="text-xl text-bold text-surface-900">{{ editingId ? 'Editar Arena' : 'Nova Arena' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="text-surface-400" />
        </q-card-section>

        <q-separator class="q-mt-md" />

        <q-form @submit="onSubmit">
          <q-card-section class="q-gutter-y-md q-pa-lg">
            <q-input
              v-model="form.name"
              label="Nome da Arena"
              outlined
              :rules="[val => !!val || 'Nome é obrigatório']"
            />
            <q-input
              v-model="form.city"
              label="Cidade"
              outlined
            />
            
            <div class="row items-center q-gutter-md">
              <q-avatar size="80px" rounded class="bg-surface-100 shadow-sm overflow-hidden">
                <img v-if="logoPreview" :src="logoPreview">
                <q-icon v-else name="image" color="surface-400" />
              </q-avatar>
              
              <div class="col">
                <q-file
                  v-model="form.logo"
                  label="Logo da Arena"
                  outlined
                  dense
                  accept="image/*"
                  @update:model-value="onLogoChange"
                >
                  <template v-slot:prepend>
                    <q-icon name="cloud_upload" />
                  </template>
                </q-file>
                <div class="text-caption text-surface-400 q-mt-xs">
                  JPG ou PNG. Máximo 2MB.
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-lg">
            <q-btn flat label="Cancelar" color="surface-500" v-close-popup />
            <q-btn
              label="Salvar"
              type="submit"
              color="primary"
              unelevated
              class="q-px-xl"
              :loading="submitting"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useArenaStore } from 'src/stores/arena'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const arenaStore = useArenaStore()
const $q = useQuasar()
const router = useRouter()

const showDialog = ref(false)
const submitting = ref(false)
const editingId = ref(null)

const form = reactive({
  name: '',
  city: '',
  logo: null
})

const logoPreview = ref(null)

function onLogoChange(file) {
  if (file) {
    logoPreview.value = URL.createObjectURL(file)
  } else {
    logoPreview.value = null
  }
}

onMounted(() => {
  arenaStore.fetchArenas()
})

function manageArena(arena) {
  arenaStore.setCurrentArena(arena)
  router.push(`/admin/arena/${arena.id}/dashboard`)
}

function openForm(arena = null) {
  if (arena) {
    editingId.value = arena.id
    form.name = arena.name
    form.city = arena.city
    form.logo = null
    logoPreview.value = arena.logo_url
  } else {
    editingId.value = null
    form.name = ''
    form.city = ''
    form.logo = null
    logoPreview.value = null
  }
  showDialog.value = true
}

async function onSubmit() {
  submitting.value = true
  try {
    await arenaStore.saveArena({ id: editingId.value, ...form })
    $q.notify({
      type: 'positive',
      message: editingId.value ? 'Arena atualizada com sucesso!' : 'Arena cadastrada com sucesso!',
      position: 'top',
      icon: 'check_circle'
    })
    showDialog.value = false
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar informações.',
      position: 'top',
      icon: 'error'
    })
  } finally {
    submitting.value = false
  }
}

function confirmDelete(arena) {
  $q.dialog({
    title: 'Excluir Arena',
    message: `Deseja realmente excluir a arena "${arena.name}"? Esta ação é irreversível.`,
    cancel: {
      flat: true,
      color: 'surface-500',
      label: 'Cancelar'
    },
    ok: {
      color: 'negative',
      label: 'Sim, Excluir',
      unelevated: true
    },
    persistent: true
  }).onOk(async () => {
    try {
      await arenaStore.deleteArena(arena.id)
      $q.notify({
        type: 'positive',
        message: 'Arena excluída com sucesso.',
        icon: 'check_circle'
      })
    } catch {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir arena.',
        icon: 'error'
      })
    }
  })
}
</script>

<style scoped>
.arena-card {
  border-top: 3px solid var(--q-primary);
  box-shadow: var(--shadow-card);
  transition: all 0.2s ease-in-out;
}

.arena-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.empty-card {
  border: 2px dashed var(--surface-200);
  background-color: var(--surface-50);
}

.border-top-surface-100 {
  border-top: 1px solid var(--surface-100);
}
</style>
