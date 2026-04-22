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
          <BtInput v-model="form.email" label="E-mail" type="email" readonly>
            <template #prefix>
              <q-icon name="email" size="20px" color="surface-400" />
            </template>
          </BtInput>

          <BtInput
            v-model="form.password"
            label="Nova Senha"
            type="password"
            placeholder="Mínimo 8 caracteres"
            hint="Use pelo menos 8 caracteres"
          >
            <template #prefix>
              <q-icon name="lock" size="20px" color="surface-400" />
            </template>
          </BtInput>

          <BtInput
            v-model="form.password_confirmation"
            label="Confirmar Senha"
            type="password"
            placeholder="Repita sua senha"
          >
            <template #prefix>
              <q-icon name="lock" size="20px" color="surface-400" />
            </template>
          </BtInput>

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
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const form = reactive({
  token: '',
  email: '',
  password: '',
  password_confirmation: '',
});

onMounted(() => {
  form.token = route.query.token || '';
  form.email = route.query.email || '';

  if (!form.token) {
    $q.notify({
      type: 'warning',
      message: 'Token de redefinição ausente. Solicite um novo link.',
      position: 'top',
    });
    router.push('/forgot-password');
  }
});

async function onSubmit() {
  loading.value = true;
  try {
    await authStore.resetPassword(form);
    $q.notify({
      type: 'positive',
      message: 'Senha redefinida com sucesso! Faça login.',
      position: 'top',
      icon: 'check_circle',
    });
    router.push('/login');
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Erro ao redefinir senha. Verifique o link.',
      position: 'top',
    });
  } finally {
    loading.value = false;
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
