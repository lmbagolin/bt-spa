<template>
  <q-page class="q-pa-lg">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h1 class="text-h4 text-bold q-mb-lg text-primary">Configurações da Arena</h1>

        <q-card class="rounded-borders-15 shadow-2">
          <q-card-section class="q-pa-lg">
            <div class="text-h6 text-bold text-grey-8 q-mb-md">Informações Básicas</div>

            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="form.name"
                label="Nome da Arena"
                outlined
                dense
                :rules="[(val) => !!val || 'O nome é obrigatório']"
              />

              <q-input v-model="form.city" label="Cidade" outlined dense />

              <div class="text-subtitle2 text-grey-7 q-mt-lg">Branding & Logo</div>
              <q-separator class="q-mb-md" />

              <div class="row q-col-gutter-md items-center">
                <div class="col-auto">
                  <q-avatar size="100px" rounded class="shadow-2 bg-grey-2">
                    <img v-if="logoPreview" :src="logoPreview" />
                    <q-icon v-else name="image" color="grey-4" size="64px" />
                  </q-avatar>
                </div>
                <div class="col">
                  <q-file
                    v-model="form.logo"
                    label="Alterar Logo (JPG, PNG - Máx 2MB)"
                    outlined
                    dense
                    accept=".jpg,.png,image/jpeg,image/png"
                    max-file-size="2097152"
                    @update:model-value="onLogoChange"
                    @rejected="onRejected"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" />
                    </template>
                  </q-file>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    Formatos aceitos: JPG e PNG. Tamanho máximo: 2MB.
                  </div>
                </div>
              </div>

              <div class="row justify-end q-mt-xl">
                <q-btn
                  label="Salvar Alterações"
                  type="submit"
                  color="primary"
                    unelevated
                  class="q-px-xl q-py-sm text-bold"
                  :loading="submitting"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useArenaStore } from 'src/stores/arena'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const arenaStore = useArenaStore()

const submitting = ref(false)
const logoPreview = ref(null)

const form = reactive({
  name: '',
  city: '',
  logo: null,
})

watch(() => arenaStore.currentArena, (newArena) => {
  if (newArena) {
    loadArenaData(newArena)
  }
}, { immediate: true })

function loadArenaData(arena) {
  form.name = arena.name
  form.city = arena.city
  logoPreview.value = arena.logo_url
}

function onLogoChange(file) {
  if (file) {
    logoPreview.value = URL.createObjectURL(file)
  } else {
    logoPreview.value = arenaStore.currentArena?.logo_url || null
  }
}

function onRejected(entries) {
  if (entries.length > 0) {
    const entry = entries[0]
    if (entry.failedPropValidation === 'max-file-size') {
      $q.notify({
        type: 'negative',
        message: 'O arquivo é muito grande. O limite é 2MB.',
      })
    } else if (entry.failedPropValidation === 'accept') {
      $q.notify({
        type: 'negative',
        message: 'Formato inválido. Use apenas JPG ou PNG.',
      })
    }
  }
}

async function onSubmit() {
  submitting.value = true
  try {
    const payload = {
      id: arenaStore.currentArena.id,
      name: form.name,
      city: form.city,
    }

    if (form.logo) {
      payload.logo = form.logo
    }

    const updatedArena = await arenaStore.saveArena(payload)
    arenaStore.setCurrentArena(updatedArena)

    $q.notify({
      type: 'positive',
      message: 'Configurações atualizadas com sucesso!',
      position: 'top',
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar configurações.',
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.rounded-borders-15 {
  border-radius: 15px;
}
</style>
