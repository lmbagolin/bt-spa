<template>
  <div class="auth-wrapper">
    <q-card class="auth-card q-pa-md">
      <q-card-section class="text-center q-pb-md">
        <q-btn flat round color="primary" icon="arrow_back" class="absolute-left q-ma-sm" to="/login" />
        <q-icon name="lock_reset" color="primary" size="48px" class="q-mb-md" />
        <h1 class="text-h5 text-bold text-surface-900 q-my-none">Esqueceu a senha?</h1>
        <p class="text-body2 text-surface-500 q-mb-none">Insira seu e-mail para receber um link de redefinição.</p>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-y-md">
          <div>
            <label class="text-caption text-weight-medium text-surface-500 q-mb-xs block">E-mail</label>
            <q-input
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              outlined
              dense
              lazy-rules
              :rules="[val => !!val || 'E-mail é obrigatório']"
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="email" size="20px" color="surface-400" />
              </template>
            </q-input>
          </div>

          <div class="q-mt-lg">
            <q-btn
              label="Enviar Link"
              type="submit"
              color="primary"
              class="full-width q-py-sm"
              unelevated
              :loading="loading"
            />
          </div>

          <div class="text-center q-mt-md">
            <q-btn flat no-caps color="primary" label="Voltar para o Login" to="/login" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const authStore = useAuthStore()

const email = ref('')
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    await authStore.forgotPassword(email.value)
    $q.notify({
      type: 'positive',
      message: 'Link enviado! Verifique sua caixa de entrada.',
      position: 'top',
      icon: 'check_circle'
    })
    email.value = ''
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Erro ao enviar e-mail. Verifique os dados.',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 440px;
  border-radius: var(--radius-xl);
  background: white;
  box-shadow: var(--shadow-xl) !important;
}

.text-surface-900 {
  color: var(--surface-900);
}

.text-surface-500 {
  color: var(--surface-500);
}

.text-surface-400 {
  color: var(--surface-400);
}

.block {
  display: block;
}
</style>
