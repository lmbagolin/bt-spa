<template>
  <div class="auth-wrapper">
    <q-card class="auth-card q-pa-md">
      <q-card-section class="text-center q-pb-md">
        <q-icon name="password" color="primary" size="48px" class="q-mb-md" />
        <h1 class="text-h5 text-bold text-surface-900 q-my-none">Nova Senha</h1>
        <p class="text-body2 text-surface-500 q-mb-none">Crie uma nova senha para sua conta.</p>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-y-sm">
          <div>
            <label class="text-caption text-weight-medium text-surface-500 q-mb-xs block">E-mail</label>
            <q-input
              v-model="form.email"
              type="email"
              outlined
              dense
              readonly
              bg-color="grey-2"
            >
              <template v-slot:prepend>
                <q-icon name="email" size="20px" color="surface-400" />
              </template>
            </q-input>
          </div>

          <div class="q-mt-sm">
            <label class="text-caption text-weight-medium text-surface-500 q-mb-xs block">Nova Senha</label>
            <q-input
              v-model="form.password"
              type="password"
              outlined
              dense
              lazy-rules
              :rules="[
                val => !!val || 'Senha é obrigatória',
                val => val.length >= 8 || 'Mínimo 8 caracteres'
              ]"
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="lock" size="20px" color="surface-400" />
              </template>
            </q-input>
          </div>

          <div class="q-mt-sm">
            <label class="text-caption text-weight-medium text-surface-500 q-mb-xs block">Confirmar Senha</label>
            <q-input
              v-model="form.password_confirmation"
              type="password"
              outlined
              dense
              lazy-rules
              :rules="[
                val => !!val || 'Confirmação é obrigatória',
                val => val === form.password || 'As senhas não coincidem'
              ]"
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="lock" size="20px" color="surface-400" />
              </template>
            </q-input>
          </div>

          <div class="q-mt-lg">
            <q-btn
              label="Redefinir Senha"
              type="submit"
              color="primary"
              class="full-width q-py-sm"
              unelevated
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const form = reactive({
  token: '',
  email: '',
  password: '',
  password_confirmation: ''
})

onMounted(() => {
  form.token = route.query.token || ''
  form.email = route.query.email || ''

  if (!form.token) {
    $q.notify({
      type: 'warning',
      message: 'Token de redefinição ausente. Solicite um novo link.',
      position: 'top'
    })
    router.push('/forgot-password')
  }
})

async function onSubmit() {
  loading.value = true
  try {
    await authStore.resetPassword(form)
    $q.notify({
      type: 'positive',
      message: 'Senha redefinida com sucesso! Faça login.',
      position: 'top',
      icon: 'check_circle'
    })
    router.push('/login')
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Erro ao redefinir senha. Verifique o link.',
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
