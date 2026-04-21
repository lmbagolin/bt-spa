<template>
  <BtCard title="Criar Novo Torneio" padding="lg">
    <!-- Success Message -->
    <BtBanner
      v-model="showSuccess"
      variant="success"
      title="Sucesso!"
      message="Torneio criado com sucesso"
      closable
    />

    <!-- Error Message -->
    <BtBanner
      v-model="showError"
      variant="danger"
      :title="errorTitle"
      :message="errorMessage"
      closable
    />

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="q-gutter-md">
      <!-- Informações Básicas -->
      <div class="text-h6 text-bold text-primary q-mt-lg q-mb-md">Informações Básicas</div>

      <BtInput
        v-model="form.name"
        label="Nome do Torneio"
        placeholder="Beach Tennis Tournament 2026"
        :error="!!errors.name"
        :error-message="errors.name"
        clearable
      />

      <BtTextarea
        v-model="form.description"
        label="Descrição"
        placeholder="Descreva o torneio..."
        :max-length="500"
        :rows="4"
        :error="!!errors.description"
        :error-message="errors.description"
      />

      <!-- Datas -->
      <div class="text-h6 text-bold text-primary q-mt-lg q-mb-md">Datas e Horários</div>

      <div class="row gap-md">
        <div class="col">
          <BtDatePicker
            v-model="form.startDate"
            label="Data Inicial"
            clearable
            :error="!!errors.startDate"
            :error-message="errors.startDate"
          />
        </div>
        <div class="col">
          <BtDatePicker
            v-model="form.endDate"
            label="Data Final"
            clearable
            :error="!!errors.endDate"
            :error-message="errors.endDate"
          />
        </div>
      </div>

      <!-- Configurações -->
      <div class="text-h6 text-bold text-primary q-mt-lg q-mb-md">Configurações</div>

      <div class="row gap-lg items-start">
        <div class="col-12 col-md-6">
          <BtSelect
            v-model="form.category"
            label="Categoria"
            :options="categories"
            clearable
            :error="!!errors.category"
            :error-message="errors.category"
          />
        </div>
        <div class="col-12 col-md-6">
          <BtInput
            v-model.number="form.maxPlayers"
            label="Máximo de Jogadores"
            type="number"
            :min="2"
            :max="100"
            :error="!!errors.maxPlayers"
            :error-message="errors.maxPlayers"
          />
        </div>
      </div>

      <!-- Status -->
      <div class="text-subtitle2 text-bold q-mt-lg q-mb-md">Status</div>

      <div class="row gap-lg">
        <BtRadio v-model="form.status" value="draft" label="Rascunho" />
        <BtRadio v-model="form.status" value="published" label="Publicado" />
        <BtRadio v-model="form.status" value="closed" label="Encerrado" />
      </div>

      <!-- Checkboxes -->
      <div class="q-mt-lg">
        <BtCheckbox v-model="form.requiresRegistration" label="Requer registro de jogadores" />
        <BtCheckbox v-model="form.isPublic" label="Torneio público (visível para todos)" />
      </div>

      <!-- Botões de Ação -->
      <div class="row gap-md q-mt-xl justify-end">
        <BtButton label="Cancelar" variant="outline" @click="resetForm" />
        <BtButton label="Salvar Rascunho" variant="secondary" @click="saveDraft" />
        <BtButton
          label="Criar Torneio"
          variant="primary"
          icon="check"
          :loading="isLoading"
          type="submit"
        />
      </div>
    </form>

    <!-- Preview Dialog -->
    <BtDialog v-model="showPreview" title="Preview do Torneio" closable>
      <div class="q-gutter-md">
        <div><strong>Nome:</strong> {{ form.name || '(não preenchido)' }}</div>
        <div><strong>Descrição:</strong> {{ form.description || '(não preenchida)' }}</div>
        <div><strong>Data Inicial:</strong> {{ form.startDate || '(não definida)' }}</div>
        <div><strong>Data Final:</strong> {{ form.endDate || '(não definida)' }}</div>
        <div>
          <strong>Status:</strong>
          <q-badge :label="form.status" color="primary" />
        </div>
      </div>

      <template #actions>
        <BtButton label="Fechar" variant="flat" @click="showPreview = false" />
        <BtButton label="Confirmar" variant="primary" />
      </template>
    </BtDialog>
  </BtCard>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BtCard from '@/components/BtCard.vue'
import BtInput from '@/components/BtInput.vue'
import BtTextarea from '@/components/BtTextarea.vue'
import BtDatePicker from '@/components/BtDatePicker.vue'
import BtSelect from '@/components/BtSelect.vue'
import BtCheckbox from '@/components/BtCheckbox.vue'
import BtRadio from '@/components/BtRadio.vue'
import BtButton from '@/components/BtButton.vue'
import BtBanner from '@/components/BtBanner.vue'
import BtDialog from '@/components/BtDialog.vue'

const form = reactive({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  category: null,
  maxPlayers: 32,
  status: 'draft',
  requiresRegistration: true,
  isPublic: false,
})

const errors = reactive({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  category: '',
  maxPlayers: '',
})

const categories = ref([
  { label: 'Profissional', value: 'professional' },
  { label: 'Amador', value: 'amateur' },
  { label: 'Iniciante', value: 'beginner' },
])

const isLoading = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const showPreview = ref(false)
const errorTitle = ref('')
const errorMessage = ref('')

const validateForm = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })

  if (!form.name.trim()) {
    errors.name = 'Nome é obrigatório'
  }

  if (!form.description.trim()) {
    errors.description = 'Descrição é obrigatória'
  }

  if (!form.startDate) {
    errors.startDate = 'Data inicial é obrigatória'
  }

  if (!form.endDate) {
    errors.endDate = 'Data final é obrigatória'
  }

  if (!form.category) {
    errors.category = 'Categoria é obrigatória'
  }

  if (!form.maxPlayers || form.maxPlayers < 2) {
    errors.maxPlayers = 'Mínimo de 2 jogadores'
  }

  return Object.values(errors).every((e) => !e)
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError.value = true
    errorTitle.value = 'Formulário inválido'
    errorMessage.value = 'Preencha todos os campos obrigatórios'
    return
  }

  isLoading.value = true

  try {
    // Simular API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    showSuccess.value = true
    resetForm()

    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch {
    showError.value = true
    errorTitle.value = 'Erro ao criar'
    errorMessage.value = 'Não foi possível criar o torneio. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

const saveDraft = () => {
  console.log('Salvando rascunho:', form)
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 2000)
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    category: null,
    maxPlayers: 32,
    status: 'draft',
    requiresRegistration: true,
    isPublic: false,
  })

  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}
</script>

<style scoped lang="scss">
@import '../css/bt-variables.scss';

.gap-md {
  gap: $spacing-md;
}

.gap-lg {
  gap: $spacing-lg;
}
</style>
