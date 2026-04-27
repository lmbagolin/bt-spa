<template>
  <q-page class="flex flex-center bg-gradient">
    <q-card class="auth-card q-pa-lg shadow-24">
      <q-card-section class="text-center">
        <div class="text-h4 text-primary text-bold q-mb-xs">{{ $t('register.title') }}</div>
        <div class="text-subtitle1 text-grey-7">{{ $t('register.subtitle') }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <BtInput
            v-model="form.name"
            :label="$t('register.full_name')"
            :placeholder="$t('register.full_name_placeholder')"
          >
            <template #prefix>
              <q-icon name="person" color="primary" />
            </template>
          </BtInput>

          <BtInput
            v-model="form.email"
            type="email"
            :label="$t('common.email')"
            :placeholder="$t('register.email_placeholder')"
          >
            <template #prefix>
              <q-icon name="email" color="primary" />
            </template>
          </BtInput>

          <BtInput
            v-model="form.password"
            type="password"
            :label="$t('register.password')"
            :placeholder="$t('register.password_placeholder')"
            :hint="$t('register.password_hint')"
          >
            <template #prefix>
              <q-icon name="lock" color="primary" />
            </template>
          </BtInput>

          <BtInput
            v-model="form.password_confirmation"
            type="password"
            :label="$t('register.password_confirm')"
            :placeholder="$t('register.password_confirm_placeholder')"
          >
            <template #prefix>
              <q-icon name="check_circle" color="primary" />
            </template>
          </BtInput>

          <div class="q-mt-xl">
            <q-btn
              :label="$t('register.submit')"
              type="submit"
              color="primary"
              class="full-width text-bold q-py-sm shadow-10"
              :loading="loading"
            />
          </div>

          <div class="text-center q-mt-md">
            {{ $t('register.already_have_account') }}
            <router-link to="/login" class="text-primary text-bold" style="text-decoration: none">
              {{ $t('register.access_now') }}
            </router-link>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
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
const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

async function onSubmit() {
  loading.value = true;
  try {
    await auth.register(form);
    $q.notify({
      type: 'positive',
      message: t('register.notify_success'),
      position: 'top',
    });
    router.push('/');
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || t('register.notify_error'),
      position: 'top',
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
.auth-card {
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}
</style>
