<template>
  <q-page class="flex flex-center bg-gradient">
    <q-card class="auth-card q-pa-lg shadow-24">
      <q-card-section class="text-center">
        <div class="text-h4 text-primary text-bold q-mb-xs">Criar Conta</div>
        <div class="text-subtitle1 text-grey-7">Junte-se à maior plataforma de Beach Tennis</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.name"
            label="Nome Completo"
            outlined
            lazy-rules
            :rules="[val => !!val || 'Nome é obrigatório']"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model="form.email"
            type="email"
            label="E-mail"
            outlined
            lazy-rules
            :rules="[val => !!val || 'E-mail é obrigatório']"
          >
            <template v-slot:prepend>
              <q-icon name="email" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model="form.password"
            type="password"
            label="Senha"
            outlined
            lazy-rules
            :rules="[val => !!val || 'Senha é obrigatória', val => val.length >= 8 || 'Mínimo 8 caracteres']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model="form.password_confirmation"
            type="password"
            label="Confirmar Senha"
            outlined
            lazy-rules
            :rules="[val => val === form.password || 'As senhas não coincidem']"
          >
            <template v-slot:prepend>
              <q-icon name="check_circle" color="primary" />
            </template>
          </q-input>

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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

async function onSubmit() {
  loading.value = true
  try {
    await auth.register(form)
    $q.notify({
      type: 'positive',
      message: 'Conta criada com sucesso!',
      position: 'top'
    })
    router.push('/')
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Erro ao criar conta. Verifique os dados.',
      position: 'top'
    })
  } finally {
    loading.value = false
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
