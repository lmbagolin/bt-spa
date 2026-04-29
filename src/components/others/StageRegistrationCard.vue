<template>
  <!-- CTA Card (oculto no modo dialog-only) -->
  <q-card v-if="!dialogOnly" class="open-stage-card shadow-card overflow-hidden">
    <!-- Cabeçalho -->
    <q-card-section class="q-pa-md row items-center justify-between no-wrap">
      <div class="row items-center q-gutter-sm">
        <q-icon name="how_to_reg" color="positive" size="20px" />
        <span class="text-sm text-bold text-surface-900">
          {{ $t('stage_registration_card.registrations_open') }}
        </span>
        <q-chip
          dense color="blue-1" text-color="primary"
          class="text-bold q-ma-none" style="font-size:0.6rem; height:18px"
        >
          {{ tipoLabel(stage.tipo) }}
        </q-chip>
      </div>
      <span class="text-xs text-surface-400 text-bold">
        {{ getDaysUntil(stage.data_etapa) }}
      </span>
    </q-card-section>

    <q-separator color="surface-100" />

    <!-- Corpo -->
    <q-card-section class="q-pa-md">
      <!-- Caixa da etapa -->
      <div class="stage-box q-pa-md">
        <!-- Data -->
        <div class="text-base text-bold text-surface-900">
          {{ getDayOfWeek(stage.data_etapa) }}, {{ formatDay(stage.data_etapa) }} de
          {{ formatMonthYear(stage.data_etapa) }}
          <span v-if="formatTime(stage.data_etapa)" class="text-surface-500" style="font-weight:400">
            · {{ formatTime(stage.data_etapa) }}
          </span>
        </div>

        <q-separator color="surface-100" class="q-my-sm" />

        <!-- Métricas -->
        <div class="row items-center q-gutter-lg">
          <div>
            <div class="text-xs text-surface-400">
              {{ $t('stage_registration_card.stage_value_label') }}
            </div>
            <div class="text-sm text-bold text-positive">
              {{ formatCurrency(stage.valor_inscricao) }}
            </div>
          </div>
          <div>
            <div class="text-xs text-surface-400">
              {{ $t('stage_registration_card.players_per_group_label') }}
            </div>
            <div class="text-sm text-bold text-surface-700">
              {{ stage.jogadores_por_grupo }}
              {{ $t('stage_registration_card.players_unit') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Já inscrito -->
      <div v-if="myRegistration" class="row items-center q-gutter-sm q-mt-md">
        <q-icon name="check_circle" color="positive" size="18px" />
        <span class="text-sm text-surface-600">{{ $t('stage_registration_card.already_registered') }}</span>
        <q-chip
          :color="statusConfig[myRegistration.status]?.color"
          :text-color="statusConfig[myRegistration.status]?.textColor"
          dense class="text-bold q-ma-none" style="font-size:0.65rem; height:18px"
        >
          {{ statusConfig[myRegistration.status]?.label }}
        </q-chip>
      </div>
    </q-card-section>

    <!-- Rodapé -->
    <q-separator color="surface-100" />
    <q-card-actions class="q-px-md q-py-sm">
      <q-space />
      <q-btn
        v-if="!myRegistration"
        unelevated no-caps icon="how_to_reg"
        :label="$t('stage_registration_card.btn_register')"
        color="primary"
        class="text-bold"
        @click="showDialog = true"
      />
      <span v-else class="text-xs text-surface-400 q-px-sm">
        {{ $t('stage_registration_card.guarantee_spot') }}
      </span>
    </q-card-actions>
  </q-card>

  <!-- Dialog de Inscrição (sempre presente) -->
  <q-dialog v-model="showDialog" persistent backdrop-filter="blur(8px)">
    <q-card class="radius-xl shadow-xl overflow-hidden" style="width: 420px; max-width: 95vw;">
      <q-card-section class="row items-center q-pa-xl bg-surface-50">
        <q-avatar icon="how_to_reg" color="primary" text-color="white" class="shadow-md" />
        <div class="column q-ml-md">
          <div class="text-xl text-bold text-surface-900">{{ $t('stage_registration_card.dialog_title') }}</div>
          <div class="text-xs text-surface-400">{{ league?.nome }}</div>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
      </q-card-section>

      <q-separator color="surface-100" />

      <q-card-section class="q-pa-xl q-gutter-y-md">
        <!-- Resumo da etapa -->
        <div class="confirm-block q-pa-md radius-lg">
          <div class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-sm">
            {{ $t('stage_registration_card.section_stage_summary') }}
          </div>
          <div class="row items-center q-gutter-sm q-mb-xs">
            <q-chip color="blue-1" text-color="primary" dense class="text-bold text-xs">
              {{ tipoLabel(stage.tipo) }}
            </q-chip>
          </div>
          <div class="text-base text-bold text-surface-900">
            {{ getDayOfWeek(stage.data_etapa) }}, {{ formatDateFull(stage.data_etapa) }}
          </div>
          <div class="row items-center justify-between q-mt-sm">
            <span class="text-sm text-surface-500">{{ $t('stage_registration_card.stage_value_label') }}</span>
            <span class="text-base text-bold text-positive">{{ formatCurrency(stage.valor_inscricao) }}</span>
          </div>
        </div>

        <!-- Dados do jogador -->
        <div class="confirm-block q-pa-md radius-lg">
          <div class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-md">
            {{ $t('stage_registration_card.section_player_data') }}
          </div>
          <div class="row items-center no-wrap q-gutter-md">
            <q-avatar size="44px" color="primary" text-color="white" class="text-bold text-lg">
              {{ playerStore.currentPlayer?.name?.charAt(0)?.toUpperCase() || '?' }}
            </q-avatar>
            <div class="col">
              <div class="text-base text-bold text-surface-900">{{ playerStore.currentPlayer?.name || '—' }}</div>
              <div v-if="playerStore.currentPlayer?.nickname" class="text-xs text-surface-400">
                {{ playerStore.currentPlayer.nickname }}
              </div>
            </div>
          </div>
          <q-banner v-if="!playerStore.currentPlayer?.name" class="q-mt-md text-xs" rounded dense>
            <template v-slot:avatar><q-icon name="warning" color="warning" /></template>
            {{ $t('stage_registration_card.profile_incomplete_warning') }}
            <router-link to="/profile" class="text-primary text-bold">
              {{ $t('stage_registration_card.profile_link') }}
            </router-link>
            {{ $t('stage_registration_card.profile_incomplete_suffix') }}
          </q-banner>
        </div>

        <!-- Parceiro (dupla fixa) -->
        <div v-if="isDupla" class="confirm-block q-pa-md radius-lg">
          <div class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-md">
            {{ $t('stage_registration_card.partner_section_title') }}
          </div>
          <div v-if="friendStore.friends.length" class="q-gutter-y-xs">
            <BtSelect
              v-model="partnerId"
              :label="$t('stage_registration_card.partner_name_label')"
              :options="friendOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :rules="[val => !!val || $t('stage_registration_card.partner_name_required')]"
            />
          </div>
          <div v-else class="text-sm text-surface-500 text-center q-py-sm">
            {{ $t('stage_registration_card.no_friends_for_partner') }}
            <router-link to="/amigos" class="text-primary text-bold q-ml-xs" v-close-popup>
              {{ $t('stage_registration_card.add_friends_link') }}
            </router-link>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-xl bg-surface-50 border-surface-100">
        <q-btn flat :label="$t('common.cancel')" v-close-popup color="surface-500" no-caps class="text-bold" />
        <q-btn
          :label="$t('stage_registration_card.btn_confirm_registration')"
          color="primary" unelevated icon="check"
          class="q-px-xl text-bold no-caps shadow-md"
          :loading="registering"
          :disable="!playerStore.currentPlayer?.name || (isDupla && !partnerId)"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useLeagueStore } from 'src/stores/league';
import { usePlayerStore } from 'src/stores/player';
import { useFriendStore } from 'src/stores/friend';
import { tipoLabel } from 'src/composables/useStageTypes';

const props = defineProps({
  stage:          { type: Object,  required: true },
  league:         { type: Object,  required: true },
  leagueId:       { type: [String, Number], required: true },
  myRegistration: { type: Object,  default: null },
  open:           { type: Boolean, default: false },
  dialogOnly:     { type: Boolean, default: false },
});

const emit = defineEmits(['registered', 'update:open']);

const $q          = useQuasar();
const { t }       = useI18n();
const leagueStore = useLeagueStore();
const playerStore = usePlayerStore();
const friendStore = useFriendStore();

const showDialog  = ref(props.open);
const registering = ref(false);
const partnerId   = ref(null);

const friendOptions = computed(() =>
  friendStore.friends.map((item) => ({
    label: item.friend?.nickname
      ? `${item.friend.name} (${item.friend.nickname})`
      : item.friend?.name ?? '—',
    value: item.friend?.id,
  })),
);

onMounted(() => { friendStore.fetchFriends().catch(() => {}); });

watch(() => props.open, (val) => { showDialog.value = val; });
watch(showDialog, (val) => { if (!val) emit('update:open', false); });

const isDupla = computed(() => props.stage.tipo === 'dupla-fixa');

const statusConfig = computed(() => ({
  pending:   { label: t('stage_registration_card.status_waiting'),   color: 'amber-2', textColor: 'amber-9' },
  confirmed: { label: t('stage_registration_card.status_confirmed'), color: 'green-2', textColor: 'green-9' },
  waitlist:  { label: t('stage_registration_card.status_waitlist'),  color: 'blue-2',  textColor: 'blue-9'  },
  cancelled: { label: t('stage_registration_card.status_cancelled'), color: 'red-2',   textColor: 'red-9'   },
}));

async function onSubmit() {
  registering.value = true;
  try {
    const payload = isDupla.value ? { partner_player_id: partnerId.value } : {};
    await leagueStore.registerForStage(props.leagueId, props.stage.id, payload);
    $q.notify({ type: 'positive', message: t('stage_registration_card.notify_success'), position: 'top', icon: 'check_circle', timeout: 4000 });
    showDialog.value = false;
    partnerId.value  = null;
    await leagueStore.fetchPublicStageRegistrations(props.leagueId, props.stage.id);
    emit('registered', props.stage.id);
  } catch (e) {
    const msg = e?.response?.data?.message ?? t('stage_registration_card.notify_error');
    $q.notify({ type: 'negative', message: msg, position: 'top' });
  } finally {
    registering.value = false;
  }
}

function parseDate(str) {
  if (!str) return new Date(NaN);
  return new Date(str.replace(' ', 'T'));
}

function formatDay(dateStr) {
  if (!dateStr) return '—';
  return parseDate(dateStr).toLocaleDateString('pt-BR', { day: '2-digit' });
}

function formatMonthYear(dateStr) {
  if (!dateStr) return '';
  return parseDate(dateStr).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const timePart = dateStr.split(' ')[1];
  return timePart && timePart !== '00:00' ? timePart : '';
}

function getDayOfWeek(dateStr) {
  const keys = ['day_sun', 'day_mon', 'day_tue', 'day_wed', 'day_thu', 'day_fri', 'day_sat'];
  return t(`stage_registration_card.${keys[parseDate(dateStr).getDay()]}`);
}

function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseDate(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return t('stage_registration_card.days_today');
  if (diff === 1) return t('stage_registration_card.days_tomorrow');
  if (diff < 0)  return t('stage_registration_card.days_closed');
  return t('stage_registration_card.days_until', { n: diff });
}

function formatDateFull(dateStr) {
  if (!dateStr) return '—';
  const d = parseDate(dateStr);
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const time = formatTime(dateStr);
  return time ? `${date} às ${time}` : date;
}

function formatCurrency(value) {
  if (value == null) return '—';
  if (value === 0) return 'Grátis';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
</script>

<style scoped>
.open-stage-card {
  border: 2px solid var(--q-primary);
  border-radius: 12px;
}
.open-stage-header {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
}
.text-2xl { font-size: 1.5rem; }

.confirm-block {
  background: var(--surface-50);
  border: 1px solid var(--surface-100);
  border-radius: 8px;
}
.radius-lg { border-radius: 12px; }
</style>
