<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div class="column">
        <div class="row items-center q-gutter-md">
          <q-btn flat round icon="arrow_back" @click="$router.back()" />
          <div class="column">
            <h1 v-if="leagueStore.currentLeague" class="text-2xl text-bold text-surface-900 q-my-none">
              {{ leagueStore.currentLeague.nome }}
            </h1>
            <p class="text-sm text-surface-500 q-mt-xs q-mb-none font-medium">
              Gerencie as etapas desta liga
            </p>
          </div>
        </div>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Nova Etapa"
        unelevated
        class="text-bold no-caps q-px-md shadow-md"
        @click="openStageDialog"
      />
    </div>

    <!-- Cards de Informações da Liga -->
    <div v-if="leagueStore.currentLeague" class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-md">Data de Início</div>
            <div class="text-lg text-bold text-primary">{{ formatDate(leagueStore.currentLeague.data_inicio) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-md">Data de Término</div>
            <div class="text-lg text-bold text-primary">{{ formatDate(leagueStore.currentLeague.data_prevista_termino) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-md">Nível</div>
            <div class="text-lg text-bold text-primary">{{ leagueStore.currentLeague.nivel }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-md">Total de Etapas</div>
            <div class="text-lg text-bold text-primary">{{ leagueStore.currentLeague.numero_etapas }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Descrição e Premiação -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <div v-if="leagueStore.currentLeague?.descricao" class="col-12 col-md-6">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-sm text-bold text-surface-900 q-mb-md">Descrição</div>
            <p class="text-sm text-surface-600 q-my-none">{{ leagueStore.currentLeague.descricao }}</p>
          </q-card-section>
        </q-card>
      </div>
      <div v-if="leagueStore.currentLeague?.premiacao" class="col-12 col-md-6">
        <q-card class="border-surface-100 shadow-card">
          <q-card-section>
            <div class="text-sm text-bold text-surface-900 q-mb-md">Premiação</div>
            <p class="text-sm text-surface-600 q-my-none">{{ leagueStore.currentLeague.premiacao }}</p>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Tabela de Etapas -->
    <q-card class="border-surface-100 shadow-card overflow-hidden">
      <q-card-section class="q-pa-lg bg-surface-50 border-surface-100">
        <div class="text-lg text-bold text-surface-900">Etapas</div>
      </q-card-section>
      <q-table
        :rows="leagueStore.stages"
        :columns="columns"
        row-key="id"
        flat
        :loading="leagueStore.loading"
        :pagination="pagination"
        class="sakai-table"
        no-data-label="Nenhuma etapa cadastrada."
      >
        <template v-slot:body-cell-data_etapa="props">
          <q-td :props="props">
            {{ formatDate(props.row.data_etapa) }}
          </q-td>
        </template>

        <template v-slot:body-cell-tipo="props">
          <q-td :props="props">
            <q-chip
              color="blue-50"
              text-color="primary"
              dense
              class="text-bold text-xs"
            >
              {{ props.row.tipo }}
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
              icon="edit"
              color="surface-400"
              @click="editStage(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>Remover</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Diálogo de Etapa -->
    <q-dialog v-model="showDialog" persistent backdrop-filter="blur(8px)">
      <q-card class="radius-xl shadow-xl overflow-hidden" style="width: 600px; max-width: 95vw; max-height: 90vh;">
        <q-card-section class="row items-center q-pa-xl bg-surface-50">
          <q-avatar icon="event" color="primary" text-color="white" class="shadow-md" />
          <div class="column q-ml-md">
            <div class="text-xl text-bold text-surface-900">
              {{ stageForm.id ? 'Editar Etapa' : 'Nova Etapa' }}
            </div>
            <div class="text-xs text-surface-400">{{ leagueStore.currentLeague?.nome }}</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
        </q-card-section>

        <q-separator color="surface-100" />

        <q-scroll-area class="scroll-area-form" style="height: 500px;">
          <q-form @submit="onSubmitStage" class="q-pa-xl">
            <div class="q-gutter-y-lg">
              <!-- Informações Básicas -->
              <div>
                <h3 class="text-sm text-bold text-surface-900 q-mb-lg">Informações Básicas</h3>
                <div class="q-gutter-y-lg">
                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">Data da Etapa *</label>
                        <q-input
                          v-model="stageForm.data_etapa"
                          type="date"
                          outlined
                          dense
                          bg-color="white"
                          lazy-rules
                          :rules="[val => !!val || 'Data obrigatória']"
                        />
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">Tipo *</label>
                        <q-input
                          v-model="stageForm.tipo"
                          placeholder="Ex: Rei da Praia"
                          outlined
                          dense
                          bg-color="white"
                          lazy-rules
                          :rules="[val => !!val || 'Tipo obrigatório']"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">Valor de Inscrição *</label>
                        <q-input
                          v-model.number="stageForm.valor_inscricao"
                          type="number"
                          min="0"
                          outlined
                          dense
                          bg-color="white"
                          lazy-rules
                          :rules="[val => val !== null || 'Valor obrigatório']"
                        />
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">Jogadores por Grupo *</label>
                        <q-input
                          v-model.number="stageForm.jogadores_por_grupo"
                          type="number"
                          min="1"
                          outlined
                          dense
                          bg-color="white"
                          lazy-rules
                          :rules="[val => !!val || 'Número obrigatório']"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <q-separator color="surface-100" />

              <!-- Configurações de Classificação -->
              <div>
                <h3 class="text-sm text-bold text-surface-900 q-mb-lg">Classificação</h3>
                <div class="q-gutter-y-lg">
                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">Classificam Total</label>
                        <q-select
                          v-model="stageForm.classificam_total"
                          :options="[null, 4, 8, 12, 16]"
                          outlined
                          dense
                          clearable
                          emit-value
                          bg-color="white"
                          :display-value="`${stageForm.classificam_total || 'Nenhum'}`"
                        />
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">Disputa 3º Lugar</label>
                        <q-toggle
                          v-model="stageForm.disputa_3_lugar"
                          color="primary"
                          label="Sim"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <q-separator color="surface-100" />

              <!-- Pontuações -->
              <div>
                <h3 class="text-sm text-bold text-surface-900 q-mb-lg">Pontuações</h3>
                <div class="q-gutter-y-lg">
                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-sm-6">
                      <div class="q-gutter-y-xs">
                        <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">1º Lugar</label>
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
                        <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">2º Lugar</label>
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
                        <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">3º Lugar</label>
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
                        <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">4º Lugar</label>
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
                        <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">Classificados</label>
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
                        <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">Fase Grupo</label>
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
                    <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">Extra para 1º Grupo</label>
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
                <h3 class="text-sm text-bold text-surface-900 q-mb-lg">Sorteios e Confrontos</h3>
                <div class="q-gutter-y-lg">
                  <div class="q-gutter-y-xs">
                    <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">Sorteio dos Playoffs *</label>
                    <q-select
                      v-model="stageForm.sorteio_playoffs"
                      :options="sorteioPossibilidades"
                      outlined
                      dense
                      emit-value
                      map-options
                      bg-color="white"
                      lazy-rules
                      :rules="[val => !!val || 'Obrigatório']"
                    />
                  </div>

                  <div class="q-gutter-y-xs">
                    <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">Confrontos dos Playoffs *</label>
                    <q-select
                      v-model="stageForm.confrontos_playoffs"
                      :options="confrontosPossibilidades"
                      outlined
                      dense
                      emit-value
                      map-options
                      bg-color="white"
                      lazy-rules
                      :rules="[val => !!val || 'Obrigatório']"
                    />
                  </div>

                  <div class="q-gutter-y-xs">
                    <label class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm">Sorteio dos Grupos *</label>
                    <q-select
                      v-model="stageForm.sorteio_grupos"
                      :options="sorteiGruposPossibilidades"
                      outlined
                      dense
                      emit-value
                      map-options
                      bg-color="white"
                      lazy-rules
                      :rules="[val => !!val || 'Obrigatório']"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-scroll-area>

        <q-card-actions align="right" class="q-pa-xl bg-surface-50 border-surface-100">
          <q-btn flat label="Cancelar" v-close-popup color="surface-500" no-caps class="text-bold" />
          <q-btn
            label="Salvar Etapa"
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLeagueStore } from 'src/stores/league'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const arenaId = route.params.id
const leagueId = route.params.leagueId
const leagueStore = useLeagueStore()

const showDialog = ref(false)
const saving = ref(false)

const pagination = {
  rowsPerPage: 10
}

const columns = [
  { name: 'data_etapa', align: 'left', label: 'Data', field: 'data_etapa', sortable: true },
  { name: 'tipo', align: 'left', label: 'Tipo', field: 'tipo', sortable: true },
  { name: 'valor_inscricao', align: 'left', label: 'Inscrição', field: 'valor_inscricao', sortable: true },
  { name: 'jogadores_por_grupo', align: 'left', label: 'Jogadores/Grupo', field: 'jogadores_por_grupo' },
  { name: 'disputa_3_lugar', align: 'left', label: '3º Lugar?', field: 'disputa_3_lugar' },
  { name: 'actions', align: 'center', label: 'Ações' }
]

const sorteioPossibilidades = [
  { label: 'Aleatório', value: 'aleatorio' },
  { label: 'Primeiros Colocados', value: 'primeiros_colocados' },
  { label: 'Primeiros com Segundos', value: 'primeiros_com_segundos' },
  { label: 'Ordem de Classificação', value: 'ordem_classificacao' },
  { label: 'Manual', value: 'manual' }
]

const confrontosPossibilidades = [
  { label: 'Aleatório', value: 'aleatorio' },
  { label: 'Primeiros contra Últimos', value: 'primeiros_contra_ultimos' },
  { label: 'Manual', value: 'manual' }
]

const sorteiGruposPossibilidades = [
  { label: 'Aleatório', value: 'aleatorio' },
  { label: 'Pela Ordem', value: 'pela_ordem' }
]

const stageForm = reactive({
  id: null,
  league_id: leagueId,
  data_etapa: '',
  valor_inscricao: 0,
  tipo: '',
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
  sorteio_grupos: 'aleatorio'
})

onMounted(async () => {
  await leagueStore.fetchLeague(arenaId, leagueId)
})

function openStageDialog() {
  resetStageForm()
  showDialog.value = true
}

function resetStageForm() {
  stageForm.id = null
  stageForm.league_id = leagueId
  stageForm.data_etapa = ''
  stageForm.valor_inscricao = 0
  stageForm.tipo = ''
  stageForm.jogadores_por_grupo = 4
  stageForm.classificam_total = null
  stageForm.disputa_3_lugar = true
  stageForm.pontuacao_1 = 150
  stageForm.pontuacao_2 = 100
  stageForm.pontuacao_3 = 75
  stageForm.pontuacao_4 = 75
  stageForm.pontuacao_classificados = 50
  stageForm.pontuacao_fase_grupo = 25
  stageForm.pontuacao_extra_1_grupo = 0
  stageForm.sorteio_playoffs = 'aleatorio'
  stageForm.confrontos_playoffs = 'aleatorio'
  stageForm.sorteio_grupos = 'aleatorio'
}

function editStage(stage) {
  stageForm.id = stage.id
  stageForm.league_id = stage.league_id
  stageForm.data_etapa = stage.data_etapa
  stageForm.valor_inscricao = stage.valor_inscricao
  stageForm.tipo = stage.tipo
  stageForm.jogadores_por_grupo = stage.jogadores_por_grupo
  stageForm.classificam_total = stage.classificam_total
  stageForm.disputa_3_lugar = stage.disputa_3_lugar
  stageForm.pontuacao_1 = stage.pontuacao_1
  stageForm.pontuacao_2 = stage.pontuacao_2
  stageForm.pontuacao_3 = stage.pontuacao_3
  stageForm.pontuacao_4 = stage.pontuacao_4
  stageForm.pontuacao_classificados = stage.pontuacao_classificados
  stageForm.pontuacao_fase_grupo = stage.pontuacao_fase_grupo
  stageForm.pontuacao_extra_1_grupo = stage.pontuacao_extra_1_grupo
  stageForm.sorteio_playoffs = stage.sorteio_playoffs
  stageForm.confrontos_playoffs = stage.confrontos_playoffs
  stageForm.sorteio_grupos = stage.sorteio_grupos
  showDialog.value = true
}

async function onSubmitStage() {
  saving.value = true
  try {
    await leagueStore.saveStage(arenaId, leagueId, { ...stageForm })
    $q.notify({
      type: 'positive',
      message: `Etapa ${stageForm.id ? 'atualizada' : 'cadastrada'} com sucesso!`,
      position: 'top',
      icon: 'check_circle'
    })
    showDialog.value = false
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar etapa.',
      position: 'top'
    })
  } finally {
    saving.value = false
  }
}

function confirmDelete(stage) {
  $q.dialog({
    title: 'Remover Etapa',
    message: `Tem certeza que deseja remover a etapa de ${formatDate(stage.data_etapa)}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await leagueStore.deleteStage(arenaId, leagueId, stage.id)
      $q.notify({
        type: 'positive',
        message: 'Etapa removida com sucesso!',
        position: 'top',
        icon: 'check_circle'
      })
    } catch {
      $q.notify({
        type: 'negative',
        message: 'Erro ao remover etapa.',
        position: 'top'
      })
    }
  })
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}
</script>

<style scoped>
.scroll-area-form {
  border-bottom: 1px solid var(--surface-100);
}
</style>
