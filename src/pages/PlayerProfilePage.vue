<template>
  <q-page class="q-pa-lg">
    <div class="row q-col-gutter-lg justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <!-- Title & Subtitle -->
        <div class="q-mb-xl">
          <h1 class="text-h4 text-bold text-surface-900 q-my-none">Minha Área</h1>
          <p class="text-subtitle1 text-surface-500">
            Gerencie seu perfil de jogador e visualize suas arenas.
          </p>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- Profile Form Column -->
          <div class="col-12 col-md-6">
            <q-card class="shadow-md rounded-borders-15 overflow-hidden">
              <q-card-section class="bg-blue-grey-1 text-surface-900 q-pa-lg">
                <div class="row items-center">
                  <q-avatar
                    size="120px"
                    color="primary"
                    text-color="white"
                    class="shadow-sm cursor-pointer hover-zoom"
                    @click="imageModal = true"
                  >
                    <q-tooltip>Clique para alterar a foto</q-tooltip>
                    <img
                      v-if="playerStore.currentPlayer?.image_url"
                      :src="playerStore.currentPlayer.image_url"
                    />
                    <template v-else>
                      {{ authStore.user?.name.charAt(0).toUpperCase() }}
                    </template>
                  </q-avatar>
                  <div class="q-ml-md">
                    <div class="text-h6 text-bold">{{ authStore.user?.name }}</div>
                    <div class="text-caption opacity-70">{{ authStore.user?.email }}</div>
                  </div>
                </div>
              </q-card-section>

              <q-card-section class="q-pa-xl">
                <q-form @submit="onUpdateProfile">
                  <div class="text-subtitle2 text-primary text-uppercase tracking-widest q-mb-sm">
                    Dados do Jogador
                  </div>

                  <div class="row q-col-gutter-md">
                    <div class="col-12">
                      <q-input
                        v-model="profileForm.name"
                        label="Nome *"
                        outlined
                        dense
                        bg-color="white"
                        :rules="[(val) => !!val || 'Nome é obrigatório']"
                      />
                    </div>

                    <div class="col-12">
                      <q-checkbox
                        v-model="profileForm.useSameName"
                        label="Usar o mesmo nome na liga"
                        color="primary"
                        dense
                        class="text-caption"
                      />
                    </div>

                    <div class="col-12">
                      <q-input
                        v-model="profileForm.nickname"
                        label="Nome na Liga"
                        outlined
                        dense
                        bg-color="white"
                        :disable="profileForm.useSameName"
                        :hint="profileForm.useSameName ? 'Mesmo que o nome completo' : ''"
                      />
                    </div>

                    <div class="col-6">
                      <q-select
                        v-model="profileForm.gender"
                        :options="genderOptions"
                        label="Gênero"
                        outlined
                        dense
                        emit-value
                        map-options
                      />
                    </div>
                    <div class="col-6">
                      <q-select
                        v-model="profileForm.level"
                        :options="levelOptions"
                        label="Nível"
                        outlined
                        dense
                        emit-value
                        map-options
                      />
                    </div>

                    <div class="col-12">
                      <q-input v-model="profileForm.city" label="Cidade" outlined dense />
                    </div>
                  </div>

                  <div
                    class="text-subtitle2 text-primary text-uppercase tracking-widest q-mt-lg q-mb-md"
                  >
                    Redes & Contato
                  </div>

                  <div class="q-gutter-md">
                    <q-input
                      v-model="profileForm.instagram"
                      label="Instagram"
                      outlined
                      dense
                      placeholder="@seuusuario"
                    >
                      <template v-slot:prepend>
                        <q-icon name="camera_alt" color="surface-400" />
                      </template>
                    </q-input>

                    <q-input
                      v-model="profileForm.whatsapp"
                      label="WhatsApp / Telefone"
                      outlined
                      dense
                      mask="(##) #####-####"
                      placeholder="(00) 00000-0000"
                    >
                      <template v-slot:prepend>
                        <q-icon name="chat" color="surface-400" />
                      </template>
                    </q-input>
                  </div>

                  <div class="row justify-end q-mt-lg">
                    <q-btn
                      type="submit"
                      color="primary"
                      label="Salvar Perfil"
                      unelevated
                      class="text-bold q-px-xl"
                      :loading="saving"
                    />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </div>

          <!-- Arenas Column -->
          <div class="col-12 col-md-6">
            <q-card class="shadow-md rounded-borders-15 full-height bg-white border-surface-100">
              <q-card-section class="q-pa-lg border-bottom">
                <div class="row items-center">
                  <q-icon name="sports_tennis" color="primary" size="24px" class="q-mr-sm" />
                  <div class="text-h6 text-bold text-surface-900">Minhas Arenas</div>
                </div>
              </q-card-section>

              <q-card-section class="q-pa-none">
                <q-list v-if="playerStore.currentPlayer?.arenas?.length > 0" separator>
                  <q-item
                    v-for="arena in playerStore.currentPlayer.arenas"
                    :key="arena.id"
                    class="q-py-md clickable-item"
                    @click="goToArena(arena.id)"
                  >
                    <q-item-section avatar>
                      <q-avatar size="48px" class="bg-blue-1">
                        <img v-if="arena.logo_url" :src="arena.logo_url" />
                        <q-icon v-else name="stadium" color="primary" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-bold">{{ arena.name }}</q-item-label>
                      <q-item-label caption>{{ arena.city }}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-icon name="chevron_right" color="surface-300" />
                    </q-item-section>
                  </q-item>
                </q-list>

                <div v-else class="column items-center justify-center q-pa-xl text-center">
                  <q-icon name="explore" size="64px" color="surface-100" />
                  <div class="text-surface-400 q-mt-md">
                    Você ainda não está inscrito em nenhuma arena.
                  </div>
                  <q-btn
                    flat
                    color="primary"
                    label="Explorar Arenas"
                    to="/discover"
                    class="q-mt-sm no-caps text-bold"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>

  <!-- Modal de Alteração de Foto -->
  <q-dialog v-model="imageModal" persistent>
    <q-card style="min-width: 350px" class="rounded-borders-15">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Alterar Foto de Perfil</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-lg text-center">
        <q-avatar size="150px" rounded class="shadow-md q-mb-lg bg-surface-50">
          <img v-if="imagePreview" :src="imagePreview" />
          <q-icon v-else name="person" color="surface-200" size="80px" />
        </q-avatar>

        <q-file
          v-model="newImage"
          label="Selecionar nova foto"
          outlined
          dense
          accept=".jpg,.png,image/jpeg,image/png"
          max-file-size="2097152"
          @update:model-value="onImageChange"
          @rejected="onRejected"
          class="q-mb-md"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>

        <p class="text-caption text-grey-6">JPG ou PNG, Máx 2MB</p>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md bg-surface-50">
        <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
        <q-btn
          label="Salvar Nova Foto"
          color="primary"
          unelevated
          :loading="savingImage"
          :disabled="!newImage"
          @click="onUpdateImage"
          class="text-bold px-lg"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { usePlayerStore } from 'src/stores/player'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const playerStore = usePlayerStore()
const $q = useQuasar()
const router = useRouter()

const saving = ref(false)
const savingImage = ref(false)
const imageModal = ref(false)
const imagePreview = ref(null)
const newImage = ref(null)

const profileForm = reactive({
  name: '',
  nickname: '',
  useSameName: true,
  gender: null,
  level: null,
  city: '',
  instagram: '',
  whatsapp: '',
})

// Sincroniza nickname com name se o checkbox estiver marcado
watch(
  () => [profileForm.name, profileForm.useSameName],
  ([newName, useSame]) => {
    if (useSame) {
      profileForm.nickname = newName
    }
  },
)

function onImageChange(file) {
  if (file) {
    imagePreview.value = URL.createObjectURL(file)
  } else {
    imagePreview.value = playerStore.currentPlayer?.image_url || null
  }
}

async function onUpdateImage() {
  if (!newImage.value) return

  savingImage.value = true
  try {
    await playerStore.updateImage(newImage.value)

    imageModal.value = false
    newImage.value = null

    $q.notify({
      type: 'positive',
      message: 'Foto de perfil atualizada!',
      position: 'top',
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao atualizar foto.',
      position: 'top',
    })
  } finally {
    savingImage.value = false
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

const genderOptions = [
  { label: 'Masculino', value: 'male' },
  { label: 'Feminino', value: 'female' },
  { label: 'Outro', value: 'other' },
]

const levelOptions = [
  { label: 'Iniciante', value: 'beginner' },
  { label: 'Intermediário', value: 'intermediate' },
  { label: 'Avançado', value: 'advanced' },
  { label: 'Profissional', value: 'professional' },
]

onMounted(async () => {
  try {
    const profile = await playerStore.fetchProfile()
    if (profile) {
      profileForm.name = profile.name || authStore.user?.name || ''
      profileForm.nickname = profile.nickname || ''
      profileForm.useSameName = !profile.nickname || profile.nickname === profile.name
      profileForm.gender = profile.gender || null
      profileForm.level = profile.level || null
      profileForm.city = profile.city || ''
      profileForm.instagram = profile.instagram || ''
      profileForm.whatsapp = profile.whatsapp || ''
      imagePreview.value = profile.image_url || null
    }
  } catch {
    console.error('Failed to load profile')
  }
})

async function onUpdateProfile() {
  saving.value = true
  try {
    await playerStore.updateProfile({ ...profileForm })
    $q.notify({
      type: 'positive',
      message: 'Perfil atualizado com sucesso!',
      position: 'top',
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao atualizar perfil.',
      position: 'top',
    })
  } finally {
    saving.value = false
  }
}

function goToArena(id) {
  router.push(`/arena/${id}/public`)
}
</script>

<style scoped>
.rounded-borders-15 {
  border-radius: 15px;
}
.tracking-widest {
  letter-spacing: 0.1em;
}
.border-bottom {
  border-bottom: 1px solid var(--surface-100);
}
.clickable-item {
  transition: background 0.2s ease;
  cursor: pointer;
}
.clickable-item:hover {
  background: var(--surface-50);
}
.hover-zoom {
  transition: transform 0.2s ease;
}
.hover-zoom:hover {
  transform: scale(1.05);
}
.cursor-pointer {
  cursor: pointer;
}
</style>
