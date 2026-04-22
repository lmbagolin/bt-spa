<template>
  <div class="login-wrapper">
    <q-card class="auth-card q-pa-md">
      <q-card-section class="text-center q-pb-md">
        <img src="~assets/logo-mini-100.png" alt="Pontua" class="login-logo q-mb-sm" />
        <h1 class="text-h5 text-bold text-surface-900 q-my-none">Bem-vindo de volta</h1>
        <p class="text-body2 text-surface-500 q-mb-none">Entre na sua conta para continuar</p>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-y-sm">
          <BtInput
            v-model="form.email"
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            :error="!!emailError"
            :error-message="emailError"
          >
            <template #prefix>
              <q-icon name="email" size="20px" color="surface-400" />
            </template>
          </BtInput>

          <BtInput
            v-model="form.password"
            label="Senha"
            type="password"
            placeholder="Sua senha"
            :error="!!passwordError"
            :error-message="passwordError"
          >
            <template #prefix>
              <q-icon name="lock" size="20px" color="surface-400" />
            </template>
          </BtInput>

          <div class="row justify-end q-mt-xs">
            <q-btn
              flat
              no-caps
              label="Esqueceu a senha?"
              color="primary"
              size="sm"
              dense
              to="/forgot-password"
            />
          </div>

          <div class="q-mt-lg">
            <q-btn
              label="Entrar"
              type="submit"
              color="primary"
              class="full-width q-py-sm"
              unelevated
              :loading="loading"
            />
          </div>

          <div class="text-center q-mt-xl text-body2">
            <span class="text-surface-500">Não tem uma conta?</span>
            <q-btn
              flat
              no-caps
              to="/register"
              color="primary"
              label="Cadastre-se"
              dense
              class="q-ml-xs text-bold"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const auth = useAuthStore();

const loading = ref(false);
const form = reactive({
  email: '',
  password: '',
});

async function onSubmit() {
  loading.value = true;
  try {
    await auth.login(form);
    $q.notify({
      type: 'positive',
      message: 'Login realizado com sucesso!',
      position: 'top',
      icon: 'check_circle',
    });
    router.push('/');
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message || 'Erro ao realizar login. Verifique suas credenciais.',
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

.login-logo {
  height: 72px;
  width: auto;
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
