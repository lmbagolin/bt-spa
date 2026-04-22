<template>
  <q-page class="q-pa-lg">
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="!arena" class="row justify-center q-pa-xl">
      <q-card class="bg-red-1 text-red-9 q-pa-md rounded-borders"> Arena não encontrada. </q-card>
    </div>

    <div v-else class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <!-- Header Card -->
        <q-card class="rounded-borders-15 shadow-5 overflow-hidden q-mb-xl">
          <div class="header-bg bg-primary relative-position">
            <div class="absolute-full flex flex-center">
              <div class="arena-brand-container text-center text-white">
                <q-avatar size="140px" rounded class="shadow-avatar bg-white q-mb-md">
                  <img v-if="arena.logo_url" :src="arena.logo_url" />
                  <q-icon v-else name="sports_tennis" color="grey-4" size="80px" />
                </q-avatar>
                <h2 class="text-h3 text-bold q-my-none">{{ arena.name }}</h2>
                <div class="text-h6 opacity-70">{{ arena.city }}</div>
              </div>
            </div>
          </div>

          <q-card-section class="q-pa-xl">
            <div class="row q-col-gutter-xl">
              <div class="col-12 col-md-7">
                <h3 class="text-h5 text-bold q-mb-md">Sobre a Arena</h3>
                <p class="text-body1 text-grey-8 line-height-18">
                  Bem-vindo à {{ arena.name }}! Aqui você encontra um ambiente premium para a
                  prática de Beach Tennis em {{ arena.city }}. Junte-se à nossa comunidade para
                  participar de torneios exclusivos, rankings semanais e muito mais.
                </p>
                <div class="row q-gutter-md q-mt-lg">
                  <q-chip outline color="primary" icon="emoji_events">Torneios Ativos</q-chip>
                  <q-chip outline color="secondary" icon="people">Comunidade Vibrante</q-chip>
                  <q-chip outline color="orange-8" icon="star">Níveis de Iniciante a Pro</q-chip>
                </div>
              </div>

              <!-- Registration Card -->
              <div class="col-12 col-md-5">
                <q-card bordered class="rounded-borders-12 q-pa-lg text-center registration-card">
                  <!-- Already registered -->
                  <template v-if="isRegistered">
                    <q-icon name="check_circle" color="positive" size="56px" />
                    <div class="text-h6 text-bold text-positive q-mt-sm q-mb-xs">
                      Você já é jogador desta arena!
                    </div>
                    <div class="text-caption text-grey-7 q-mb-lg">
                      Participe dos torneios e rankings disponíveis.
                    </div>

                    <!-- Player info summary -->
                    <div
                      v-if="currentPlayerProfile"
                      class="player-profile-summary q-mb-md text-left"
                    >
                      <div class="row items-center q-gutter-xs q-mb-xs">
                        <q-icon name="person" color="grey-6" size="14px" />
                        <span class="text-caption text-grey-8">{{
                          currentPlayerProfile.nickname || currentPlayerProfile.name
                        }}</span>
                      </div>
                      <div
                        class="row items-center q-gutter-xs q-mb-xs"
                        v-if="currentPlayerProfile.level"
                      >
                        <q-icon name="bar_chart" color="grey-6" size="14px" />
                        <span class="text-caption text-grey-8">{{
                          levelLabel(currentPlayerProfile.level)
                        }}</span>
                      </div>
                      <div class="row items-center q-gutter-xs" v-if="currentPlayerProfile.city">
                        <q-icon name="location_on" color="grey-6" size="14px" />
                        <span class="text-caption text-grey-8">{{
                          currentPlayerProfile.city
                        }}</span>
                      </div>
                    </div>

                    <q-btn
                      unelevated
                      color="primary"
                      label="Editar meu Perfil"
                      icon="edit"
                      class="full-width q-mb-sm"
                      @click="openEditModal"
                    />
                    <q-btn
                      flat
                      color="grey-7"
                      label="Voltar para Arenas"
                      icon="arrow_back"
                      class="full-width"
                      @click="router.push('/discover')"
                    />
                  </template>

                  <!-- Not registered yet -->
                  <template v-else>
                    <q-icon name="sports_tennis" color="primary" size="48px" class="q-mb-sm" />
                    <div class="text-h6 text-bold q-mb-xs">Quer jogar aqui?</div>
                    <div class="text-caption text-grey-7 q-mb-lg">
                      Registre-se como jogador para participar de torneios e do ranking desta arena.
                    </div>
                    <q-btn
                      label="Registrar-se como Jogador"
                      color="primary"
                      unelevated
                      class="full-width text-bold"
                      size="lg"
                      @click="openRegisterModal"
                    />
                  </template>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Stats Section -->
        <div class="row q-col-gutter-lg q-mb-xl">
          <div class="col-12 col-sm-4">
            <q-card class="rounded-borders text-center q-pa-lg bg-teal-1">
              <div class="text-h4 text-bold text-teal-9">--</div>
              <div class="text-caption text-grey-8">Jogadores</div>
            </q-card>
          </div>
          <div class="col-12 col-sm-4">
            <q-card class="rounded-borders text-center q-pa-lg bg-indigo-1">
              <div class="text-h4 text-bold text-indigo-9">--</div>
              <div class="text-caption text-grey-8">Torneios</div>
            </q-card>
          </div>
          <div class="col-12 col-sm-4">
            <q-card class="rounded-borders text-center q-pa-lg bg-orange-1">
              <div class="text-h4 text-bold text-orange-9">--</div>
              <div class="text-caption text-grey-8">Rankings</div>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Registration Modal -->
    <q-dialog v-model="registerModal" persistent>
      <q-card style="min-width: 400px; max-width: 520px" class="rounded-borders-15">
        <q-card-section class="q-pa-lg">
          <div class="row items-center no-wrap q-mb-md">
            <q-avatar
              color="primary"
              text-color="white"
              :icon="editMode ? 'edit' : 'sports_tennis'"
              size="48px"
              class="q-mr-md"
            />
            <div>
              <div class="text-h6 text-bold">
                {{ editMode ? 'Editar Perfil de Jogador' : 'Registrar-se como Jogador' }}
              </div>
              <div class="text-caption text-grey-7">{{ arena?.name }}</div>
            </div>
            <q-space />
            <q-btn flat round dense icon="close" @click="registerModal = false" />
          </div>
          <q-separator class="q-mb-lg" />

          <q-form @submit="editMode ? onSubmitEdit() : onSubmitRegister()" class="q-gutter-md">
            <q-input
              v-model="playerForm.name"
              label="Nome completo *"
              outlined
              dense
              :rules="[(val) => !!val || 'Nome é obrigatório']"
            />

            <q-input v-model="playerForm.nickname" label="Apelido (opcional)" outlined dense />

            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-select
                  v-model="playerForm.gender"
                  :options="genderOptions"
                  label="Gênero"
                  outlined
                  dense
                  emit-value
                  map-options
                  clearable
                />
              </div>
              <div class="col-6">
                <q-select
                  v-model="playerForm.level"
                  :options="levelOptions"
                  label="Nível"
                  outlined
                  dense
                  emit-value
                  map-options
                  clearable
                />
              </div>
            </div>

            <q-input v-model="playerForm.city" label="Cidade" outlined dense />

            <div class="row justify-end q-gutter-sm q-mt-sm">
              <q-btn flat label="Cancelar" color="grey-7" @click="registerModal = false" />
              <q-btn
                type="submit"
                :label="editMode ? 'Salvar Alterações' : 'Confirmar Registro'"
                color="primary"
                unelevated
                class="text-bold q-px-xl"
                :loading="submitting"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useArenaStore } from 'src/stores/arena';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const arenaStore = useArenaStore();
const authStore = useAuthStore();

const arena = ref(null);
const loading = ref(true);
const submitting = ref(false);
const registerModal = ref(false);
const editMode = ref(false);
const currentPlayerProfile = ref(null);
const arenaId = route.params.id;

const playerForm = reactive({
  name: '',
  nickname: '',
  gender: null,
  level: null,
  city: '',
});

const genderOptions = [
  { label: 'Masculino', value: 'male' },
  { label: 'Feminino', value: 'female' },
  { label: 'Outro', value: 'other' },
];

const levelOptions = [
  { label: 'Iniciante', value: 'beginner' },
  { label: 'Intermediário', value: 'intermediate' },
  { label: 'Avançado', value: 'advanced' },
  { label: 'Profissional', value: 'professional' },
];

const isRegistered = computed(() => arenaStore.myRegistrations.some((a) => a.id == arenaId));

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      arenaStore.publicArenas.length === 0 ? arenaStore.fetchPublicArenas() : Promise.resolve(),
      arenaStore.fetchMyRegistrations(),
    ]);
    arena.value = arenaStore.publicArenas.find((a) => a.id == arenaId);

    // If registered, also fetch current player profile
    if (arenaStore.myRegistrations.some((a) => a.id == arenaId)) {
      await fetchCurrentPlayerProfile();
    }
  } catch (error) {
    console.error('Error loading arena detail:', error);
  } finally {
    loading.value = false;
  }
});

async function fetchCurrentPlayerProfile() {
  try {
    const { api } = await import('boot/axios');
    const response = await api.get(`/arenas/${arenaId}/my-player`);
    currentPlayerProfile.value = response.data.data ?? response.data;
  } catch {
    // Profile not found or API not ready yet
    currentPlayerProfile.value = null;
  }
}

function openRegisterModal() {
  editMode.value = false;
  playerForm.name = authStore.user?.name || '';
  playerForm.nickname = '';
  playerForm.gender = null;
  playerForm.level = null;
  playerForm.city = '';
  registerModal.value = true;
}

function openEditModal() {
  editMode.value = true;
  const p = currentPlayerProfile.value;
  playerForm.name = p?.name || authStore.user?.name || '';
  playerForm.nickname = p?.nickname || '';
  playerForm.gender = p?.gender || null;
  playerForm.level = p?.level || null;
  playerForm.city = p?.city || '';
  registerModal.value = true;
}

function levelLabel(value) {
  return levelOptions.find((o) => o.value === value)?.label || value;
}

async function onSubmitRegister() {
  submitting.value = true;
  try {
    await arenaStore.registerAsPlayer(arenaId, {
      name: playerForm.name,
      nickname: playerForm.nickname || undefined,
      gender: playerForm.gender || undefined,
      level: playerForm.level || undefined,
      city: playerForm.city || undefined,
    });
    registerModal.value = false;
    await fetchCurrentPlayerProfile();
    $q.notify({
      type: 'positive',
      message: 'Registrado com sucesso! Agora você faz parte desta arena.',
      position: 'top',
      icon: 'check_circle',
    });
  } catch (error) {
    const message = error.response?.data?.message || 'Erro ao registrar-se.';
    $q.notify({ type: 'negative', message });
  } finally {
    submitting.value = false;
  }
}

async function onSubmitEdit() {
  submitting.value = true;
  try {
    const { api } = await import('boot/axios');
    const response = await api.put(`/arenas/${arenaId}/my-player`, {
      name: playerForm.name,
      nickname: playerForm.nickname || undefined,
      gender: playerForm.gender || undefined,
      level: playerForm.level || undefined,
      city: playerForm.city || undefined,
    });
    currentPlayerProfile.value = response.data.data ?? response.data;
    registerModal.value = false;
    $q.notify({
      type: 'positive',
      message: 'Perfil atualizado com sucesso!',
      position: 'top',
      icon: 'check_circle',
    });
  } catch (error) {
    const message = error.response?.data?.message || 'Erro ao atualizar perfil.';
    $q.notify({ type: 'negative', message });
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.header-bg {
  height: 350px;
  background: linear-gradient(135deg, var(--q-primary) 0%, #1976d2 100%);
}

.opacity-70 {
  opacity: 0.7;
}

.rounded-borders-15 {
  border-radius: 15px;
}
.rounded-borders-12 {
  border-radius: 12px;
}

.arena-brand-container {
  z-index: 1;
}

.shadow-avatar {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
}

.line-height-18 {
  line-height: 1.8;
}

.registration-card {
  background: #f8f9fa;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.player-profile-summary {
  background: white;
  border-radius: 8px;
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
}
</style>
