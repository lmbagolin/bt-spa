<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div class="column">
        <h1 class="text-2xl text-bold text-surface-900 q-my-none">Ligas</h1>
        <p class="text-sm text-surface-500 q-mt-xs q-mb-none font-medium">
          Gerencie todos os torneios e competições de beach tennis.
        </p>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Nova Liga"
        unelevated
        class="text-bold no-caps q-px-md shadow-md"
        @click="openLeagueDialog"
      />
    </div>

    <!-- Cards de Ligas -->
    <div class="row q-col-gutter-lg">
      <div v-if="leagueStore.loading && leagueStore.leagues.length === 0" class="col-12">
        <q-skeleton type="rect" class="radius-lg" height="200px" />
      </div>
      <template v-else-if="leagueStore.leagues.length > 0">
        <div
          v-for="league in leagueStore.leagues"
          :key="league.id"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card
            class="border-surface-100 shadow-card hover:shadow-lg transition-all cursor-pointer"
          >
            <q-card-section class="bg-gradient-primary text-white q-py-lg">
              <div class="text-lg text-bold">{{ league.nome }}</div>
              <div class="text-xs text-surface-200 q-mt-xs">
                <q-icon name="calendar_month" size="xs" class="q-mr-xs" />
                {{ formatDate(league.data_inicio) }} até
                {{ formatDate(league.data_prevista_termino) }}
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-12 col-sm-6">
                  <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-xs">
                    Nível
                  </div>
                  <div class="text-sm text-bold text-surface-900">{{ league.nivel }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-xs text-surface-500 text-bold uppercase tracking-widest q-mb-xs">
                    Etapas
                  </div>
                  <div class="text-sm text-bold text-surface-900">{{ league.numero_etapas }}</div>
                </div>
              </div>
              <q-separator color="surface-100" class="q-my-md" />
              <p v-if="league.descricao" class="text-xs text-surface-600 q-my-none line-clamp-2">
                {{ league.descricao }}
              </p>
            </q-card-section>

            <q-card-actions class="q-pa-md bg-surface-50">
              <q-btn
                flat
                dense
                icon="visibility"
                color="primary"
                label="Ver Etapas"
                to="/leagues/:id"
                class="text-bold"
                @click="() => $router.push(`/leagues/${league.id}`)"
              />
              <q-space />
              <q-btn flat round dense icon="edit" color="surface-400" @click="editLeague(league)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn flat round dense icon="delete" color="negative" @click="confirmDelete(league)">
                <q-tooltip>Remover</q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </template>
      <div v-else class="col-12">
        <q-card class="bg-surface-50 border-surface-100">
          <q-card-section class="text-center q-py-xl">
            <q-icon name="league" size="48px" color="surface-300" class="q-mb-md" />
            <p class="text-surface-500 q-my-none">Nenhuma liga cadastrada ainda.</p>
            <q-btn
              color="primary"
              label="Criar Primeira Liga"
              flat
              class="text-bold q-mt-md"
              @click="openLeagueDialog"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Diálogo de Liga -->
    <q-dialog v-model="showDialog" persistent backdrop-filter="blur(8px)">
      <q-card class="radius-xl shadow-xl overflow-hidden" style="width: 520px; max-width: 95vw">
        <q-card-section class="row items-center q-pa-xl bg-surface-50">
          <q-avatar icon="sports_soccer" color="primary" text-color="white" class="shadow-md" />
          <div class="column q-ml-md">
            <div class="text-xl text-bold text-surface-900">
              {{ form.id ? 'Editar Liga' : 'Nova Liga' }}
            </div>
            <div class="text-xs text-surface-400">Gerenciamento de Ligas</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
        </q-card-section>

        <q-separator color="surface-100" />

        <q-form @submit="onSubmit">
          <q-card-section class="q-pa-xl q-gutter-y-lg">
            <div class="q-gutter-y-xs">
              <label
                class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                >Nome da Liga *</label
              >
              <q-input
                v-model="form.nome"
                placeholder="Ex: Liga Verão 2026"
                outlined
                dense
                bg-color="white"
                lazy-rules
                :rules="[(val) => !!val || 'Nome é obrigatório']"
              />
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-12 col-sm-6">
                <div class="q-gutter-y-xs">
                  <label
                    class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                    >Data de Início *</label
                  >
                  <q-input
                    v-model="form.data_inicio"
                    type="date"
                    outlined
                    dense
                    bg-color="white"
                    lazy-rules
                    :rules="[(val) => !!val || 'Data obrigatória']"
                  />
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="q-gutter-y-xs">
                  <label
                    class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                    >Data Prevista de Término *</label
                  >
                  <q-input
                    v-model="form.data_prevista_termino"
                    type="date"
                    outlined
                    dense
                    bg-color="white"
                    lazy-rules
                    :rules="[(val) => !!val || 'Data obrigatória']"
                  />
                </div>
              </div>
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-12 col-sm-6">
                <div class="q-gutter-y-xs">
                  <label
                    class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                    >Número de Etapas *</label
                  >
                  <q-input
                    v-model.number="form.numero_etapas"
                    type="number"
                    min="1"
                    placeholder="Ex: 5"
                    outlined
                    dense
                    bg-color="white"
                    lazy-rules
                    :rules="[(val) => !!val || 'Número de etapas obrigatório']"
                  />
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="q-gutter-y-xs">
                  <label
                    class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                    >Nível</label
                  >
                  <q-input
                    v-model="form.nivel"
                    placeholder="Ex: Amador, Profissional"
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
                >Descrição</label
              >
              <q-input
                v-model="form.descricao"
                placeholder="Descreva a liga..."
                type="textarea"
                outlined
                dense
                bg-color="white"
                rows="3"
              />
            </div>

            <div class="q-gutter-y-xs">
              <label
                class="text-xs font-bold text-surface-500 block uppercase tracking-widest q-mb-sm"
                >Premiação</label
              >
              <q-input
                v-model="form.premiacao"
                placeholder="Descreva a premiação..."
                type="textarea"
                outlined
                dense
                bg-color="white"
                rows="3"
              />
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
              label="Salvar Liga"
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
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useLeagueStore } from 'src/stores/league';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const leagueStore = useLeagueStore();

const showDialog = ref(false);
const saving = ref(false);

const form = reactive({
  id: null,
  nome: '',
  data_inicio: '',
  data_prevista_termino: '',
  numero_etapas: 1,
  nivel: '',
  descricao: '',
  premiacao: '',
});

onMounted(async () => {
  await leagueStore.fetchLeagues();
});

function openLeagueDialog() {
  resetForm();
  showDialog.value = true;
}

function resetForm() {
  form.id = null;
  form.nome = '';
  form.data_inicio = '';
  form.data_prevista_termino = '';
  form.numero_etapas = 1;
  form.nivel = '';
  form.descricao = '';
  form.premiacao = '';
}

function editLeague(league) {
  form.id = league.id;
  form.nome = league.nome;
  form.data_inicio = league.data_inicio;
  form.data_prevista_termino = league.data_prevista_termino;
  form.numero_etapas = league.numero_etapas;
  form.nivel = league.nivel;
  form.descricao = league.descricao;
  form.premiacao = league.premiacao;
  showDialog.value = true;
}

async function onSubmit() {
  saving.value = true;
  try {
    await leagueStore.saveLeague({ ...form });
    $q.notify({
      type: 'positive',
      message: `Liga ${form.id ? 'atualizada' : 'cadastrada'} com sucesso!`,
      position: 'top',
      icon: 'check_circle',
    });
    showDialog.value = false;
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar liga.',
      position: 'top',
    });
  } finally {
    saving.value = false;
  }
}

function confirmDelete(league) {
  $q.dialog({
    title: 'Remover Liga',
    message: `Tem certeza que deseja remover a liga "${league.nome}"? Isso também removerá todas as etapas associadas.`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await leagueStore.deleteLeague(league.id);
      $q.notify({
        type: 'positive',
        message: 'Liga removida com sucesso!',
        position: 'top',
        icon: 'check_circle',
      });
    } catch {
      $q.notify({
        type: 'negative',
        message: 'Erro ao remover liga.',
        position: 'top',
      });
    }
  });
}

function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('pt-BR');
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #1976d2, #1565c0);
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
</style>
