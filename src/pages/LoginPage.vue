<template>
  <div class="login-wrapper">
    <q-card class="auth-card q-pa-md">
      <q-card-section class="text-center q-pb-md">
        <img src="~assets/logo-mini-100.png" alt="Pontua" class="login-logo q-mb-sm" />
        <h1 class="text-h5 text-bold text-surface-900 q-my-none">{{ $t('login.welcome_back') }}</h1>
        <p class="text-body2 text-surface-500 q-mb-none">{{ $t('login.subtitle') }}</p>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-y-sm">
          <BtInput
            v-model="form.email"
            :label="$t('login.email')"
            type="email"
            :error="!!emailError"
            :error-message="emailError"
          >
            <template #prefix>
              <q-icon name="email" size="20px" color="surface-400" />
            </template>
          </BtInput>

          <BtInput
            v-model="form.password"
            :label="$t('login.password')"
            type="password"
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
              :label="$t('login.forgot_password')"
              color="primary"
              size="sm"
              dense
              to="/forgot-password"
            />
          </div>

          <div class="q-mt-lg">
            <q-btn
              :label="$t('login.submit')"
              type="submit"
              color="primary"
              class="full-width q-py-sm"
              unelevated
              :loading="loading"
            />
          </div>

          <div class="text-center q-mt-xl text-body2">
            <span class="text-surface-500">{{ $t('login.no_account') }}</span>
            <q-btn
              flat
              no-caps
              to="/register"
              color="primary"
              :label="$t('login.register_link')"
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
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const router = useRouter();
const auth = useAuthStore();
const { t } = useI18n();

const loading = ref(false);
const emailError = ref('');
const passwordError = ref('');
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
      message: t('login.notify_success'),
      position: 'top',
      icon: 'check_circle',
    });
    router.push('/');
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || t('login.notify_error'),
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
