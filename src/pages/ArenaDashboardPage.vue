<template>
  <q-page class="q-pa-lg">
    <div class="row q-col-gutter-lg">
      <!-- Header Section -->
      <div class="col-12 q-mb-md">
        <div class="row items-center justify-between no-wrap">
          <div>
            <h1 class="text-2xl text-bold text-surface-900 q-my-none">Dashboard</h1>
            <p class="text-sm text-surface-500 q-mt-xs q-mb-none font-medium">
              Visão geral da Arena
              <span class="text-primary">{{ arenaStore.currentArena?.name }}</span>
            </p>
          </div>
          <div>
            <q-btn
              color="indigo-10"
              label="Novo Torneio"
              unelevated
              icon="add"
              class="text-bold no-caps q-px-lg shadow-sm"
              @click="openTournamentForm"
            />
          </div>
        </div>
      </div>

      <!-- Stats Cards Section -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card bg-gradient-blue text-white border-none relative-position">
          <q-card-section class="q-pa-lg">
            <div class="text-xs text-uppercase text-weight-bold opacity-80 q-mb-xs tracking-widest">
              TOTAL TORNEIOS
            </div>
            <div class="text-h4 text-weight-bolder">
              {{ arenaStore.dashboard.total_tournaments }}
            </div>
            <q-icon name="emoji_events" size="64px" class="watermark-icon" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card bg-gradient-purple text-white border-none relative-position">
          <q-card-section class="q-pa-lg">
            <div class="text-xs text-uppercase text-weight-bold opacity-80 q-mb-xs tracking-widest">
              JOGADORES
            </div>
            <div class="text-h4 text-weight-bolder">{{ arenaStore.dashboard.total_players }}</div>
            <q-icon name="people" size="64px" class="watermark-icon" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card bg-gradient-green text-white border-none relative-position">
          <q-card-section class="q-pa-lg">
            <div class="text-xs text-uppercase text-weight-bold opacity-80 q-mb-xs tracking-widest">
              TORNEIOS ATIVOS
            </div>
            <div class="text-h4 text-weight-bolder">
              {{ arenaStore.dashboard.active_tournaments || 1 }}
            </div>
            <q-icon name="play_circle_filled" size="64px" class="watermark-icon" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card bg-gradient-amber text-white border-none relative-position">
          <q-card-section class="q-pa-lg">
            <div class="text-xs text-uppercase text-weight-bold opacity-80 q-mb-xs tracking-widest">
              MENSAGENS
            </div>
            <div class="text-h4 text-weight-bolder">3</div>
            <q-icon name="message" size="64px" class="watermark-icon" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Main Content Grid -->
      <div class="col-12 col-md-8">
        <q-card class="sakai-card-plain full-height overflow-hidden shadow-card">
          <q-card-section class="row items-center q-px-xl q-py-lg">
            <div class="text-lg text-bold text-surface-900">Atividade Recente</div>
            <q-space />
            <q-btn flat dense color="primary" label="Ver todos" no-caps class="text-bold text-sm" />
          </q-card-section>

          <q-separator color="surface-100" />

          <q-card-section class="q-pa-none">
            <q-list
              v-if="
                arenaStore.dashboard.recent_activities &&
                arenaStore.dashboard.recent_activities.length > 0
              "
            >
              <q-item
                v-for="(activity, index) in arenaStore.dashboard.recent_activities"
                :key="index"
                class="q-px-xl q-py-md item-border"
              >
                <q-item-section avatar>
                  <q-avatar
                    :color="getActivityIcon(activity).color"
                    :text-color="getActivityIcon(activity).textColor"
                    :icon="getActivityIcon(activity).icon"
                    size="32px"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-surface-800">{{
                    activity.message
                  }}</q-item-label>
                  <q-item-label caption class="text-surface-400"
                    >há {{ activity.time }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="q-pa-xl text-center py-xl">
              <q-icon name="hourglass_empty" size="80px" color="surface-100" class="q-mb-md" />
              <div class="text-lg text-bold text-surface-300">Nenhuma atividade registrada.</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <div class="column q-gutter-y-lg">
          <!-- Acesso Rápido -->
          <q-card class="sakai-card-plain shadow-card">
            <q-card-section class="q-px-xl q-py-lg">
              <div class="text-lg text-bold text-surface-900">Acesso Rápido</div>
            </q-card-section>
            <q-separator color="surface-100" />
            <q-card-section class="q-pa-lg q-gutter-y-sm">
              <q-btn
                outline
                color="primary"
                icon="emoji_events"
                label="Novo Torneio"
                class="full-width text-left q-py-md btn-quick"
                align="left"
                no-caps
                @click="openTournamentForm"
              />
              <q-btn
                outline
                color="primary"
                icon="person_add"
                label="Cadastrar Jogador"
                class="full-width text-left q-py-md btn-quick"
                align="left"
                no-caps
              />
              <q-btn
                outline
                color="primary"
                icon="tune"
                label="Ajustar Categorias"
                class="full-width text-left q-py-md btn-quick"
                align="left"
                no-caps
              />
            </q-card-section>
          </q-card>

          <!-- Últimos Torneios -->
          <q-card class="sakai-card-plain shadow-card">
            <q-card-section class="q-px-xl q-py-lg">
              <div class="text-xs text-bold text-surface-300 uppercase tracking-widest">
                ÚLTIMOS TORNEIOS
              </div>
            </q-card-section>
            <q-separator color="surface-100" />
            <q-card-section class="q-pa-none">
              <q-list separator>
                <q-item
                  v-for="t in [
                    { name: 'Copa Verão 2025', status: 'Aberto', color: 'green' },
                    { name: 'Torneio Interno Março', status: 'Em Andamento', color: 'blue' },
                    { name: 'Campeonato Nordestino', status: 'Rascunho', color: 'orange' },
                  ]"
                  :key="t.name"
                  class="q-py-md"
                >
                  <q-item-section>
                    <q-item-label class="text-bold text-surface-800">{{ t.name }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge
                      :color="t.color + '-1'"
                      :text-color="t.color + '-10'"
                      class="text-bold q-px-sm"
                      :label="t.status"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Tournament Form Dialog -->
    <q-dialog v-model="showTournamentDialog" persistent backdrop-filter="blur(8px)">
      <q-card class="radius-2xl shadow-xl overflow-hidden" style="width: 520px; max-width: 95vw">
        <q-card-section class="row items-center q-pa-xl bg-surface-50">
          <q-avatar icon="emoji_events" color="primary" text-color="white" class="shadow-md" />
          <div class="text-xl text-bold q-ml-md text-surface-900">Novo Torneio</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
        </q-card-section>

        <q-separator color="surface-100" />

        <q-form @submit="onSubmitTournament">
          <q-card-section class="q-pa-xl q-gutter-y-xl">
            <div class="q-gutter-y-xs">
              <label
                class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                >Nome do Torneio *</label
              >
              <q-input
                v-model="tournamentForm.name"
                placeholder="Ex: Open de Verão 2024"
                outlined
                dense
                autofocus
                bg-color="white"
                :rules="[(val) => !!val || 'Nome é obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="drive_file_rename_outline" color="surface-300" />
                </template>
              </q-input>
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-12 col-sm-6">
                <label
                  class="text-xs font-bold text-surface-500 q-mb-sm block uppercase tracking-widest"
                  >Tipo *</label
                >
                <q-select
                  v-model="tournamentForm.type"
                  :options="typeOptions"
                  outlined
                  dense
                  emit-value
                  map-options
                  bg-color="white"
                  :rules="[(val) => !!val || 'Tipo é obrigatório']"
                />
              </div>
              <div class="col-12 col-sm-6">
                <label
                  class="text-xs font-bold text-surface-500 q-mb-sm block uppercase tracking-widest"
                  >Status Inicial *</label
                >
                <q-select
                  v-model="tournamentForm.status"
                  :options="statusOptions"
                  outlined
                  dense
                  emit-value
                  map-options
                  bg-color="white"
                  :rules="[(val) => !!val || 'Status é obrigatório']"
                />
              </div>
            </div>

            <div class="info-banner q-pa-lg flex no-wrap items-center">
              <q-icon name="lightbulb" color="primary" size="28px" class="q-mr-lg" />
              <div class="text-sm text-surface-700 leading-normal">
                Comece como <strong class="text-primary font-bold">Rascunho</strong> para configurar
                as chaves e premiação antes de abrir as inscrições públicas.
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-xl bg-surface-50 border-surface-100">
            <q-btn
              flat
              label="Descartar"
              v-close-popup
              color="surface-500"
              no-caps
              class="text-bold"
            />
            <q-btn
              label="Salvar Torneio"
              type="submit"
              color="primary"
              unelevated
              class="q-px-xl text-bold no-caps shadow-md"
              :loading="submitting"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useArenaStore } from 'src/stores/arena';
import { useTournamentStore } from 'src/stores/tournament';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const arenaStore = useArenaStore();
const tournamentStore = useTournamentStore();
const route = useRoute();
const arenaId = route.params.id;

const showTournamentDialog = ref(false);
const submitting = ref(false);

const tournamentForm = reactive({
  name: '',
  type: 'group_knockout',
  status: 'draft',
});

const typeOptions = [
  { label: 'Grupos + Mata-mata', value: 'group_knockout' },
  { label: 'Mata-mata Simples', value: 'knockout' },
  { label: 'Liga / Pontos Corridos', value: 'league' },
];

const statusOptions = [
  { label: 'Rascunho', value: 'draft' },
  { label: 'Inscrições Abertas', value: 'open' },
  { label: 'Em Andamento', value: 'ongoing' },
  { label: 'Encerrado', value: 'finished' },
];

onMounted(async () => {
  await arenaStore.fetchArenaDashboard(arenaId);
});

function openTournamentForm() {
  tournamentForm.name = '';
  tournamentForm.type = 'group_knockout';
  tournamentForm.status = 'draft';
  showTournamentDialog.value = true;
}

async function onSubmitTournament() {
  submitting.value = true;
  try {
    await tournamentStore.saveTournament(arenaId, { ...tournamentForm });
    $q.notify({
      type: 'positive',
      message: 'Torneio criado com sucesso!',
      position: 'top',
      icon: 'check_circle',
    });
    showTournamentDialog.value = false;
    await arenaStore.fetchArenaDashboard(arenaId);
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao criar torneio.',
      position: 'top',
    });
  } finally {
    submitting.value = false;
  }
}

function getActivityIcon(activity) {
  if (activity.message.includes('registrou')) {
    return { icon: 'person_add', color: 'blue-1', textColor: 'blue-10' };
  }
  if (activity.message.includes('aberto')) {
    return { icon: 'emoji_events', color: 'purple-1', textColor: 'purple-10' };
  }
  if (activity.message.includes('perfil')) {
    return { icon: 'edit', color: 'blue-1', textColor: 'blue-10' };
  }
  if (activity.message.includes('nível')) {
    return { icon: 'bar_chart', color: 'indigo-1', textColor: 'indigo-10' };
  }
  return { icon: 'add_circle', color: 'blue-1', textColor: 'blue-10' };
}
</script>

<style scoped>
.stat-card {
  border-radius: var(--radius-lg);
  min-height: 120px;
  border: none;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg) !important;
}

.sakai-card-plain {
  background: #ffffff;
  border: 1px solid var(--surface-100);
}

.item-border {
  border-bottom: 1px solid var(--surface-50);
}

.item-border:last-child {
  border-bottom: none;
}

.btn-quick {
  border-radius: var(--radius-md);
  color: var(--surface-700) !important;
  border: 1px solid var(--surface-100) !important;
  font-weight: 500;
}

.btn-quick:hover {
  background-color: var(--surface-50);
}

.info-banner {
  background-color: rgba(2, 132, 199, 0.04);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--primary);
}

.tracking-widest {
  letter-spacing: 0.1em;
}
.shadow-card {
  box-shadow: var(--shadow-card) !important;
}
</style>
