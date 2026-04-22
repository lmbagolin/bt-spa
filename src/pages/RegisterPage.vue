<template>
  <q-page class="flex flex-center bg-gradient">
    <q-card class="auth-card q-pa-lg shadow-24">
      <q-card-section class="text-center">
        <div class="text-h4 text-primary text-bold q-mb-xs">Criar Conta</div>
        <div class="text-subtitle1 text-grey-7">Gestão de ligas sem complicação</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <BtInput v-model="form.name" label="Nome Completo" placeholder="Seu nome completo">
            <template #prefix>
              <q-icon name="person" color="primary" />
            </template>
          </BtInput>

          <BtInput v-model="form.email" type="email" label="E-mail" placeholder="seu@email.com">
            <template #prefix>
              <q-icon name="email" color="primary" />
            </template>
          </BtInput>

          <BtInput
            v-model="form.password"
            type="password"
            label="Senha"
            placeholder="Mínimo 8 caracteres"
            hint="Use pelo menos 8 caracteres"
          >
            <template #prefix>
              <q-icon name="lock" color="primary" />
            </template>
          </BtInput>

          <BtInput
            v-model="form.password_confirmation"
            type="password"
            label="Confirmar Senha"
            placeholder="Repita sua senha"
          >
            <template #prefix>
              <q-icon name="check_circle" color="primary" />
            </template>
          </BtInput>

          <div class="q-mt-xl">
            <q-btn
              label="Cadastrar"
              type="submit"
              color="primary"
              class="full-width text-bold q-py-sm shadow-10"
              :loading="loading"
            />
          </div>

          <div class="text-center q-mt-md">
            Já tem uma conta?
            <router-link to="/login" class="text-primary text-bold" style="text-decoration: none">
              Acesse agora
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

const $q = useQuasar();
const router = useRouter();
const auth = useAuthStore();

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
      message: 'Conta criada com sucesso!',
      position: 'top',
    });
    router.push('/');
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Erro ao criar conta. Verifique os dados.',
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
