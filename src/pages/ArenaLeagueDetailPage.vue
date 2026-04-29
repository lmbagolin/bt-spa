<template>
  <q-page class="q-pa-lg">
    <PageHeader
      :title="leagueStore.currentLeague?.nome ?? 'Liga'"
      :subtitle="$t('league_detail.subtitle')"
      :back="() => $router.back()"
    >
      <q-btn
        flat
        color="surface-500"
        icon="edit"
        :label="$t('league_detail.edit_league')"
        no-caps
        class="text-bold"
        @click="openLeagueDialog"
      />
      <q-btn
        outline
        color="primary"
        icon="bar_chart"
        :label="$t('league_detail.ranking')"
        no-caps
        class="text-bold"
        @click="router.push({ name: 'league-ranking', params: { id: arenaId, leagueId } })"
      />
      <q-btn
        color="primary"
        icon="add"
        :label="$t('league_detail.new_stage')"
        unelevated
        no-caps
        class="text-bold"
        @click="openStageDialog"
      />
    </PageHeader>

    <!-- Cards de Informações da Liga -->
    <div v-if="leagueStore.currentLeague" class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-sm-6 col-md">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-md">
              {{ $t('league_detail.info_start_date') }}
            </div>
            <div class="text-lg text-bold text-primary">
              {{ formatDate(leagueStore.currentLeague.data_inicio) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-md">
              {{ $t('league_detail.info_end_date') }}
            </div>
            <div class="text-lg text-bold text-primary">
              {{ formatDate(leagueStore.currentLeague.data_prevista_termino) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-md">
              {{ $t('league_detail.info_level') }}
            </div>
            <div class="text-lg text-bold text-primary">
              {{ leagueStore.currentLeague.nivel || '—' }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-md">
              {{ $t('league_detail.info_gender') }}
            </div>

            <GeneroChip :gender="leagueStore.currentLeague.gender" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-md">
              {{ $t('league_detail.info_stages_closed') }}
            </div>
            <div class="text-lg text-bold text-primary">
              {{ closedStages
              }}<span class="text-sm text-surface-400 q-ml-xs" style="font-weight: 500"
                >/ {{ leagueStore.currentLeague.numero_etapas }}</span
              >
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Descrição e Premiação -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <div v-if="leagueStore.currentLeague?.descricao" class="col-12 col-md-6">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-sm text-bold text-surface-900 q-mb-md">
              {{ $t('league_detail.section_description') }}
            </div>
            <p class="text-sm text-surface-600 q-my-none">
              {{ leagueStore.currentLeague.descricao }}
            </p>
          </q-card-section>
        </q-card>
      </div>
      <div v-if="leagueStore.currentLeague?.premiacao" class="col-12 col-md-6">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-sm text-bold text-surface-900 q-mb-md">
              {{ $t('league_detail.section_award') }}
            </div>
            <p class="text-sm text-surface-600 q-my-none">
              {{ leagueStore.currentLeague.premiacao }}
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Tabela de Etapas -->
    <q-card class="border-surface-100 shadow-card overflow-hidden">
      <q-card-section class="q-pa-lg bg-surface-50 border-surface-100">
        <div class="text-lg text-bold text-surface-900">
          {{ $t('league_detail.section_stages') }}
        </div>
      </q-card-section>
      <q-table
        :rows="leagueStore.stages"
        :columns="columns"
        row-key="id"
        flat
        :loading="leagueStore.loading"
        :pagination="pagination"
        class="sakai-table"
        :no-data-label="$t('league_detail.no_stages')"
      >
        <template v-slot:body-cell-data_etapa="props">
          <q-td :props="props">
            {{ formatDate(props.row.data_etapa) }}
          </q-td>
        </template>

        <template v-slot:body-cell-tipo="props">
          <q-td :props="props">
            <q-chip color="blue-50" text-color="primary" dense class="text-bold text-xs">
              {{ tipoLabel(props.row.tipo) }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-stage_status="props">
          <q-td :props="props">
            <q-chip
              :color="stageStatusColor(props.row.stage_status).bg"
              :text-color="stageStatusColor(props.row.stage_status).text"
              dense
              class="text-bold text-xs"
            >
              {{ stageStatusLabel(props.row.stage_status) }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-jogadores_por_grupo="props">
          <q-td :props="props">
            <span class="text-bold">{{ props.row.jogadores_por_grupo }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-disputa_3_lugar="props">
          <q-td :props="props">
            <q-icon
              :name="props.row.disputa_3_lugar ? 'check_circle' : 'cancel'"
              :color="props.row.disputa_3_lugar ? 'positive' : 'negative'"
              size="20px"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              flat
              round
              dense
              icon="dashboard"
              color="primary"
              @click="goToStageDashboard(props.row)"
            >
              <q-tooltip>{{ $t('league_detail.tooltip_dashboard') }}</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="edit" color="surface-400" @click="editStage(props.row)">
              <q-tooltip>{{ $t('common.edit') }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>{{ $t('common.remove') }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Diálogo de Edição da Liga -->
    <BtDialog v-model="showLeagueDialog" :title="$t('league_detail.dialog_edit_league')" closable>
      <div class="q-gutter-y-lg">
        <div class="q-gutter-y-xs">
          <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
            {{ $t('league_detail.field_league_name') }}
          </label>
          <BtInput
            v-model="leagueForm.nome"
            :placeholder="$t('league_detail.field_league_name_placeholder')"
          />
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-sm-6">
            <div class="q-gutter-y-xs">
              <label
                class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
              >
                {{ $t('league_detail.field_start_date') }}
              </label>
              <BtDatePicker v-model="leagueForm.data_inicio" />
            </div>
          </div>
          <div class="col-12 col-sm-6">
            <div class="q-gutter-y-xs">
              <label
                class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
              >
                {{ $t('league_detail.field_end_date') }}
              </label>
              <BtDatePicker v-model="leagueForm.data_prevista_termino" />
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-sm-4">
            <div class="q-gutter-y-xs">
              <label
                class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
              >
                {{ $t('league_detail.field_stages_count') }}
              </label>
              <BtInput
                v-model.number="leagueForm.numero_etapas"
                type="number"
                placeholder="Ex: 5"
              />
            </div>
          </div>
          <div class="col-12 col-sm-4">
            <div class="q-gutter-y-xs">
              <label
                class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
              >
                {{ $t('league_detail.field_level') }}
              </label>
              <BtInput
                v-model="leagueForm.nivel"
                :placeholder="$t('league_detail.field_level_placeholder')"
              />
            </div>
          </div>
          <div class="col-12 col-sm-4">
            <div class="q-gutter-y-xs">
              <label
                class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
              >
                {{ $t('league_detail.field_gender') }}
              </label>
              <BtSelect
                v-model="leagueForm.gender"
                :options="generoOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>

        <div class="q-gutter-y-xs">
          <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
            {{ $t('league_detail.field_description') }}
          </label>
          <BtTextarea
            v-model="leagueForm.descricao"
            :placeholder="$t('league_detail.field_description_placeholder')"
            :rows="3"
          />
        </div>

        <div class="q-gutter-y-xs">
          <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">
            {{ $t('league_detail.field_award') }}
          </label>
          <BtTextarea
            v-model="leagueForm.premiacao"
            :placeholder="$t('league_detail.field_award_placeholder')"
            :rows="3"
          />
        </div>
      </div>

      <template #actions>
        <BtButton :label="$t('common.cancel')" variant="flat" @click="showLeagueDialog = false" />
        <BtButton
          :label="$t('league_detail.save_league')"
          variant="primary"
          :loading="savingLeague"
          @click="onSubmitLeague"
        />
      </template>
    </BtDialog>

    <!-- Diálogo de Etapa -->
    <q-dialog v-model="showDialog" persistent backdrop-filter="blur(8px)">
      <q-card
        class="radius-xl shadow-xl overflow-hidden"
        style="width: 600px; max-width: 95vw; max-height: 90vh"
      >
        <q-card-section class="row items-center q-pa-xl bg-surface-50">
          <q-avatar icon="event" color="primary" text-color="white" class="shadow-md" />
          <div class="column q-ml-md">
            <div class="text-xl text-bold text-surface-900">
              {{
                stageForm.id
                  ? $t('league_detail.dialog_edit_stage')
                  : $t('league_detail.dialog_new_stage')
              }}
            </div>
            <div class="text-xs text-surface-400">{{ leagueStore.currentLeague?.nome }}</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
        </q-card-section>

        <q-separator color="surface-100" />

        <q-scroll-area class="scroll-area-form" style="height: 500px">
          <q-form @submit="onSubmitStage" class="q-pa-xl">
            <div class="q-gutter-y-lg">
              <!-- Informações Básicas -->
              <div>
                <h3 class="text-sm text-bold text-surface-900 q-mb-lg">
                  {{ $t('league_detail.section_basic_info') }}
                </h3>
                <div class="q-gutter-y-lg">
                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-sm-4">
                      <div class="q-gutter-y-xs">
                        <label
                          class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                        >
                          {{ $t('league_detail.field_stage_date') }}
                        </label>
                        <q-input
                          v-model="stageForm.data_etapa"
                          type="date"
                          outlined
                          dense
                          bg-color="white"
                          lazy-rules
                          :rules="[(val) => !!val || $t('league_detail.validation_date_required')]"
                        />
                      </div>
                    </div>
                    <div class="col-12 col-sm-2">
                      <div class="q-gutter-y-xs">
                        <label
                          class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                        >
                          Horário
                        </label>
                        <q-input
                          v-model="stageForm.hora_etapa"
                          type="time"
                          outlined
                          dense
                          bg-color="white"
                        />
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label
                          class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                        >
                          {{ $t('league_detail.field_stage_type') }}
                        </label>
                        <BtSelect
                          v-model="stageForm.tipo"
                          :options="tipoOptions"
                          emit-value
                          map-options
                          outlined
                          dense
                          bg-color="white"
                          lazy-rules
                          :rules="[(val) => !!val || $t('league_detail.validation_type_required')]"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label
                          class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                        >
                          {{ $t('league_detail.field_registration_value') }}
                        </label>
                        <q-input
                          v-model.number="stageForm.valor_inscricao"
                          type="number"
                          min="0"
                          outlined
                          dense
                          bg-color="white"
                          lazy-rules
                          :rules="[
                            (val) => val !== null || $t('league_detail.validation_value_required'),
                          ]"
                        />
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label
                          class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                        >
                          {{ $t('league_detail.field_players_per_group') }}
                        </label>
                        <q-input
                          v-model.number="stageForm.jogadores_por_grupo"
                          type="number"
                          min="1"
                          outlined
                          dense
                          bg-color="white"
                          lazy-rules
                          :rules="[
                            (val) => !!val || $t('league_detail.validation_number_required'),
                          ]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <q-separator color="surface-100" />

              <!-- Classificação -->
              <div>
                <h3 class="text-sm text-bold text-surface-900 q-mb-lg">
                  {{ $t('league_detail.section_classification') }}
                </h3>
                <div class="q-gutter-y-lg">
                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label
                          class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                        >
                          {{ $t('league_detail.field_total_classifiers') }}
                        </label>
                        <q-select
                          v-model="stageForm.classificam_total"
                          :options="[null, 4, 8, 12, 16]"
                          outlined
                          dense
                          clearable
                          emit-value
                          bg-color="white"
                          :display-value="`${stageForm.classificam_total || $t('league_detail.none')}`"
                        />
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label
                          class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                        >
                          {{ $t('league_detail.field_third_place') }}
                        </label>
                        <q-toggle
                          v-model="stageForm.disputa_3_lugar"
                          color="primary"
                          :label="$t('league_detail.toggle_yes')"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <q-separator color="surface-100" />

              <!-- Pontuações -->
              <div>
                <h3 class="text-sm text-bold text-surface-900 q-mb-lg">
                  {{ $t('league_detail.section_scores') }}
                </h3>
                <div class="q-gutter-y-lg">
                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label
                          class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                          >{{ $t('league_detail.field_score_1') }}</label
                        >
                        <q-input
                          v-model.number="stageForm.pontuacao_1"
                          type="number"
                          min="0"
                          outlined
                          dense
                          bg-color="white"
                        />
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label
                          class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                          >{{ $t('league_detail.field_score_2') }}</label
                        >
                        <q-input
                          v-model.number="stageForm.pontuacao_2"
                          type="number"
                          min="0"
                          outlined
                          dense
                          bg-color="white"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label
                          class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                          >{{ $t('league_detail.field_score_3') }}</label
                        >
                        <q-input
                          v-model.number="stageForm.pontuacao_3"
                          type="number"
                          min="0"
                          outlined
                          dense
                          bg-color="white"
                        />
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label
                          class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                          >{{ $t('league_detail.field_score_4') }}</label
                        >
                        <q-input
                          v-model.number="stageForm.pontuacao_4"
                          type="number"
                          min="0"
                          outlined
                          dense
                          bg-color="white"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label
                          class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                          >{{ $t('league_detail.field_score_qualifiers') }}</label
                        >
                        <q-input
                          v-model.number="stageForm.pontuacao_classificados"
                          type="number"
                          min="0"
                          outlined
                          dense
                          bg-color="white"
                        />
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label
                          class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                          >{{ $t('league_detail.field_score_group') }}</label
                        >
                        <q-input
                          v-model.number="stageForm.pontuacao_fase_grupo"
                          type="number"
                          min="0"
                          outlined
                          dense
                          bg-color="white"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="q-gutter-y-xs">
                    <label
                      class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                      >{{ $t('league_detail.field_score_extra_1') }}</label
                    >
                    <q-input
                      v-model.number="stageForm.pontuacao_extra_1_grupo"
                      type="number"
                      min="0"
                      outlined
                      dense
                      bg-color="white"
                    />
                  </div>
                </div>
              </div>

              <q-separator color="surface-100" />

              <!-- Sorteios e Confrontos -->
              <div>
                <h3 class="text-sm text-bold text-surface-900 q-mb-lg">
                  {{ $t('league_detail.section_draws') }}
                </h3>
                <div class="q-gutter-y-lg">
                  <div class="q-gutter-y-xs">
                    <label
                      class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                    >
                      {{ $t('league_detail.field_playoffs_draw') }}
                    </label>
                    <q-select
                      v-model="stageForm.sorteio_playoffs"
                      :options="sorteioPossibilidades"
                      outlined
                      dense
                      emit-value
                      map-options
                      bg-color="white"
                      lazy-rules
                      :rules="[(val) => !!val || $t('league_detail.validation_required')]"
                    />
                  </div>

                  <div class="q-gutter-y-xs">
                    <label
                      class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                    >
                      {{ $t('league_detail.field_playoffs_matchups') }}
                    </label>
                    <q-select
                      v-model="stageForm.confrontos_playoffs"
                      :options="confrontosPossibilidades"
                      outlined
                      dense
                      emit-value
                      map-options
                      bg-color="white"
                      lazy-rules
                      :rules="[(val) => !!val || $t('league_detail.validation_required')]"
                    />
                  </div>

                  <div class="q-gutter-y-xs">
                    <label
                      class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                    >
                      {{ $t('league_detail.field_groups_draw') }}
                    </label>
                    <q-select
                      v-model="stageForm.sorteio_grupos"
                      :options="sorteiGruposPossibilidades"
                      outlined
                      dense
                      emit-value
                      map-options
                      bg-color="white"
                      lazy-rules
                      :rules="[(val) => !!val || $t('league_detail.validation_required')]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-scroll-area>

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
            :label="$t('league_detail.save_stage')"
            type="submit"
            color="primary"
            unelevated
            class="q-px-xl text-bold no-caps shadow-md"
            :loading="saving"
            @click="onSubmitStage"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import PageHeader from 'src/components/others/PageHeader.vue';
import GeneroChip from 'src/components/others/GeneroChip.vue';
import BtDialog from 'src/components/BtDialog.vue';
import BtInput from 'src/components/BtInput.vue';
import BtSelect from 'src/components/BtSelect.vue';
import BtDatePicker from 'src/components/BtDatePicker.vue';
import BtTextarea from 'src/components/BtTextarea.vue';
import BtButton from 'src/components/BtButton.vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLeagueStore } from 'src/stores/league';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const arenaId = route.params.id;
const leagueId = route.params.leagueId;
const leagueStore = useLeagueStore();

const showDialog = ref(false);
const saving = ref(false);

const showLeagueDialog = ref(false);
const savingLeague = ref(false);

const generoOptions = computed(() => [
  { label: t('common.gender_male'), value: 'male' },
  { label: t('common.gender_female'), value: 'female' },
  { label: t('common.gender_mixed'), value: 'mixed' },
]);

const leagueForm = reactive({
  id: null,
  nome: '',
  data_inicio: '',
  data_prevista_termino: '',
  numero_etapas: 1,
  nivel: '',
  gender: 'mixed',
  descricao: '',
  premiacao: '',
});

const pagination = { rowsPerPage: 10 };

const closedStages = computed(
  () => leagueStore.stages.filter((s) => s.stage_status === 'closed').length,
);

const STAGE_STATUS = computed(() => ({
  created: {
    label: t('league_detail.stage_status_created'),
    bg: 'surface-100',
    text: 'surface-600',
  },
  registrations_open: {
    label: t('league_detail.stage_status_registrations_open'),
    bg: 'blue-1',
    text: 'blue-9',
  },
  group_draw: {
    label: t('league_detail.stage_status_group_draw'),
    bg: 'purple-1',
    text: 'purple-9',
  },
  group_stage: {
    label: t('league_detail.stage_status_group_stage'),
    bg: 'orange-1',
    text: 'orange-9',
  },
  playoffs: { label: t('league_detail.stage_status_playoffs'), bg: 'green-1', text: 'green-9' },
  closed: { label: t('league_detail.stage_status_closed'), bg: 'grey-2', text: 'grey-8' },
}));
const stageStatusLabel = (s) => STAGE_STATUS.value[s]?.label ?? s;
const stageStatusColor = (s) => STAGE_STATUS.value[s] ?? { bg: 'surface-100', text: 'surface-600' };

const columns = computed(() => [
  {
    name: 'data_etapa',
    align: 'left',
    label: t('league_detail.col_date'),
    field: 'data_etapa',
    sortable: true,
  },
  {
    name: 'tipo',
    align: 'left',
    label: t('league_detail.col_type'),
    field: 'tipo',
    sortable: true,
  },
  {
    name: 'stage_status',
    align: 'left',
    label: t('league_detail.col_status'),
    field: 'stage_status',
  },
  {
    name: 'valor_inscricao',
    align: 'left',
    label: t('league_detail.col_registration'),
    field: 'valor_inscricao',
    sortable: true,
  },
  {
    name: 'jogadores_por_grupo',
    align: 'left',
    label: t('league_detail.col_players_per_group'),
    field: 'jogadores_por_grupo',
  },
  {
    name: 'disputa_3_lugar',
    align: 'left',
    label: t('league_detail.col_third_place'),
    field: 'disputa_3_lugar',
  },
  { name: 'actions', align: 'center', label: t('league_detail.col_actions') },
]);

const sorteioPossibilidades = computed(() => [
  { label: t('league_detail.draw_random'), value: 'aleatorio' },
  { label: t('league_detail.draw_top_players'), value: 'primeiros_colocados' },
  { label: t('league_detail.draw_top_with_second'), value: 'primeiros_com_segundos' },
  { label: t('league_detail.draw_ranking_order'), value: 'ordem_classificacao' },
  { label: t('league_detail.draw_manual'), value: 'manual' },
]);

const confrontosPossibilidades = computed(() => [
  { label: t('league_detail.matchup_random'), value: 'aleatorio' },
  { label: t('league_detail.matchup_top_vs_bottom'), value: 'primeiros_contra_ultimos' },
  { label: t('league_detail.matchup_manual'), value: 'manual' },
]);

const sorteiGruposPossibilidades = computed(() => [
  { label: t('league_detail.group_draw_random'), value: 'aleatorio' },
  { label: t('league_detail.group_draw_ordered'), value: 'pela_ordem' },
]);

import { tipoOptions, tipoLabel } from 'src/composables/useStageTypes';

const stageForm = reactive({
  id: null,
  league_id: leagueId,
  data_etapa: '',
  hora_etapa: '08:00',
  valor_inscricao: 0,
  tipo: 'rei-da-praia',
  jogadores_por_grupo: 4,
  classificam_total: null,
  disputa_3_lugar: true,
  pontuacao_1: 150,
  pontuacao_2: 100,
  pontuacao_3: 75,
  pontuacao_4: 75,
  pontuacao_classificados: 50,
  pontuacao_fase_grupo: 25,
  pontuacao_extra_1_grupo: 0,
  sorteio_playoffs: 'aleatorio',
  confrontos_playoffs: 'aleatorio',
  sorteio_grupos: 'aleatorio',
});

onMounted(async () => {
  await leagueStore.fetchLeague(arenaId, leagueId);
});

function openLeagueDialog() {
  const l = leagueStore.currentLeague;
  leagueForm.id = l.id;
  leagueForm.nome = l.nome;
  leagueForm.data_inicio = l.data_inicio;
  leagueForm.data_prevista_termino = l.data_prevista_termino;
  leagueForm.numero_etapas = l.numero_etapas;
  leagueForm.nivel = l.nivel;
  leagueForm.gender = l.gender ?? 'mixed';
  leagueForm.descricao = l.descricao;
  leagueForm.premiacao = l.premiacao;
  showLeagueDialog.value = true;
}

async function onSubmitLeague() {
  savingLeague.value = true;
  try {
    await leagueStore.saveLeague(arenaId, { ...leagueForm });
    $q.notify({
      type: 'positive',
      message: t('league_detail.notify_league_updated'),
      position: 'top',
      icon: 'check_circle',
    });
    showLeagueDialog.value = false;
    await leagueStore.fetchLeague(arenaId, leagueId);
  } catch {
    $q.notify({
      type: 'negative',
      message: t('league_detail.notify_league_error'),
      position: 'top',
    });
  } finally {
    savingLeague.value = false;
  }
}

function openStageDialog() {
  resetStageForm();
  showDialog.value = true;
}

function resetStageForm() {
  stageForm.id = null;
  stageForm.league_id = leagueId;
  stageForm.data_etapa = '';
  stageForm.hora_etapa = '08:00';
  stageForm.valor_inscricao = 0;
  stageForm.tipo = 'rei-da-praia';
  stageForm.jogadores_por_grupo = 4;
  stageForm.classificam_total = null;
  stageForm.disputa_3_lugar = true;
  stageForm.pontuacao_1 = 150;
  stageForm.pontuacao_2 = 100;
  stageForm.pontuacao_3 = 75;
  stageForm.pontuacao_4 = 75;
  stageForm.pontuacao_classificados = 50;
  stageForm.pontuacao_fase_grupo = 25;
  stageForm.pontuacao_extra_1_grupo = 0;
  stageForm.sorteio_playoffs = 'aleatorio';
  stageForm.confrontos_playoffs = 'aleatorio';
  stageForm.sorteio_grupos = 'aleatorio';
}

function editStage(stage) {
  stageForm.id = stage.id;
  stageForm.league_id = stage.league_id;
  // API retorna "YYYY-MM-DD HH:mm" — separar data e hora para os inputs
  const [datePart, timePart] = (stage.data_etapa ?? '').split(' ');
  stageForm.data_etapa = datePart ?? '';
  stageForm.hora_etapa = timePart ?? '08:00';
  stageForm.valor_inscricao = stage.valor_inscricao;
  stageForm.tipo = stage.tipo;
  stageForm.jogadores_por_grupo = stage.jogadores_por_grupo;
  stageForm.classificam_total = stage.classificam_total;
  stageForm.disputa_3_lugar = stage.disputa_3_lugar;
  stageForm.pontuacao_1 = stage.pontuacao_1;
  stageForm.pontuacao_2 = stage.pontuacao_2;
  stageForm.pontuacao_3 = stage.pontuacao_3;
  stageForm.pontuacao_4 = stage.pontuacao_4;
  stageForm.pontuacao_classificados = stage.pontuacao_classificados;
  stageForm.pontuacao_fase_grupo = stage.pontuacao_fase_grupo;
  stageForm.pontuacao_extra_1_grupo = stage.pontuacao_extra_1_grupo;
  stageForm.sorteio_playoffs = stage.sorteio_playoffs;
  stageForm.confrontos_playoffs = stage.confrontos_playoffs;
  stageForm.sorteio_grupos = stage.sorteio_grupos;
  showDialog.value = true;
}

async function onSubmitStage() {
  saving.value = true;
  try {
    const payload = { ...stageForm, data_etapa: `${stageForm.data_etapa} ${stageForm.hora_etapa}` };
    delete payload.hora_etapa;
    await leagueStore.saveStage(arenaId, leagueId, payload);
    $q.notify({
      type: 'positive',
      message: stageForm.id
        ? t('league_detail.notify_stage_updated')
        : t('league_detail.notify_stage_created'),
      position: 'top',
      icon: 'check_circle',
    });
    showDialog.value = false;
  } catch {
    $q.notify({
      type: 'negative',
      message: t('league_detail.notify_stage_error_save'),
      position: 'top',
    });
  } finally {
    saving.value = false;
  }
}

function confirmDelete(stage) {
  $q.dialog({
    title: t('league_detail.confirm_delete_stage_title'),
    message: t('league_detail.confirm_delete_stage_message', {
      date: formatDate(stage.data_etapa),
    }),
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await leagueStore.deleteStage(arenaId, leagueId, stage.id);
      $q.notify({
        type: 'positive',
        message: t('league_detail.notify_stage_deleted'),
        position: 'top',
        icon: 'check_circle',
      });
    } catch {
      $q.notify({
        type: 'negative',
        message: t('league_detail.notify_stage_error_delete'),
        position: 'top',
      });
    }
  });
}

function goToStageDashboard(stage) {
  router.push({ name: 'stage-detail', params: { id: arenaId, leagueId, stageId: stage.id } });
}

function parseDate(str) {
  if (!str) return new Date(NaN);
  return new Date(str.replace(' ', 'T'));
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = parseDate(dateStr);
  if (isNaN(d)) return '—';
  const dateFormatted = d.toLocaleDateString('pt-BR');
  const timePart = dateStr.includes(' ') ? dateStr.split(' ')[1] : null;
  return timePart && timePart !== '00:00' ? `${dateFormatted} ${timePart}` : dateFormatted;
}
</script>

<style scoped>
.scroll-area-form {
  border-bottom: 1px solid var(--surface-100);
}
</style>
