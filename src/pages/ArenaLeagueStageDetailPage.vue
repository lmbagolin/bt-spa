<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="column">
        <div class="row items-center q-gutter-md">
          <q-btn flat round icon="arrow_back" @click="$router.back()" />
          <div class="column">
            <div class="row items-center q-gutter-sm">
              <span class="text-sm text-surface-400 cursor-pointer" @click="$router.back()">
                {{ leagueStore.currentLeague?.nome || 'Liga' }}
              </span>
              <q-icon name="chevron_right" color="surface-300" size="16px" />
              <h1 class="text-2xl text-bold text-surface-900 q-my-none">
                {{ currentStageLabel }}
              </h1>
            </div>
            <p class="text-sm text-surface-500 q-mt-xs q-mb-none font-medium">
              Jogadores inscritos e gestão da etapa
            </p>
          </div>
        </div>
      </div>
      <q-btn
        color="primary"
        icon="person_add"
        label="Inscrever Jogador"
        unelevated
        class="text-bold no-caps q-px-md shadow-md"
        @click="openRegistrationDialog"
      />
    </div>

    <!-- Cards de Informações da Etapa -->
    <div v-if="stage" class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-sm">
              Data
            </div>
            <div class="text-lg text-bold text-primary">{{ formatDate(stage.data_etapa) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-sm">
              Inscrição
            </div>
            <div class="text-lg text-bold text-positive">
              {{ formatCurrency(stage.valor_inscricao) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-sm">
              Inscritos
            </div>
            <div class="text-lg text-bold text-surface-900">
              {{ leagueStore.stageRegistrations.length }}
              <span class="text-sm text-surface-400 font-normal">jogadores</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-sm">
              Confirmados
            </div>
            <div class="text-lg text-bold text-positive">
              {{ confirmedCount }}
              <span class="text-sm text-surface-400 font-normal"
                >/ {{ leagueStore.stageRegistrations.length }}</span
              >
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filtros e Busca -->
    <q-card class="q-mb-md border-surface-100 shadow-card">
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-5">
            <q-input
              v-model="search"
              placeholder="Buscar por nome ou apelido..."
              outlined
              dense
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="surface-400" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3">
            <q-select
              v-model="filterStatus"
              :options="statusOptions"
              label="Status"
              outlined
              dense
              clearable
              emit-value
              map-options
              bg-color="white"
            />
          </div>
          <div class="col-12 col-sm-3">
            <q-select
              v-model="filterGender"
              :options="genderFilterOptions"
              label="Gênero"
              outlined
              dense
              clearable
              emit-value
              map-options
              bg-color="white"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela de Jogadores Inscritos -->
    <q-card class="border-surface-100 shadow-card overflow-hidden">
      <q-card-section class="q-pa-lg bg-surface-50 border-surface-100">
        <div class="row items-center justify-between">
          <div class="text-lg text-bold text-surface-900">Jogadores Inscritos</div>
          <div class="row q-gutter-sm">
            <q-chip
              v-for="s in statusSummary"
              :key="s.value"
              :color="s.chipColor"
              :text-color="s.chipTextColor"
              dense
              class="text-bold text-xs"
            >
              {{ s.label }}: {{ s.count }}
            </q-chip>
          </div>
        </div>
      </q-card-section>
      <q-table
        :rows="filteredRegistrations"
        :columns="columns"
        row-key="id"
        flat
        :loading="leagueStore.loadingRegistrations"
        :pagination="pagination"
        class="sakai-table"
        no-data-label="Nenhum jogador inscrito nesta etapa."
        no-results-label="Nenhum jogador corresponde ao filtro."
      >
        <template v-slot:body-cell-player="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-avatar
                size="36px"
                :color="getAvatarColor(props.row.player?.gender)"
                text-color="white"
                class="text-bold"
              >
                {{ getInitials(props.row.player?.name) }}
              </q-avatar>
              <div class="column q-ml-sm">
                <div class="text-bold text-surface-900">
                  {{ props.row.player?.name || props.row.name || '-' }}
                </div>
                <div class="text-xs text-surface-400">
                  {{ props.row.player?.nickname || props.row.nickname || '' }}
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-gender="props">
          <q-td :props="props">
            <div class="row items-center no-wrap q-gutter-xs">
              <q-icon
                :name="getGender(props.row) === 'male' ? 'male' : 'female'"
                :color="getGender(props.row) === 'male' ? 'blue' : 'pink'"
                size="18px"
              />
              <span class="text-surface-600 text-sm">{{
                getGender(props.row) === 'male' ? 'Masc' : 'Fem'
              }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-level="props">
          <q-td :props="props">
            <q-chip
              :color="getLevelBadge(props.row.player?.level || props.row.level).color"
              :text-color="getLevelBadge(props.row.player?.level || props.row.level).textColor"
              dense
              class="text-bold text-xs"
            >
              {{ props.row.player?.level || props.row.level || 'N/A' }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusBadge(props.row.status).color"
              :text-color="getStatusBadge(props.row.status).textColor"
              dense
              class="text-bold text-xs cursor-pointer"
              clickable
              @click="quickChangeStatus(props.row)"
            >
              <q-icon :name="getStatusBadge(props.row.status).icon" size="14px" class="q-mr-xs" />
              {{ getStatusLabel(props.row.status) }}
              <q-tooltip>Clique para alterar status</q-tooltip>
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-payment="props">
          <q-td :props="props">
            <div class="text-sm">
              <span v-if="props.row.valor_pago != null" class="text-positive text-bold">
                {{ formatCurrency(props.row.valor_pago) }}
              </span>
              <span v-else class="text-surface-400">—</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              flat
              round
              dense
              icon="edit"
              color="surface-400"
              @click="editRegistration(props.row)"
            >
              <q-tooltip>Editar inscrição</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              @click="confirmDeleteRegistration(props.row)"
            >
              <q-tooltip>Remover inscrição</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Dialog de Inscrição -->
    <q-dialog v-model="showDialog" persistent backdrop-filter="blur(8px)">
      <q-card class="radius-xl shadow-xl overflow-hidden" style="width: 520px; max-width: 95vw">
        <q-card-section class="row items-center q-pa-xl bg-surface-50">
          <q-avatar icon="how_to_reg" color="primary" text-color="white" class="shadow-md" />
          <div class="column q-ml-md">
            <div class="text-xl text-bold text-surface-900">
              {{ registrationForm.id ? 'Editar Inscrição' : 'Inscrever Jogador' }}
            </div>
            <div class="text-xs text-surface-400">{{ currentStageLabel }}</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
        </q-card-section>

        <q-separator color="surface-100" />

        <q-form @submit="onSubmitRegistration">
          <q-card-section class="q-pa-xl q-gutter-y-lg">
            <!-- Dados do Jogador (apenas quando novo) -->
            <template v-if="!registrationForm.id">
              <div>
                <h3 class="text-sm text-bold text-surface-900 q-mb-lg">Dados do Jogador</h3>
                <div class="q-gutter-y-lg">
                  <div class="q-gutter-y-xs">
                    <label
                      class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                      >Nome Completo *</label
                    >
                    <q-input
                      v-model="registrationForm.name"
                      placeholder="Ex: João da Silva"
                      outlined
                      dense
                      bg-color="white"
                      lazy-rules
                      :rules="[(val) => !!val || 'Nome é obrigatório']"
                    />
                  </div>
                  <div class="q-gutter-y-xs">
                    <label
                      class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                      >Apelido</label
                    >
                    <q-input
                      v-model="registrationForm.nickname"
                      placeholder="Ex: Japa"
                      outlined
                      dense
                      bg-color="white"
                    />
                  </div>
                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-sm-6">
                      <label
                        class="text-xs font-bold text-surface-500 q-mb-sm block uppercase tracking-widest"
                        >Gênero</label
                      >
                      <q-select
                        v-model="registrationForm.gender"
                        :options="genderOptions"
                        outlined
                        dense
                        emit-value
                        map-options
                        bg-color="white"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <label
                        class="text-xs font-bold text-surface-500 q-mb-sm block uppercase tracking-widest"
                        >Nível</label
                      >
                      <q-select
                        v-model="registrationForm.level"
                        :options="levelOptions"
                        outlined
                        dense
                        emit-value
                        map-options
                        bg-color="white"
                      />
                    </div>
                  </div>
                  <div class="q-gutter-y-xs">
                    <label
                      class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                      >WhatsApp</label
                    >
                    <q-input
                      v-model="registrationForm.whatsapp"
                      placeholder="(51) 99999-9999"
                      outlined
                      dense
                      bg-color="white"
                    >
                      <template v-slot:prepend>
                        <q-icon name="phone" color="surface-300" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
              <q-separator color="surface-100" />
            </template>

            <!-- Status e Pagamento -->
            <div>
              <h3 class="text-sm text-bold text-surface-900 q-mb-lg">Inscrição</h3>
              <div class="q-gutter-y-lg">
                <div class="q-gutter-y-xs">
                  <label
                    class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                    >Status *</label
                  >
                  <q-select
                    v-model="registrationForm.status"
                    :options="statusOptions"
                    outlined
                    dense
                    emit-value
                    map-options
                    bg-color="white"
                    lazy-rules
                    :rules="[(val) => !!val || 'Status obrigatório']"
                  />
                </div>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-sm-6">
                    <label
                      class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                      >Valor Pago</label
                    >
                    <q-input
                      v-model.number="registrationForm.valor_pago"
                      type="number"
                      min="0"
                      step="0.01"
                      outlined
                      dense
                      bg-color="white"
                      prefix="R$"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <label
                      class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                      >Posição no Grupo</label
                    >
                    <q-input
                      v-model.number="registrationForm.posicao_grupo"
                      type="number"
                      min="1"
                      outlined
                      dense
                      bg-color="white"
                      clearable
                    />
                  </div>
                </div>
                <div class="q-gutter-y-xs">
                  <label
                    class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                    >Observações</label
                  >
                  <q-input
                    v-model="registrationForm.observacoes"
                    type="textarea"
                    placeholder="Observações sobre a inscrição..."
                    outlined
                    dense
                    bg-color="white"
                    rows="3"
                    autogrow
                  />
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-xl bg-surface-50 border-surface-100">
            <q-btn
              flat
              label="Cancelar"
              v-close-popup
              color="surface-500"
              no-caps
              class="text-bold"
            />
            <q-btn
              label="Salvar"
              type="submit"
              color="primary"
              unelevated
              class="q-px-xl text-bold no-caps shadow-md"
              :loading="saving"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Dialog de Troca Rápida de Status -->
    <q-dialog v-model="showStatusDialog" backdrop-filter="blur(8px)">
      <q-card class="radius-xl shadow-xl overflow-hidden" style="width: 360px; max-width: 95vw">
        <q-card-section class="row items-center q-pa-xl bg-surface-50">
          <q-avatar icon="swap_horiz" color="primary" text-color="white" class="shadow-md" />
          <div class="column q-ml-md">
            <div class="text-lg text-bold text-surface-900">Alterar Status</div>
            <div class="text-xs text-surface-400">
              {{ selectedRegistration?.player?.name || selectedRegistration?.name }}
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
        </q-card-section>
        <q-separator color="surface-100" />
        <q-card-section class="q-pa-xl">
          <div class="q-gutter-y-sm">
            <q-btn
              v-for="s in statusOptions"
              :key="s.value"
              :label="s.label"
              :color="getStatusBadge(s.value).btnColor"
              unelevated
              no-caps
              class="full-width text-bold"
              :outline="selectedRegistration?.status !== s.value"
              :loading="updatingStatus && pendingStatus === s.value"
              @click="applyStatusChange(s.value)"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLeagueStore } from 'src/stores/league';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const route = useRoute();
const arenaId = route.params.id;
const leagueId = route.params.leagueId;
const stageId = route.params.stageId;
const leagueStore = useLeagueStore();

const showDialog = ref(false);
const showStatusDialog = ref(false);
const saving = ref(false);
const updatingStatus = ref(false);
const pendingStatus = ref(null);
const selectedRegistration = ref(null);
const search = ref('');
const filterStatus = ref(null);
const filterGender = ref(null);

const pagination = { rowsPerPage: 15 };

const stage = computed(() => {
  return leagueStore.stages.find((s) => String(s.id) === String(stageId)) || null;
});

const currentStageLabel = computed(() => {
  if (!stage.value) return 'Etapa';
  return `${stage.value.tipo} — ${formatDate(stage.value.data_etapa)}`;
});

const confirmedCount = computed(() => {
  return leagueStore.stageRegistrations.filter((r) => r.status === 'confirmed').length;
});

const statusSummary = computed(() => {
  const regs = leagueStore.stageRegistrations;
  return [
    {
      value: 'confirmed',
      label: 'Confirmados',
      count: regs.filter((r) => r.status === 'confirmed').length,
      chipColor: 'green-1',
      chipTextColor: 'green-9',
    },
    {
      value: 'pending',
      label: 'Pendentes',
      count: regs.filter((r) => r.status === 'pending').length,
      chipColor: 'orange-1',
      chipTextColor: 'orange-9',
    },
    {
      value: 'waitlist',
      label: 'Espera',
      count: regs.filter((r) => r.status === 'waitlist').length,
      chipColor: 'blue-1',
      chipTextColor: 'blue-9',
    },
    {
      value: 'cancelled',
      label: 'Cancelados',
      count: regs.filter((r) => r.status === 'cancelled').length,
      chipColor: 'red-1',
      chipTextColor: 'red-9',
    },
  ].filter((s) => s.count > 0);
});

const filteredRegistrations = computed(() => {
  let result = leagueStore.stageRegistrations;

  if (search.value) {
    const s = search.value.toLowerCase();
    result = result.filter((r) => {
      const name = (r.player?.name || r.name || '').toLowerCase();
      const nick = (r.player?.nickname || r.nickname || '').toLowerCase();
      return name.includes(s) || nick.includes(s);
    });
  }

  if (filterStatus.value) {
    result = result.filter((r) => r.status === filterStatus.value);
  }

  if (filterGender.value) {
    result = result.filter((r) => getGender(r) === filterGender.value);
  }

  return result;
});

const columns = [
  { name: 'player', align: 'left', label: 'Jogador', field: 'player', sortable: true },
  {
    name: 'gender',
    align: 'left',
    label: 'Gênero',
    field: (row) => row.player?.gender || row.gender,
  },
  {
    name: 'level',
    align: 'left',
    label: 'Nível',
    field: (row) => row.player?.level || row.level,
    sortable: true,
  },
  { name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true },
  { name: 'payment', align: 'left', label: 'Valor Pago', field: 'valor_pago' },
  { name: 'actions', align: 'center', label: 'Ações' },
];

const statusOptions = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Confirmado', value: 'confirmed' },
  { label: 'Lista de Espera', value: 'waitlist' },
  { label: 'Cancelado', value: 'cancelled' },
];

const genderOptions = [
  { label: 'Masculino', value: 'male' },
  { label: 'Feminino', value: 'female' },
  { label: 'Outro', value: 'other' },
];

const genderFilterOptions = [
  { label: 'Masculino', value: 'male' },
  { label: 'Feminino', value: 'female' },
];

const levelOptions = [
  { label: 'Iniciante', value: 'Iniciante' },
  { label: 'Intermediário', value: 'Intermediário' },
  { label: 'Avançado', value: 'Avançado' },
  { label: 'Pro', value: 'Pro' },
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
];

const registrationForm = reactive({
  id: null,
  name: '',
  nickname: '',
  gender: 'male',
  level: 'Iniciante',
  whatsapp: '',
  status: 'pending',
  valor_pago: null,
  posicao_grupo: null,
  observacoes: '',
});

onMounted(async () => {
  await leagueStore.fetchLeague(arenaId, leagueId);
  await leagueStore.fetchStageRegistrations(arenaId, leagueId, stageId);
});

function openRegistrationDialog() {
  resetRegistrationForm();
  showDialog.value = true;
}

function resetRegistrationForm() {
  registrationForm.id = null;
  registrationForm.name = '';
  registrationForm.nickname = '';
  registrationForm.gender = 'male';
  registrationForm.level = 'Iniciante';
  registrationForm.whatsapp = '';
  registrationForm.status = 'pending';
  registrationForm.valor_pago = null;
  registrationForm.posicao_grupo = null;
  registrationForm.observacoes = '';
}

function editRegistration(reg) {
  registrationForm.id = reg.id;
  registrationForm.name = reg.player?.name || reg.name || '';
  registrationForm.nickname = reg.player?.nickname || reg.nickname || '';
  registrationForm.gender = reg.player?.gender || reg.gender || 'male';
  registrationForm.level = reg.player?.level || reg.level || 'Iniciante';
  registrationForm.whatsapp = reg.player?.whatsapp || reg.whatsapp || '';
  registrationForm.status = reg.status || 'pending';
  registrationForm.valor_pago = reg.valor_pago ?? null;
  registrationForm.posicao_grupo = reg.posicao_grupo ?? null;
  registrationForm.observacoes = reg.observacoes || '';
  showDialog.value = true;
}

async function onSubmitRegistration() {
  saving.value = true;
  try {
    await leagueStore.saveStageRegistration(arenaId, leagueId, stageId, { ...registrationForm });
    $q.notify({
      type: 'positive',
      message: `Inscrição ${registrationForm.id ? 'atualizada' : 'realizada'} com sucesso!`,
      position: 'top',
      icon: 'check_circle',
    });
    showDialog.value = false;
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar inscrição.',
      position: 'top',
    });
  } finally {
    saving.value = false;
  }
}

function quickChangeStatus(reg) {
  selectedRegistration.value = reg;
  showStatusDialog.value = true;
}

async function applyStatusChange(status) {
  if (!selectedRegistration.value) return;
  pendingStatus.value = status;
  updatingStatus.value = true;
  try {
    await leagueStore.updateRegistrationStatus(
      arenaId,
      leagueId,
      stageId,
      selectedRegistration.value.id,
      status,
    );
    $q.notify({
      type: 'positive',
      message: 'Status atualizado com sucesso!',
      position: 'top',
      icon: 'check_circle',
    });
    showStatusDialog.value = false;
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao atualizar status.',
      position: 'top',
    });
  } finally {
    updatingStatus.value = false;
    pendingStatus.value = null;
  }
}

function confirmDeleteRegistration(reg) {
  const name = reg.player?.name || reg.name || 'este jogador';
  $q.dialog({
    title: 'Remover Inscrição',
    message: `Deseja remover a inscrição de ${name}? Esta ação não pode ser desfeita.`,
    persistent: true,
    ok: { label: 'Remover', color: 'negative', unelevated: true, noCaps: true },
    cancel: { label: 'Cancelar', flat: true, color: 'surface-500', noCaps: true },
  }).onOk(async () => {
    try {
      await leagueStore.deleteStageRegistration(arenaId, leagueId, stageId, reg.id);
      $q.notify({
        type: 'positive',
        message: 'Inscrição removida com sucesso!',
        position: 'top',
        icon: 'check_circle',
      });
    } catch {
      $q.notify({
        type: 'negative',
        message: 'Erro ao remover inscrição.',
        position: 'top',
      });
    }
  });
}

function getGender(reg) {
  return reg.player?.gender || reg.gender || 'male';
}

function getInitials(name) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

function getAvatarColor(gender) {
  return gender === 'female' ? 'pink-4' : 'primary';
}

function getStatusLabel(status) {
  const map = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    waitlist: 'Lista de Espera',
    cancelled: 'Cancelado',
  };
  return map[status] || status;
}

function getStatusBadge(status) {
  const map = {
    pending: { color: 'orange-1', textColor: 'orange-9', icon: 'schedule', btnColor: 'orange' },
    confirmed: {
      color: 'green-1',
      textColor: 'green-9',
      icon: 'check_circle',
      btnColor: 'positive',
    },
    waitlist: { color: 'blue-1', textColor: 'blue-9', icon: 'hourglass_empty', btnColor: 'info' },
    cancelled: { color: 'red-1', textColor: 'red-9', icon: 'cancel', btnColor: 'negative' },
  };
  return (
    map[status] || {
      color: 'surface-100',
      textColor: 'surface-500',
      icon: 'help',
      btnColor: 'grey',
    }
  );
}

function getLevelBadge(level) {
  const map = {
    Iniciante: { color: 'blue-1', textColor: 'blue-10' },
    Intermediário: { color: 'orange-1', textColor: 'orange-10' },
    Avançado: { color: 'purple-1', textColor: 'purple-10' },
    Pro: { color: 'red-1', textColor: 'red-10' },
    A: { color: 'indigo-1', textColor: 'indigo-10' },
    B: { color: 'cyan-1', textColor: 'cyan-10' },
    C: { color: 'teal-1', textColor: 'teal-10' },
    D: { color: 'grey-2', textColor: 'grey-8' },
  };
  return map[level] || { color: 'surface-100', textColor: 'surface-500' };
}

function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('pt-BR');
}

function formatCurrency(value) {
  if (value == null) return '-';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
</script>

<style scoped>
.sakai-table :deep(thead tr th) {
  font-weight: 700;
  color: var(--surface-700);
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  background-color: var(--surface-50);
}

.block {
  display: block;
}
</style>
