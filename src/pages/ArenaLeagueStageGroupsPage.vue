<template>
  <q-page class="q-pa-lg">
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <template v-else>
      <PageHeader
        :title="`${$t('stage_groups.title_prefix')} — ${stageName}`"
        :subtitle="`${leagueStore.currentLeague?.nome ?? ''}${hasGroups ? ` · ${totalPlayers} jogadores · ${groups.length} grupos · ${$t('stage_groups.subtitle_format')}` : ''}`"
        :breadcrumbs="[
          { label: leagueStore.currentLeague?.nome || 'Liga', action: () => $router.back() },
          { label: stageName, action: goToStage },
          { label: $t('stage_groups.breadcrumb_groups') },
        ]"
        :back="goToStage"
      >
        <q-btn
          outline
          no-caps
          color="surface-700"
          icon="shuffle"
          :label="$t('stage_groups.btn_draw')"
          class="text-bold"
          :loading="drawing"
          @click="onDraw"
        />
        <q-btn
          color="orange"
          unelevated
          no-caps
          icon="star"
          :label="$t('stage_groups.btn_generate_finalists')"
          class="text-bold"
          :disable="!hasGroups"
          @click="onGenerateFinalists"
        />
        <q-btn
          v-if="leagueStore.stageFinalists.length > 0"
          color="primary"
          unelevated
          no-caps
          icon="emoji_events"
          :label="$t('stage_groups.btn_go_playoffs')"
          class="text-bold"
          @click="
            router.push({ name: 'stage-playoffs', params: { id: arenaId, leagueId, stageId } })
          "
        />
      </PageHeader>

      <!-- Info Strip -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-auto">
          <q-card class="border-surface-100 shadow-card">
            <q-card-section class="q-pa-md info-chip-section">
              <div class="text-xs text-surface-400 text-bold uppercase tracking-widest q-mb-xs">
                {{ $t('stage_groups.info_players') }}
              </div>
              <div class="text-xl text-bold text-primary">
                {{ hasGroups ? totalPlayers : leagueStore.stageRegistrations.length }}
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-auto">
          <q-card class="border-surface-100 shadow-card">
            <q-card-section class="q-pa-md info-chip-section">
              <div class="text-xs text-surface-400 text-bold uppercase tracking-widest q-mb-xs">
                {{ $t('stage_groups.info_groups') }}
              </div>
              <div class="text-xl text-bold text-primary">{{ groups.length }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-auto">
          <q-card class="border-surface-100 shadow-card">
            <q-card-section class="q-pa-md info-chip-section">
              <div class="text-xs text-surface-400 text-bold uppercase tracking-widest q-mb-xs">
                {{ $t('stage_groups.info_matches_played') }}
              </div>
              <div class="text-xl text-bold" style="color: #f37021">
                {{ completedMatches
                }}<span class="text-sm text-surface-400 font-normal"> / {{ totalMatches }}</span>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-auto" style="min-width: 190px">
          <q-card class="border-surface-100 shadow-card">
            <q-card-section class="q-pa-md info-chip-section">
              <div class="text-xs text-surface-400 text-bold uppercase tracking-widest q-mb-sm">
                {{ $t('stage_groups.info_progress') }}
              </div>
              <div class="row items-center q-gutter-sm">
                <q-linear-progress
                  :value="progress"
                  color="orange"
                  track-color="surface-100"
                  rounded
                  style="flex: 1; height: 6px"
                />
                <span class="text-sm text-bold" style="color: #f37021; min-width: 36px">
                  {{ Math.round(progress * 100) }}%
                </span>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-auto">
          <q-card class="border-surface-100 shadow-card">
            <q-card-section class="q-pa-md info-chip-section">
              <div class="text-xs text-surface-400 text-bold uppercase tracking-widest q-mb-xs">
                {{ $t('stage_groups.info_format') }}
              </div>
              <div class="text-sm text-bold text-positive">
                {{ $t('stage_groups.subtitle_format') }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!hasGroups" class="text-center q-pa-xl">
        <q-icon name="grid_view" size="72px" color="surface-200" class="q-mb-md" />
        <div class="text-lg text-bold text-surface-400 q-mb-sm">
          {{ $t('stage_groups.empty_title') }}
        </div>
        <div class="text-sm text-surface-300 q-mb-lg">
          {{
            leagueStore.stageRegistrations.length < 4
              ? $t('stage_groups.empty_min_players')
              : $t('stage_groups.empty_click_draw')
          }}
        </div>
        <q-btn
          v-if="leagueStore.stageRegistrations.length >= 4"
          color="primary"
          unelevated
          icon="shuffle"
          :label="$t('stage_groups.btn_draw')"
          no-caps
          class="text-bold q-px-xl"
          @click="onDraw"
        />
      </div>

      <!-- Groups Grid -->
      <div v-else class="row q-col-gutter-lg">
        <div v-for="(group, idx) in groups" :key="group.letter" class="col-12 col-lg-6">
          <q-card class="border-surface-100 shadow-card overflow-hidden group-card">
            <!-- Header -->
            <div class="row items-center justify-between q-pa-md">
              <div class="row items-center q-gutter-sm">
                <div
                  class="group-badge"
                  :style="{ background: groupColors[idx % groupColors.length] }"
                >
                  {{ group.letter }}
                </div>
                <div>
                  <div class="text-sm text-bold text-surface-900">
                    {{ $t('stage_groups.group_label', { letter: group.letter }) }}
                  </div>
                  <div class="text-xs text-surface-400">
                    {{
                      $t('stage_groups.group_info', {
                        players: group.players.length,
                        matches: group.matches.length,
                      })
                    }}
                  </div>
                </div>
              </div>
              <!-- Progress dots -->
              <div class="row q-gutter-xs items-center">
                <div
                  v-for="match in group.matches"
                  :key="match.id"
                  class="progress-dot"
                  :class="{ done: match.score_p !== null && match.score_q !== null }"
                />
              </div>
            </div>

            <!-- Ranking -->
            <div class="ranking-section">
              <div class="ranking-header">
                <span class="rh-pos rh">{{ $t('stage_groups.col_pos') }}</span>
                <span class="rh-name rh">{{ $t('stage_groups.col_player') }}</span>
                <span class="rh-cell rh">{{ $t('stage_groups.col_pts') }}</span>
                <span class="rh-cell rh">{{ $t('stage_groups.col_sg') }}</span>
                <span class="rh-cell rh">{{ $t('stage_groups.col_gp') }}</span>
                <span class="rh-cell rh">{{ $t('stage_groups.col_gc') }}</span>
                <span class="rh-cell rh">{{ $t('stage_groups.col_jg') }}</span>
              </div>
              <div
                v-for="(player, pi) in calcRanking(group.players, group.matches)"
                :key="player.id"
                class="ranking-row"
                :class="{ 'ranking-row-first': pi === 0 }"
              >
                <span class="rr-pos" :class="{ 'rr-gold': pi === 0, 'rr-silver': pi === 1 }">
                  {{ pi + 1 }}
                </span>
                <div class="rr-name-cell">
                  <div class="player-mini-av" :style="{ background: player.color }">
                    {{ getInitial(player.name) }}
                  </div>
                  <span class="rr-name">
                    {{ player.name }}
                    <span v-if="player.partner_name"> / {{ player.partner_name }}</span>
                  </span>
                </div>
                <span class="rr-cell rr-pts">{{ player.pts }}</span>
                <span
                  class="rr-cell"
                  :class="{ 'rr-pos-val': player.sg > 0, 'rr-neg-val': player.sg < 0 }"
                >
                  {{ player.sg > 0 ? '+' : '' }}{{ player.sg }}
                </span>
                <span class="rr-cell">{{ player.gp }}</span>
                <span class="rr-cell">{{ player.gc }}</span>
                <span class="rr-cell">{{ player.jg }}</span>
              </div>
            </div>

            <!-- Matches -->
            <div>
              <div class="match-header-row group-card-border-bottom bg-blue-grey-5">
                <span class="col-team mh-text text-white" style="text-align: left">{{
                  $t('stage_groups.col_team_a')
                }}</span>
                <span class="col-score mh-text text-white">-</span>
                <span class="col-vs" />
                <span class="col-score mh-text text-white">-</span>
                <span class="col-team mh-text text-white" style="text-align: right">{{
                  $t('stage_groups.col_team_b')
                }}</span>
              </div>

              <div
                v-for="match in group.matches"
                :key="match.id"
                class="match-row group-card-border-bottom"
              >
                <div class="col-team match-chips">
                  <PlayerChip
                    v-for="player in match.d1"
                    :key="player.id"
                    :name="player.name"
                    :partner="player.partner_name || null"
                    :color="player.color"
                  />
                </div>
                <div class="col-score">
                  <BtInput
                    type="number"
                    :model-value="match.score_p ?? ''"
                    dense outlined hide-bottom-space no-error-icon
                    :class="['score-field', getScoreClass(match, 'p')]"
                    input-class="score-inner"
                    placeholder="—"
                    min="0" max="7"
                    @update:model-value="setMatchScore(match, 'score_p', $event)"
                    @blur="onScoreBlur(group, match)"
                  />
                </div>
                <span class="col-vs mr-vs">×</span>
                <div class="col-score">
                  <BtInput
                    type="number"
                    :model-value="match.score_q ?? ''"
                    dense outlined hide-bottom-space no-error-icon
                    :class="['score-field', getScoreClass(match, 'q')]"
                    input-class="score-inner"
                    placeholder="—"
                    min="0" max="7"
                    @update:model-value="setMatchScore(match, 'score_q', $event)"
                    @blur="onScoreBlur(group, match)"
                  />
                </div>
                <div class="col-team match-chips match-chips-right">
                  <PlayerChip
                    v-for="player in match.d2"
                    :key="player.id"
                    :name="player.name"
                    :partner="player.partner_name || null"
                    :color="player.color"
                  />
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </div>

      <!-- Finalists Section -->
      <div v-if="leagueStore.stageFinalists.length" class="q-mt-xl">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="text-sm text-bold text-surface-500 uppercase tracking-widest">
              {{ $t('stage_groups.finalists_title') }}
            </div>
            <div class="text-xs text-surface-400 q-mt-xs">
              {{
                $t('stage_groups.finalists_subtitle', { count: leagueStore.stageFinalists.length })
              }}
            </div>
          </div>
          <q-btn
            flat
            dense
            no-caps
            icon="refresh"
            :label="$t('stage_groups.btn_redo_finalists')"
            color="surface-400"
            size="sm"
            @click="onGenerateFinalists"
          />
        </div>

        <q-card class="border-surface-100 shadow-card overflow-hidden">
          <div class="finalist-table-header">
            <span class="fth">{{ $t('stage_groups.col_group') }}</span>
            <span class="fth fth-left">{{ $t('stage_groups.col_player') }}</span>
            <span class="fth">{{ $t('stage_groups.col_pos') }}</span>
            <span class="fth">{{ $t('stage_groups.col_pts') }}</span>
            <span class="fth">{{ $t('stage_groups.col_sg') }}</span>
            <span class="fth">{{ $t('stage_groups.col_gp') }}</span>
            <span class="fth">{{ $t('stage_groups.col_gc') }}</span>
          </div>

          <div v-for="f in sortedFinalists" :key="f.registration_id" class="finalist-table-row">
            <div class="ft-center">
              <div
                class="finalist-group-badge"
                :style="{
                  background:
                    groupColors[groupLetters.indexOf(f.group_letter) % groupColors.length],
                }"
              >
                {{ f.group_letter }}
              </div>
            </div>
            <div class="rr-name-cell">
              <div class="player-mini-av" :style="{ background: f.player?.color || '#64748b' }">
                {{ getInitial(f.player?.name || '') }}
              </div>
              <span class="rr-name">
                {{ f.player?.name || '—' }}
                <span v-if="f.player?.partner_name" class="rr-partner"> / {{ f.player.partner_name }}</span>
              </span>
            </div>
            <div class="ft-center">
              <span
                class="finalist-pos-chip"
                :class="
                  f.group_position === 1
                    ? 'pos-gold'
                    : f.group_position === 2
                      ? 'pos-silver'
                      : 'pos-default'
                "
              >
                {{ f.group_position }}°
              </span>
            </div>
            <span class="ft-center finalist-pts">{{ f.pts }}</span>
            <span
              class="ft-center rr-cell"
              :class="f.saldo_games > 0 ? 'rr-pos-val' : f.saldo_games < 0 ? 'rr-neg-val' : ''"
            >
              {{ f.saldo_games > 0 ? '+' : '' }}{{ f.saldo_games }}
            </span>
            <span class="ft-center rr-cell">{{ f.gp }}</span>
            <span class="ft-center rr-cell">{{ f.gc }}</span>
          </div>
        </q-card>
      </div>
    </template>
  </q-page>

  <!-- ── Finalist Generation Dialog ── -->
  <q-dialog v-model="finalistDialog" persistent backdrop-filter="blur(8px)">
    <q-card class="radius-xl shadow-xl overflow-hidden" style="width: 520px; max-width: 95vw">
      <!-- Step 1 -->
      <template v-if="finalistStep === 1">
        <q-card-section class="row items-center q-pa-xl bg-surface-50">
          <q-avatar icon="star" color="orange" text-color="white" class="shadow-md" />
          <div class="column q-ml-md">
            <div class="text-xl text-bold text-surface-900">
              {{ $t('stage_groups.dialog_finalists_title') }}
            </div>
            <div class="text-xs text-surface-400">
              {{
                isDupla
                  ? $t('stage_groups.dialog_step1_subtitle_dupla', { groups: groups.length, players: totalPlayers })
                  : $t('stage_groups.dialog_step1_subtitle', { groups: groups.length, players: totalPlayers })
              }}
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
        </q-card-section>
        <q-separator color="surface-100" />
        <q-card-section class="q-pa-xl">
          <div class="text-sm text-surface-700 q-mb-lg">
            {{ isDupla ? $t('stage_groups.step1_question_dupla') : $t('stage_groups.step1_question') }}
          </div>
          <div class="row items-center q-gutter-md">
            <q-btn round flat icon="remove" color="surface-400" @click="decrementCount" />
            <div
              class="text-4xl text-bold text-primary"
              style="min-width: 60px; text-align: center"
            >
              {{ classifyCount }}
            </div>
            <q-btn round flat icon="add" color="primary" @click="incrementCount" />
          </div>
          <div class="text-xs text-surface-400 q-mt-md">
            {{
              isDupla
                ? $t('stage_groups.step1_hint_dupla', { max: totalPlayers })
                : $t('stage_groups.step1_hint', { max: totalPlayers })
            }}
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-xl bg-surface-50 border-surface-100">
          <q-btn
            flat
            :label="$t('common.cancel')"
            v-close-popup
            color="surface-500"
            no-caps
            class="text-bold"
          />
          <q-btn
            :label="$t('stage_groups.btn_continue')"
            color="primary"
            unelevated
            no-caps
            icon-right="arrow_forward"
            class="q-px-xl text-bold"
            @click="processRankings"
          />
        </q-card-actions>
      </template>

      <!-- Step 2 - Tie resolution -->
      <template v-else-if="finalistStep === 2 && currentTie">
        <q-card-section
          class="q-pa-xl"
          style="background: rgba(250, 184, 24, 0.08); border-bottom: 2px solid #fab818"
        >
          <div class="row items-center q-gutter-sm">
            <q-icon name="warning" color="warning" size="22px" />
            <div>
              <div class="text-base text-bold text-surface-900">
                {{ $t('stage_groups.tie_title', { letter: currentTie.group.letter }) }}
              </div>
              <div class="text-xs text-surface-400">
                {{
                  $t(isDupla ? 'stage_groups.tie_subtitle_dupla' : 'stage_groups.tie_subtitle', {
                    count: currentTie.block.length,
                    pts: currentTie.block[0]?.pts,
                    sg: (currentTie.block[0]?.sg >= 0 ? '+' : '') + currentTie.block[0]?.sg,
                    gp: currentTie.block[0]?.gp,
                    from: currentTie.startPos + 1,
                    to: currentTie.startPos + currentTie.block.length,
                  })
                }}
              </div>
            </div>
            <q-space />
            <div class="text-xs text-surface-400">
              {{
                $t('stage_groups.tie_counter', {
                  current: currentTieIdx + 1,
                  total: tieGroups.length,
                })
              }}
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pa-xl">
          <div class="text-xs text-surface-400 q-mb-md">
            {{ isDupla ? $t('stage_groups.tie_instruction_dupla') : $t('stage_groups.tie_instruction') }}
          </div>
          <div class="q-gutter-y-sm">
            <div
              v-for="(player, i) in currentTie.resolvedOrder"
              :key="player.id"
              class="row items-center q-pa-sm radius-md tie-player-row"
              :class="
                currentTie.startPos + i < Math.ceil(classifyCount / (groups.length || 1))
                  ? 'tie-qualifies'
                  : 'tie-eliminated'
              "
            >
              <div
                class="text-xs text-bold text-surface-400 q-mr-sm"
                style="min-width: 18px; text-align: center"
              >
                {{ currentTie.startPos + i + 1 }}°
              </div>
              <div class="col row items-center q-gutter-sm">
                <div class="player-chip-avatar" :style="{ background: player.color }">
                  {{ getInitial(player.name) }}
                </div>
                <span class="text-sm text-bold text-surface-900">
                  {{ player.name }}
                  <span v-if="player.partner_name" class="text-surface-500 text-xs text-normal">
                    / {{ player.partner_name }}</span
                  >
                </span>
              </div>
              <q-chip
                :color="
                  currentTie.startPos + i < Math.ceil(classifyCount / (groups.length || 1))
                    ? 'positive'
                    : 'surface-100'
                "
                :text-color="
                  currentTie.startPos + i < Math.ceil(classifyCount / (groups.length || 1))
                    ? 'white'
                    : 'surface-400'
                "
                dense
                class="text-xs text-bold q-mr-sm"
              >
                {{
                  currentTie.startPos + i < Math.ceil(classifyCount / (groups.length || 1))
                    ? $t('stage_groups.chip_qualifies')
                    : $t('stage_groups.chip_eliminated')
                }}
              </q-chip>
              <div class="column q-gutter-none">
                <q-btn
                  flat
                  round
                  icon="keyboard_arrow_up"
                  size="xs"
                  color="surface-500"
                  :disable="i === 0"
                  @click="moveTied(i, -1)"
                />
                <q-btn
                  flat
                  round
                  icon="keyboard_arrow_down"
                  size="xs"
                  color="surface-500"
                  :disable="i === currentTie.resolvedOrder.length - 1"
                  @click="moveTied(i, 1)"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-xl bg-surface-50 border-surface-100">
          <q-btn
            flat
            :label="$t('common.cancel')"
            v-close-popup
            color="surface-500"
            no-caps
            class="text-bold"
          />
          <q-btn
            :label="$t('stage_groups.btn_confirm')"
            color="warning"
            unelevated
            no-caps
            icon-right="arrow_forward"
            class="q-px-xl text-bold"
            @click="nextTie"
          />
        </q-card-actions>
      </template>

      <!-- Step 3 - Summary -->
      <template v-else-if="finalistStep === 3">
        <q-card-section class="row items-center q-pa-xl bg-surface-50">
          <q-avatar icon="check_circle" color="positive" text-color="white" class="shadow-md" />
          <div class="column q-ml-md">
            <div class="text-xl text-bold text-surface-900">
              {{ $t('stage_groups.dialog_confirm_finalists') }}
            </div>
            <div class="text-xs text-surface-400">
              {{
                isDupla
                  ? $t('stage_groups.dialog_confirm_subtitle_dupla', { count: finalistList.length })
                  : $t('stage_groups.dialog_confirm_subtitle', { count: finalistList.length })
              }}
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
        </q-card-section>
        <q-separator color="surface-100" />
        <q-card-section class="q-pa-xl" style="max-height: 420px; overflow-y: auto">
          <template
            v-for="pos in [...new Set(finalistList.map((f) => f.group_position))].sort()"
            :key="pos"
          >
            <div
              class="text-xs text-bold text-surface-400 uppercase tracking-widest q-mb-sm"
              :class="pos > 1 ? 'q-mt-lg' : ''"
            >
              {{ $t('stage_groups.group_position_label', { pos }) }}
            </div>
            <div
              v-for="f in finalistList.filter((x) => x.group_position === pos)"
              :key="f.registration_id"
              class="row items-center q-py-sm q-px-md radius-md q-mb-xs finalist-summary-row"
            >
              <div
                class="finalist-group-badge q-mr-sm"
                :style="{
                  background:
                    groupColors[groupLetters.indexOf(f.group_letter) % groupColors.length],
                }"
              >
                {{ f.group_letter }}
              </div>
              <div class="player-chip-avatar q-mr-sm" :style="{ background: f.color }">
                {{ getInitial(f.name) }}
              </div>
              <div class="col">
                <div class="text-sm text-bold text-surface-900">{{ f.name }}</div>
                <div v-if="f.partner_name" class="text-xs text-surface-400">/ {{ f.partner_name }}</div>
              </div>
              <div class="row q-gutter-md text-center">
                <div>
                  <div class="text-xs text-surface-400">PTS</div>
                  <div class="text-sm text-bold text-primary">{{ f.pts }}</div>
                </div>
                <div>
                  <div class="text-xs text-surface-400">SG</div>
                  <div
                    class="text-sm text-bold"
                    :class="
                      f.sg > 0 ? 'text-positive' : f.sg < 0 ? 'text-negative' : 'text-surface-500'
                    "
                  >
                    {{ f.sg > 0 ? '+' : '' }}{{ f.sg }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-xl bg-surface-50 border-surface-100">
          <q-btn
            flat
            :label="$t('common.back')"
            color="surface-500"
            no-caps
            class="text-bold"
            @click="finalistStep = 1"
          />
          <q-btn
            :label="$t('stage_groups.btn_save_finalists')"
            color="positive"
            unelevated
            no-caps
            icon="save"
            class="q-px-xl text-bold shadow-md"
            :loading="savingFinalists"
            @click="saveFinalists"
          />
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLeagueStore } from 'src/stores/league';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import PlayerChip from 'src/components/others/PlayerChip.vue';
import PageHeader from 'src/components/others/PageHeader.vue';
import { tipoLabel } from 'src/composables/useStageTypes';


const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const leagueStore = useLeagueStore();
const { t } = useI18n();

const arenaId = route.params.id;
const leagueId = route.params.leagueId;
const stageId = route.params.stageId;

const loading = ref(false);
const drawing = ref(false);

const finalistDialog = ref(false);
const finalistStep = ref(1);
const classifyCount = ref(2);
const tieGroups = ref([]);
const currentTieIdx = ref(0);
const finalistList = ref([]);
const savingFinalists = ref(false);

const currentTie = computed(() => tieGroups.value[currentTieIdx.value] || null);
const groupLetters = computed(() => groups.value.map((g) => g.letter));

const sortedFinalists = computed(() =>
  [...leagueStore.stageFinalists].sort(
    (a, b) => a.group_position - b.group_position || b.pts - a.pts || b.saldo_games - a.saldo_games,
  ),
);

const groupColors = ['#F37021', '#1B2E6E', '#3AAA35', '#FAB818'];

const groups = computed(() => leagueStore.stageGroups);

const stage = computed(
  () => leagueStore.stages.find((s) => String(s.id) === String(stageId)) || null,
);

const isDupla = computed(() => stage.value?.tipo === 'dupla-fixa');

const stageName = computed(() => {
  if (!stage.value) return 'Etapa';
  return `${tipoLabel(stage.value.tipo)} — ${formatDate(stage.value.data_etapa)}`;
});

const hasGroups = computed(() => groups.value.length > 0);
const totalPlayers = computed(() => groups.value.reduce((acc, g) => acc + g.players.length, 0));
const totalMatches = computed(() => groups.value.reduce((acc, g) => acc + g.matches.length, 0));
const completedMatches = computed(() =>
  groups.value.reduce(
    (acc, g) => acc + g.matches.filter((m) => m.score_p !== null && m.score_q !== null).length,
    0,
  ),
);
const progress = computed(() =>
  totalMatches.value > 0 ? completedMatches.value / totalMatches.value : 0,
);

onMounted(async () => {
  loading.value = true;
  try {
    await leagueStore.fetchLeague(arenaId, leagueId);
    await Promise.all([
      leagueStore.fetchStageRegistrations(arenaId, leagueId, stageId),
      leagueStore.fetchStageGroups(arenaId, leagueId, stageId),
      leagueStore.fetchStageFinalists(arenaId, leagueId, stageId),
    ]);
  } finally {
    loading.value = false;
  }
});

function onDraw() {
  const regs = leagueStore.stageRegistrations;
  if (regs.length < 4) {
    $q.notify({
      type: 'warning',
      message: t('stage_groups.notify_min_players_warning'),
      position: 'top',
    });
    return;
  }
  $q.dialog({
    title: t('stage_groups.dialog_draw_title'),
    message: hasGroups.value
      ? t('stage_groups.dialog_draw_reset_message')
      : t('stage_groups.dialog_draw_message', {
          count: regs.length,
          size: stage.value?.jogadores_por_grupo || 4,
        }),
    ok: { label: t('stage_groups.btn_draw_ok'), color: 'primary', unelevated: true, noCaps: true },
    cancel: { label: t('common.cancel'), flat: true, color: 'surface-500', noCaps: true },
  }).onOk(async () => {
    drawing.value = true;
    try {
      await leagueStore.drawStageGroups(arenaId, leagueId, stageId);
      $q.notify({
        type: 'positive',
        message: t('stage_groups.notify_drawn'),
        position: 'top',
        icon: 'check_circle',
      });
    } catch {
      $q.notify({
        type: 'negative',
        message: t('stage_groups.notify_draw_error'),
        position: 'top',
      });
    } finally {
      drawing.value = false;
    }
  });
}

function setMatchScore(match, side, rawValue) {
  const num = rawValue === '' || rawValue === null ? null : parseInt(rawValue);
  match[side] = isNaN(num) ? null : num;
}

function isValidResult(p, q) {
  if (p === null || q === null) return true;
  if (p === 6 && q >= 0 && q <= 4) return true;
  if (q === 6 && p >= 0 && p <= 4) return true;
  if (p === 7 && (q === 5 || q === 6)) return true;
  if (q === 7 && (p === 5 || p === 6)) return true;
  return false;
}

async function onScoreBlur(group, match) {
  const p = match.score_p;
  const q = match.score_q;

  if (p === null || q === null) return;

  if (!isValidResult(p, q)) {
    $q.notify({ type: 'negative', message: t('stage_groups.notify_invalid_score'), position: 'top' });
    match.score_p = null;
    match.score_q = null;
    return;
  }

  try {
    await leagueStore.updateMatchScore(arenaId, leagueId, stageId, group.id, match.id, { score_p: p, score_q: q });
  } catch {
    $q.notify({ type: 'negative', message: t('stage_groups.notify_score_error'), position: 'top' });
    await leagueStore.fetchStageGroups(arenaId, leagueId, stageId);
  }
}

function calcRanking(players, matches) {
  const stats = {};
  players.forEach((p) => {
    stats[p.id] = { jg: 0, pts: 0, gp: 0, gc: 0 };
  });
  matches.forEach((m) => {
    if (m.score_p === null || m.score_q === null) return;
    const p = m.score_p || 0;
    const q = m.score_q || 0;
    (m.d1 || []).forEach((pl) => {
      stats[pl.id].jg++;
      stats[pl.id].gp += p;
      stats[pl.id].gc += q;
      if (p > q) stats[pl.id].pts++;
    });
    (m.d2 || []).forEach((pl) => {
      stats[pl.id].jg++;
      stats[pl.id].gp += q;
      stats[pl.id].gc += p;
      if (q > p) stats[pl.id].pts++;
    });
  });
  return players
    .map((pl) => ({
      ...pl,
      ...stats[pl.id],
      sg: (stats[pl.id]?.gp || 0) - (stats[pl.id]?.gc || 0),
    }))
    .sort((a, b) => b.pts - a.pts || b.sg - a.sg || b.gp - a.gp);
}

function getScoreClass(match, side) {
  if (match.score_p === null || match.score_q === null) return '';
  const p = match.score_p || 0;
  const q = match.score_q || 0;
  if (side === 'p') return p > q ? 'win' : p < q ? 'lose' : '';
  return q > p ? 'win' : q < p ? 'lose' : '';
}

function onGenerateFinalists() {
  if (!hasGroups.value) {
    $q.notify({
      type: 'warning',
      message: t('stage_groups.notify_generate_warning'),
      position: 'top',
    });
    return;
  }
  const raw = stage.value?.classificam_total || totalPlayers.value;
  const snapped = raw % 2 === 0 ? raw : raw - 1;
  classifyCount.value = Math.min(Math.max(4, snapped), totalPlayers.value);
  tieGroups.value = [];
  currentTieIdx.value = 0;
  finalistList.value = [];
  finalistStep.value = 1;
  finalistDialog.value = true;
}

function decrementCount() {
  classifyCount.value = Math.max(isDupla.value ? 2 : 4, classifyCount.value - 2);
}
function incrementCount() {
  classifyCount.value = Math.min(totalPlayers.value, classifyCount.value + 2);
}

function processRankings() {
  const ties = [];
  for (const group of groups.value) {
    const ranking = calcRanking(group.players, group.matches);
    let i = 0;
    while (i < ranking.length) {
      let j = i + 1;
      while (
        j < ranking.length &&
        ranking[j].pts === ranking[i].pts &&
        ranking[j].sg === ranking[i].sg &&
        ranking[j].gp === ranking[i].gp
      ) {
        j++;
      }
      const perGroupCut = Math.ceil(classifyCount.value / (groups.value.length || 1));
      if (j - i >= 2 && i < perGroupCut) {
        ties.push({
          group,
          block: ranking.slice(i, j),
          startPos: i,
          resolvedOrder: [...ranking.slice(i, j)],
          fullRanking: ranking,
        });
      }
      i = j;
    }
  }
  if (ties.length) {
    tieGroups.value = ties;
    currentTieIdx.value = 0;
    finalistStep.value = 2;
  } else {
    buildFinalistList();
    finalistStep.value = 3;
  }
}

function moveTied(i, dir) {
  const order = currentTie.value.resolvedOrder;
  const j = i + dir;
  if (j < 0 || j >= order.length) return;
  [order[i], order[j]] = [order[j], order[i]];
}

function nextTie() {
  if (currentTieIdx.value < tieGroups.value.length - 1) {
    currentTieIdx.value++;
  } else {
    buildFinalistList();
    finalistStep.value = 3;
  }
}

function applyTieResolutions(ranking, groupId) {
  const groupTies = tieGroups.value
    .filter((t) => t.group.id === groupId)
    .sort((a, b) => b.startPos - a.startPos);
  const result = [...ranking];
  for (const tie of groupTies) {
    result.splice(tie.startPos, tie.block.length, ...tie.resolvedOrder);
  }
  return result;
}

function buildFinalistList() {
  const all = [];
  for (const group of groups.value) {
    const ranking = calcRanking(group.players, group.matches);
    const finalRanking = applyTieResolutions(ranking, group.id);
    finalRanking.forEach((p, i) => {
      all.push({
        registration_id: p.registration_id ?? p.id,
        group_id: group.id,
        group_letter: group.letter,
        group_position: i + 1,
        name: p.name,
        partner_name: p.partner_name || null,
        color: p.color,
        pts: p.pts ?? 0,
        gp: p.gp ?? 0,
        gc: p.gc ?? 0,
        sg: p.sg ?? 0,
      });
    });
  }
  all.sort(
    (a, b) => a.group_position - b.group_position || b.pts - a.pts || b.sg - a.sg || b.gp - a.gp,
  );
  finalistList.value = all.slice(0, classifyCount.value);
}

async function saveFinalists() {
  savingFinalists.value = true;
  try {
    const payload = finalistList.value.map((f) => ({
      registration_id: f.registration_id,
      group_id: f.group_id,
      group_position: f.group_position,
      pts: f.pts,
      gp: f.gp,
      gc: f.gc,
    }));
    await leagueStore.saveStageFinalists(arenaId, leagueId, stageId, payload);
    finalistDialog.value = false;
    $q.notify({
      type: 'positive',
      message: t('stage_groups.notify_finalists_saved'),
      position: 'top',
      icon: 'check_circle',
    });
  } catch {
    $q.notify({
      type: 'negative',
      message: t('stage_groups.notify_finalists_error'),
      position: 'top',
    });
  } finally {
    savingFinalists.value = false;
  }
}

function getInitial(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return (parts[parts.length - 1]?.charAt(0) || name.charAt(0)).toUpperCase();
}

function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('pt-BR');
}

function goToStage() {
  router.push({ name: 'stage-detail', params: { id: arenaId, leagueId, stageId } });
}
</script>

<style scoped>
.tracking-widest {
  letter-spacing: 0.08em;
}
.text-2xl {
  font-size: 1.5rem;
}
.hover-primary:hover {
  color: var(--q-primary);
}
.info-chip-section {
  min-width: 110px;
}
.group-card {
  border-radius: 14px !important;
}
.group-card-border-bottom {
  border-bottom: 1px solid var(--surface-100);
}
.group-badge {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}
.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--surface-200);
  transition: background 0.2s;
}
.progress-dot.done {
  background: var(--q-positive);
}
.player-chip-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  flex-shrink: 0;
}
.match-header-row,
.match-row {
  display: grid;
  grid-template-columns: 1fr 48px 16px 48px 1fr;
  gap: 0;
  padding: 7px 16px;
  align-items: center;
}
.match-row {
  border-bottom: 1px solid var(--surface-100);
  transition: background 0.12s;
  padding-top: 8px;
  padding-bottom: 8px;
}
.match-row:last-child {
  border-bottom: none;
}
.match-row:hover {
  background: var(--surface-50);
}
.col-score {
  display: flex;
  justify-content: center;
}
.col-vs {
  text-align: center;
}
.mh-text {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.match-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.match-chips-right {
  justify-content: flex-end;
}
.mr-vs {
  text-align: center;
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--surface-300);
}
.score-field {
  width: 48px;
}
.score-field :deep(.q-field__control) {
  height: 30px;
  min-height: 30px;
  border-radius: 6px;
  padding: 0;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}
.score-field :deep(.q-field__control::before) {
  border-color: var(--surface-200);
}
.score-field :deep(.q-field__control::after) {
  border-width: 0;
}
.score-field :deep(.q-field__native),
.score-field :deep(.score-inner) {
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1b2e6e;
  padding: 0 4px;
  min-height: unset;
  -moz-appearance: textfield;
}
.score-field :deep(input::-webkit-inner-spin-button),
.score-field :deep(input::-webkit-outer-spin-button) {
  -webkit-appearance: none;
}
.score-field :deep(.q-field__control:focus-within::before) {
  border-color: #1b2e6e;
  box-shadow: 0 0 0 3px rgba(27, 46, 110, 0.1);
}
.score-field.win :deep(.q-field__control::before) {
  border-color: var(--q-positive);
}
.score-field.win :deep(.q-field__control) {
  background: rgba(58, 170, 53, 0.05);
}
.score-field.win :deep(.q-field__native) {
  color: var(--q-positive);
}
.score-field.lose :deep(.q-field__control::before) {
  border-color: var(--q-negative);
}
.score-field.lose :deep(.q-field__control) {
  background: rgba(239, 68, 68, 0.04);
}
.score-field.lose :deep(.q-field__native) {
  color: var(--q-negative);
}
.ranking-section {
  border-top: 2px solid var(--surface-100);
}
.ranking-header,
.ranking-row {
  display: grid;
  grid-template-columns: 24px 1fr 44px 36px 36px 36px 36px;
  gap: 4px;
  padding: 7px 16px;
  align-items: center;
}
.ranking-header {
  background: #1b2e6e;
}
.rh {
  font-size: 0.58rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  text-align: center;
}
.rh-pos {
  text-align: center;
}
.rh-name {
  text-align: left;
}
.rh-cell {
  text-align: center;
}
.ranking-row {
  border-bottom: 1px solid var(--surface-100);
  transition: background 0.12s;
}
.ranking-row:last-child {
  border-bottom: none;
}
.ranking-row:hover {
  background: var(--surface-50);
}
.ranking-row-first {
  background: rgba(243, 112, 33, 0.04);
}
.rr-pos {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--surface-400);
  text-align: center;
}
.rr-gold {
  color: #f37021;
}
.rr-silver {
  color: var(--surface-500);
}
.rr-name-cell {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
}
.player-mini-av {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  flex-shrink: 0;
}
.rr-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--surface-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rr-partner {
  color: var(--surface-400);
  font-weight: 400;
  font-size: 0.7rem;
}
.rr-cell {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--surface-700);
  text-align: center;
}
.rr-pts {
  color: #1b2e6e;
  font-size: 0.8rem;
  font-weight: 800;
}
.rr-pos-val {
  color: var(--q-positive);
}
.rr-neg-val {
  color: var(--q-negative);
}
.finalist-table-header,
.finalist-table-row {
  display: grid;
  grid-template-columns: 44px 1fr 44px 48px 40px 40px 40px;
  gap: 4px;
  padding: 7px 16px;
  align-items: center;
}
.finalist-table-header {
  background: #1b2e6e;
}
.fth {
  font-size: 0.58rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  text-align: center;
}
.fth-left {
  text-align: left;
}
.finalist-table-row {
  border-bottom: 1px solid var(--surface-100);
  transition: background 0.12s;
}
.finalist-table-row:last-child {
  border-bottom: none;
}
.finalist-table-row:hover {
  background: var(--surface-50);
}
.ft-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.finalist-pts {
  font-size: 0.8rem;
  font-weight: 800;
  color: #1b2e6e;
}
.finalist-pos-chip {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 99px;
}
.pos-gold {
  color: #f37021;
}
.pos-silver {
  color: var(--surface-500);
}
.pos-default {
  color: var(--surface-400);
}
.finalist-group-badge {
  width: 22px;
  height: 22px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}
.finalist-summary-row {
  background: var(--surface-50);
  border: 1px solid var(--surface-100);
}
.text-base {
  font-size: 0.9375rem;
}
.tie-player-row {
  border: 1.5px solid var(--surface-200);
  border-radius: 10px;
  transition: all 0.15s;
}
.tie-qualifies {
  border-color: var(--q-positive);
  background: rgba(58, 170, 53, 0.04);
}
.tie-eliminated {
  opacity: 0.65;
}
.radius-md {
  border-radius: 10px;
}
</style>
