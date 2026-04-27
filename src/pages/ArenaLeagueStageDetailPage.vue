<template>
  <q-page class="q-pa-lg">
    <PageHeader
      :title="currentStageLabel"
      :subtitle="isClosed ? $t('stage_detail.subtitle_closed') : $t('stage_detail.subtitle_open')"
      :breadcrumbs="[
        { label: leagueStore.currentLeague?.nome || 'Liga', action: () => $router.back() },
        { label: currentStageLabel },
      ]"
      :back="() => $router.back()"
    >
      <q-chip v-if="isClosed" color="positive" text-color="white" icon="check_circle" class="text-bold">
        {{ $t('stage_detail.chip_closed') }}
      </q-chip>
      <q-btn outline color="primary" icon="grid_view" :label="$t('stage_detail.btn_groups')" no-caps class="text-bold"
        @click="router.push({ name: 'stage-groups', params: { id: arenaId, leagueId, stageId } })" />
      <q-btn v-if="isClosed" outline color="orange" icon="account_tree" :label="$t('stage_detail.btn_playoffs')" no-caps
        class="text-bold"
        @click="router.push({ name: 'stage-playoffs', params: { id: arenaId, leagueId, stageId } })" />
      <q-btn v-if="!isClosed" color="primary" icon="person_add" :label="$t('stage_detail.btn_register')"
        unelevated no-caps class="text-bold" @click="openRegistrationDialog" />
    </PageHeader>

    <!-- Cards de Informações da Etapa -->
    <div v-if="stage" class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-sm">
              {{ $t('stage_detail.info_date') }}
            </div>
            <div class="text-lg text-bold text-primary">{{ formatDate(stage.data_etapa) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-sm">
              {{ $t('stage_detail.info_registration') }}
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
              {{ $t('stage_detail.info_registered') }}
            </div>
            <div class="text-lg text-bold text-surface-900">
              {{ leagueStore.stageRegistrations.length }}
              <span class="text-sm text-surface-400 font-normal">{{ $t('stage_detail.info_players_label') }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-sm">
              {{ $t('stage_detail.info_confirmed') }}
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

    <!-- ── RANKING (etapa encerrada) ── -->
    <template v-if="isClosed">
      <div class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-sm">
        {{ $t('stage_detail.ranking_title') }}
      </div>
      <q-card class="border-surface-100 shadow-card overflow-hidden">
        <div class="stage-ranking-header">
          <span class="srh srh-center">{{ $t('stage_detail.col_actions') }}</span>
          <span class="srh srh-left">{{ $t('stage_detail.col_player') }}</span>
          <span class="srh srh-center">PTS</span>
          <span class="srh srh-center">V</span>
          <span class="srh srh-center">JG</span>
          <span class="srh srh-center">SG</span>
          <span class="srh srh-center">GP</span>
          <span class="srh srh-center">GC</span>
        </div>
        <div
          v-for="entry in leagueStore.stageRanking"
          :key="entry.id"
          class="stage-ranking-row"
          :class="{
            'sr-gold':   entry.position === 1,
            'sr-silver': entry.position === 2,
            'sr-bronze': entry.position === 3,
          }"
        >
          <div class="srh-center">
            <span class="sr-pos-badge" :class="srPosBadgeClass(entry.position)">
              {{ entry.position }}°
            </span>
          </div>
          <div class="sr-player">
            <PlayerChip
              :name="entry.player?.name || '—'"
              :partner="entry.player?.partner_name || null"
              :color="entry.player?.color || '#64748b'"
            />
          </div>
          <span class="sr-cell sr-cell--pts">{{ entry.points }}</span>
          <span class="sr-cell">{{ entry.wins }}</span>
          <span class="sr-cell">{{ entry.matches_played }}</span>
          <span
            class="sr-cell"
            :class="entry.saldo_games > 0 ? 'sr-pos' : entry.saldo_games < 0 ? 'sr-neg' : ''"
          >
            {{ entry.saldo_games > 0 ? '+' : '' }}{{ entry.saldo_games }}
          </span>
          <span class="sr-cell">{{ entry.games_pro }}</span>
          <span class="sr-cell">{{ entry.games_against }}</span>
        </div>
      </q-card>
    </template>

    <!-- ── INSCRIÇÕES (etapa em aberto) ── -->
    <template v-else>
      <!-- Filtros e Busca -->
      <q-card class="q-mb-md border-surface-100 shadow-card">
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md items-center">
            <div class="col-12 col-sm-5">
              <q-input
                v-model="search"
                :placeholder="$t('stage_detail.search_placeholder')"
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
                :label="$t('stage_detail.filter_status')"
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
                :label="$t('stage_detail.filter_gender')"
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
            <div class="text-lg text-bold text-surface-900">{{ $t('stage_detail.section_registered') }}</div>
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
          :no-data-label="$t('stage_detail.no_data')"
          :no-results-label="$t('stage_detail.no_results')"
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
                    {{ props.row.player?.name || '-' }}
                  </div>
                  <!-- Parceiro (dupla fixa) -->
                  <div v-if="isDupla" class="text-xs text-surface-600 q-mt-xs row items-center q-gutter-xs">
                    <q-icon name="people" size="12px" color="surface-400" />
                    <span>{{ props.row.partner?.name || props.row.partner_name || '— parceiro não informado' }}</span>
                  </div>
                  <div v-else class="text-xs text-surface-400">
                    {{ props.row.player?.nickname || '' }}
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
                  getGender(props.row) === 'male' ? $t('common.gender_masc') : $t('common.gender_fem')
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
                <q-tooltip>{{ $t('stage_detail.tooltip_change_status') }}</q-tooltip>
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn flat round dense icon="edit" color="surface-400" @click="editRegistration(props.row)">
                <q-tooltip>{{ $t('stage_detail.tooltip_edit_reg') }}</q-tooltip>
              </q-btn>
              <q-btn flat round dense icon="delete" color="negative" @click="confirmDeleteRegistration(props.row)">
                <q-tooltip>{{ $t('stage_detail.tooltip_delete_reg') }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </template>

    <!-- Dialog de Inscrição -->
    <q-dialog v-model="showDialog" persistent backdrop-filter="blur(8px)">
      <q-card class="radius-xl shadow-xl overflow-hidden" style="width: 520px; max-width: 95vw">
        <q-card-section class="row items-center q-pa-xl bg-surface-50">
          <q-avatar icon="how_to_reg" color="primary" text-color="white" class="shadow-md" />
          <div class="column q-ml-md">
            <div class="text-xl text-bold text-surface-900">
              {{ registrationForm.id ? $t('stage_detail.dialog_edit_reg') : $t('stage_detail.dialog_register') }}
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
                <h3 class="text-sm text-bold text-surface-900 q-mb-lg">{{ $t('stage_detail.section_player_data') }}</h3>
                <div class="q-gutter-y-lg">
                  <div class="q-gutter-y-xs">
                    <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
                      {{ $t('stage_detail.field_full_name') }}
                    </label>
                    <q-input
                      v-model="registrationForm.name"
                      :placeholder="$t('stage_detail.field_full_name_placeholder')"
                      outlined
                      dense
                      bg-color="white"
                      lazy-rules
                      :rules="[(val) => !!val || $t('stage_detail.validation_name_required')]"
                    />
                  </div>
                  <div class="q-gutter-y-xs">
                    <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
                      {{ $t('stage_detail.field_nickname') }}
                    </label>
                    <q-input
                      v-model="registrationForm.nickname"
                      :placeholder="$t('stage_detail.field_nickname_placeholder')"
                      outlined
                      dense
                      bg-color="white"
                    />
                  </div>
                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-sm-6">
                      <label class="text-xs font-bold text-surface-500 q-mb-sm block uppercase tracking-widest">
                        {{ $t('stage_detail.field_gender') }}
                      </label>
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
                      <label class="text-xs font-bold text-surface-500 q-mb-sm block uppercase tracking-widest">
                        {{ $t('stage_detail.field_level') }}
                      </label>
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
                    <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
                      {{ $t('stage_detail.field_whatsapp') }}
                    </label>
                    <q-input
                      v-model="registrationForm.whatsapp"
                      :placeholder="$t('stage_detail.field_whatsapp_placeholder')"
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
              <!-- Parceiro (apenas para dupla fixa) -->
              <template v-if="isDupla">
                <q-separator color="surface-100" />
                <div>
                  <h3 class="text-sm text-bold text-surface-900 q-mb-lg">Parceiro</h3>
                  <div class="q-gutter-y-lg">
                    <div class="q-gutter-y-xs">
                      <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
                        Selecionar Parceiro (da arena)
                      </label>
                      <BtSelect
                        v-model="registrationForm.partner_player_id"
                        :options="partnerOptions"
                        emit-value
                        map-options
                        clearable
                        outlined
                        dense
                        bg-color="white"
                        placeholder="Buscar jogador cadastrado..."
                        use-input
                        fill-input
                        input-debounce="0"
                        @filter="(val, update) => update()"
                      />
                    </div>
                    <div v-if="!registrationForm.partner_player_id" class="q-gutter-y-xs">
                      <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
                        Ou informar nome do parceiro
                      </label>
                      <BtInput
                        v-model="registrationForm.partner_name"
                        placeholder="Nome completo do parceiro"
                      />
                    </div>
                  </div>
                </div>
              </template>

              <q-separator color="surface-100" />
            </template>

            <!-- Status e Pagamento -->
            <div>
              <h3 class="text-sm text-bold text-surface-900 q-mb-lg">{{ $t('stage_detail.section_registration') }}</h3>
              <div class="q-gutter-y-lg">
                <div class="q-gutter-y-xs">
                  <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
                    {{ $t('stage_detail.field_status') }}
                  </label>
                  <q-select
                    v-model="registrationForm.status"
                    :options="statusOptions"
                    outlined
                    dense
                    emit-value
                    map-options
                    bg-color="white"
                    lazy-rules
                    :rules="[(val) => !!val || $t('stage_detail.validation_status_required')]"
                  />
                </div>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-sm-6">
                    <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
                      {{ $t('stage_detail.field_paid_value') }}
                    </label>
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
                    <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
                      {{ $t('stage_detail.field_group_position') }}
                    </label>
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
                  <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
                    {{ $t('stage_detail.field_observations') }}
                  </label>
                  <q-input
                    v-model="registrationForm.observacoes"
                    type="textarea"
                    :placeholder="$t('stage_detail.field_observations_placeholder')"
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
            <q-btn flat :label="$t('common.cancel')" v-close-popup color="surface-500" no-caps class="text-bold" />
            <q-btn
              :label="$t('stage_detail.save_reg')"
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
            <div class="text-lg text-bold text-surface-900">{{ $t('stage_detail.dialog_change_status') }}</div>
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
import { useRoute, useRouter } from 'vue-router';
import { useLeagueStore } from 'src/stores/league';
import { usePlayerStore } from 'src/stores/player';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import PlayerChip from 'src/components/others/PlayerChip.vue';
import PageHeader from 'src/components/others/PageHeader.vue';
import { tipoLabel } from 'src/composables/useStageTypes';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const arenaId = route.params.id;
const leagueId = route.params.leagueId;
const stageId = route.params.stageId;
const leagueStore  = useLeagueStore();
const playerStore  = usePlayerStore();

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

const isClosed  = computed(() => stage.value?.stage_status === 'closed');
const isDupla   = computed(() => stage.value?.tipo === 'dupla-fixa');

const currentStageLabel = computed(() => {
  if (!stage.value) return 'Etapa';
  return `${tipoLabel(stage.value.tipo)} — ${formatDate(stage.value.data_etapa)}`;
});

const confirmedCount = computed(() => {
  return leagueStore.stageRegistrations.filter((r) => r.status === 'confirmed').length;
});

const statusSummary = computed(() => {
  const regs = leagueStore.stageRegistrations;
  return [
    {
      value: 'confirmed',
      label: t('stage_detail.status_confirmed'),
      count: regs.filter((r) => r.status === 'confirmed').length,
      chipColor: 'green-1',
      chipTextColor: 'green-9',
    },
    {
      value: 'pending',
      label: t('stage_detail.status_pending'),
      count: regs.filter((r) => r.status === 'pending').length,
      chipColor: 'orange-1',
      chipTextColor: 'orange-9',
    },
    {
      value: 'waitlist',
      label: t('stage_detail.status_waitlist'),
      count: regs.filter((r) => r.status === 'waitlist').length,
      chipColor: 'blue-1',
      chipTextColor: 'blue-9',
    },
    {
      value: 'cancelled',
      label: t('stage_detail.status_cancelled'),
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

const columns = computed(() => [
  { name: 'player', align: 'left', label: t('stage_detail.col_player'), field: 'player', sortable: true },
  { name: 'gender', align: 'left', label: t('stage_detail.col_gender'), field: (row) => row.player?.gender || row.gender },
  { name: 'level', align: 'left', label: t('stage_detail.col_level'), field: (row) => row.player?.level || row.level, sortable: true },
  { name: 'status', align: 'left', label: t('stage_detail.col_status'), field: 'status', sortable: true },
  { name: 'actions', align: 'center', label: t('stage_detail.col_actions') },
]);

const statusOptions = computed(() => [
  { label: t('stage_detail.status_label_pending'), value: 'pending' },
  { label: t('stage_detail.status_label_confirmed'), value: 'confirmed' },
  { label: t('stage_detail.status_label_waitlist'), value: 'waitlist' },
  { label: t('stage_detail.status_label_cancelled'), value: 'cancelled' },
]);

const genderOptions = computed(() => [
  { label: t('common.gender_male'), value: 'male' },
  { label: t('common.gender_female'), value: 'female' },
  { label: t('common.gender_other'), value: 'other' },
]);

const genderFilterOptions = computed(() => [
  { label: t('common.gender_male'), value: 'male' },
  { label: t('common.gender_female'), value: 'female' },
]);

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
  player_id: null,
  name: '',
  nickname: '',
  gender: 'male',
  level: 'Iniciante',
  whatsapp: '',
  partner_player_id: null,
  partner_name: '',
  status: 'pending',
  valor_pago: null,
  posicao_grupo: null,
  observacoes: '',
});

const partnerOptions = computed(() => {
  const registeredIds = new Set(
    leagueStore.stageRegistrations.flatMap((r) =>
      [r.player?.id, r.partner_player_id].filter(Boolean),
    ),
  );
  return playerStore.players
    .filter((p) => !registeredIds.has(p.id))
    .map((p) => ({ label: p.name + (p.nickname ? ` (${p.nickname})` : ''), value: p.id }));
});

onMounted(async () => {
  await leagueStore.fetchLeague(arenaId, leagueId);
  if (isClosed.value) {
    await leagueStore.fetchStageRanking(arenaId, leagueId, stageId);
  } else {
    await Promise.all([
      leagueStore.fetchStageRegistrations(arenaId, leagueId, stageId),
      playerStore.fetchPlayers(arenaId),
    ]);
  }
});

function openRegistrationDialog() {
  resetRegistrationForm();
  showDialog.value = true;
}

function resetRegistrationForm() {
  registrationForm.id               = null;
  registrationForm.player_id        = null;
  registrationForm.name             = '';
  registrationForm.nickname         = '';
  registrationForm.gender           = 'male';
  registrationForm.level            = 'Iniciante';
  registrationForm.whatsapp         = '';
  registrationForm.partner_player_id = null;
  registrationForm.partner_name     = '';
  registrationForm.status           = 'pending';
  registrationForm.valor_pago       = null;
  registrationForm.posicao_grupo    = null;
  registrationForm.observacoes      = '';
}

function editRegistration(reg) {
  registrationForm.id               = reg.id;
  registrationForm.player_id        = reg.player?.id ?? null;
  registrationForm.name             = reg.player?.name || '';
  registrationForm.nickname         = reg.player?.nickname || '';
  registrationForm.gender           = reg.player?.gender || 'male';
  registrationForm.level            = reg.player?.level || 'Iniciante';
  registrationForm.whatsapp         = reg.player?.whatsapp || '';
  registrationForm.partner_player_id = reg.partner_player_id ?? null;
  registrationForm.partner_name     = reg.partner_name || reg.partner?.name || '';
  registrationForm.status           = reg.status || 'pending';
  registrationForm.valor_pago       = reg.valor_pago ?? null;
  registrationForm.posicao_grupo    = reg.posicao_grupo ?? null;
  registrationForm.observacoes      = reg.observacoes || '';
  showDialog.value = true;
}

async function onSubmitRegistration() {
  saving.value = true;
  try {
    await leagueStore.saveStageRegistration(arenaId, leagueId, stageId, { ...registrationForm });
    $q.notify({
      type: 'positive',
      message: registrationForm.id ? t('stage_detail.notify_reg_updated') : t('stage_detail.notify_reg_created'),
      position: 'top',
      icon: 'check_circle',
    });
    showDialog.value = false;
  } catch {
    $q.notify({ type: 'negative', message: t('stage_detail.notify_reg_error_save'), position: 'top' });
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
      arenaId, leagueId, stageId, selectedRegistration.value.id, status,
    );
    $q.notify({ type: 'positive', message: t('stage_detail.notify_status_updated'), position: 'top', icon: 'check_circle' });
    showStatusDialog.value = false;
  } catch {
    $q.notify({ type: 'negative', message: t('stage_detail.notify_status_error'), position: 'top' });
  } finally {
    updatingStatus.value = false;
    pendingStatus.value = null;
  }
}

function confirmDeleteRegistration(reg) {
  const name = reg.player?.name || reg.name || 'este jogador';
  $q.dialog({
    title: t('stage_detail.confirm_delete_title'),
    message: t('stage_detail.confirm_delete_message', { name }),
    persistent: true,
    ok: { label: t('stage_detail.confirm_delete_ok'), color: 'negative', unelevated: true, noCaps: true },
    cancel: { label: t('common.cancel'), flat: true, color: 'surface-500', noCaps: true },
  }).onOk(async () => {
    try {
      await leagueStore.deleteStageRegistration(arenaId, leagueId, stageId, reg.id);
      $q.notify({ type: 'positive', message: t('stage_detail.notify_reg_deleted'), position: 'top', icon: 'check_circle' });
    } catch {
      $q.notify({ type: 'negative', message: t('stage_detail.notify_reg_error_delete'), position: 'top' });
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
    pending: t('stage_detail.status_label_pending'),
    confirmed: t('stage_detail.status_label_confirmed'),
    waitlist: t('stage_detail.status_label_waitlist'),
    cancelled: t('stage_detail.status_label_cancelled'),
  };
  return map[status] || status;
}

function getStatusBadge(status) {
  const map = {
    pending: { color: 'orange-1', textColor: 'orange-9', icon: 'schedule', btnColor: 'orange' },
    confirmed: { color: 'green-1', textColor: 'green-9', icon: 'check_circle', btnColor: 'positive' },
    waitlist: { color: 'blue-1', textColor: 'blue-9', icon: 'hourglass_empty', btnColor: 'info' },
    cancelled: { color: 'red-1', textColor: 'red-9', icon: 'cancel', btnColor: 'negative' },
  };
  return map[status] || { color: 'surface-100', textColor: 'surface-500', icon: 'help', btnColor: 'grey' };
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
  const d = new Date(date.replace(' ', 'T'));
  const dateStr = d.toLocaleDateString('pt-BR');
  const timePart = date.split(' ')[1];
  return timePart && timePart !== '00:00' ? `${dateStr} ${timePart}` : dateStr;
}

function srPosBadgeClass(pos) {
  if (pos === 1) return 'sr-pos-gold';
  if (pos === 2) return 'sr-pos-silver';
  if (pos === 3) return 'sr-pos-bronze';
  return 'sr-pos-default';
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

.block { display: block; }
.tracking-widest { letter-spacing: 0.08em; }

/* ── Stage ranking table ── */
.stage-ranking-header,
.stage-ranking-row {
  display: grid;
  grid-template-columns: 52px 1fr 56px 40px 40px 52px 40px 40px;
  align-items: center;
  padding: 7px 16px;
  gap: 4px;
}

.stage-ranking-header {
  background: #1b2e6e;
}

.stage-ranking-row {
  border-bottom: 1px solid var(--surface-100);
  transition: background 0.12s;
}
.stage-ranking-row:last-child { border-bottom: none; }
.stage-ranking-row:hover      { background: var(--surface-50); }

.sr-gold   { background: rgba(243, 112, 33, 0.04); }
.sr-silver { background: rgba(100, 116, 139, 0.04); }
.sr-bronze { background: rgba(180, 120, 60, 0.04); }

.srh {
  font-size: 0.58rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.srh-center { text-align: center; display: flex; justify-content: center; align-items: center; }
.srh-left   { text-align: left; }

.sr-pos-badge {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 99px;
}
.sr-pos-gold    { background: rgba(243, 112, 33, 0.12); color: #f37021; }
.sr-pos-silver  { background: rgba(100, 116, 139, 0.12); color: #64748b; }
.sr-pos-bronze  { background: rgba(180, 120, 60, 0.12); color: #b4783c; }
.sr-pos-default { background: var(--surface-100); color: var(--surface-500); }

.sr-player {
  display: flex;
  align-items: center;
  min-width: 0;
}

.sr-cell {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--surface-700);
  text-align: center;
}
.sr-cell--pts { font-size: 0.82rem; font-weight: 800; color: #1b2e6e; }
.sr-pos       { color: var(--q-positive); }
.sr-neg       { color: var(--q-negative); }
</style>
