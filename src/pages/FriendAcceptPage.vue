<template>
  <q-page class="flex flex-center q-pa-lg">
    <q-card class="text-center shadow-card" style="width: 420px; max-width: 95vw;">
      <!-- Loading -->
      <q-card-section v-if="loading" class="q-pa-xl">
        <q-spinner-dots color="primary" size="48px" />
        <div class="text-sm text-surface-500 q-mt-md">{{ $t('friends.accept_loading') }}</div>
      </q-card-section>

      <!-- Erro -->
      <q-card-section v-else-if="error" class="q-pa-xl">
        <q-icon name="error_outline" size="64px" color="negative" class="q-mb-md" />
        <div class="text-base text-bold text-surface-900 q-mb-sm">{{ error }}</div>
        <q-btn unelevated no-caps label="Ir para o início" color="primary" class="q-mt-md text-bold"
          @click="router.push({ name: 'player-leagues' })" />
      </q-card-section>

      <!-- Sucesso após aceitar -->
      <q-card-section v-else-if="accepted" class="q-pa-xl">
        <q-icon name="check_circle" size="64px" color="positive" class="q-mb-md" />
        <div class="text-base text-bold text-surface-900 q-mb-sm">{{ $t('friends.accept_success') }}</div>
        <q-btn unelevated no-caps label="Ver Amigos" color="primary" class="q-mt-md text-bold"
          @click="router.push({ name: 'player-friends' })" />
      </q-card-section>

      <!-- Confirmação -->
      <template v-else-if="friendInfo">
        <q-card-section class="q-pa-xl">
          <q-avatar icon="person_add" color="primary" text-color="white" size="64px" class="q-mb-md shadow-md" />
          <div class="text-xl text-bold text-surface-900 q-mb-xs">{{ $t('friends.accept_title') }}</div>
          <div class="text-sm text-surface-500">
            {{ $t('friends.accept_desc', { requester: friendInfo.requester_name }) }}
          </div>
        </q-card-section>

        <q-separator color="surface-100" />

        <q-card-section class="q-pa-lg">
          <div class="confirm-block q-pa-md">
            <div class="row items-center justify-between q-mb-xs">
              <span class="text-xs text-surface-400">De</span>
              <span class="text-sm text-bold text-surface-900">{{ friendInfo.requester_name }}</span>
            </div>
            <div class="row items-center justify-between">
              <span class="text-xs text-surface-400">Para</span>
              <span class="text-sm text-bold text-surface-900">{{ friendInfo.addressee_name }}</span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="q-pa-lg q-pt-none">
          <q-btn
            unelevated no-caps icon="check" :label="$t('friends.accept_btn')"
            color="primary" class="text-bold full-width"
            size="lg"
            :loading="accepting"
            @click="doAccept"
          />
        </q-card-actions>
      </template>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useFriendStore } from 'src/stores/friend';

const route       = useRoute();
const router      = useRouter();
const { t }       = useI18n();
const friendStore = useFriendStore();

const token      = route.params.token;
const loading    = ref(true);
const accepting  = ref(false);
const accepted   = ref(false);
const error      = ref('');
const friendInfo = ref(null);

onMounted(async () => {
  try {
    friendInfo.value = await friendStore.fetchByToken(token);
  } catch (e) {
    const status = e?.response?.status;
    if (status === 410) {
      error.value = t('friends.accept_expired');
    } else {
      error.value = t('friends.accept_invalid');
    }
  } finally {
    loading.value = false;
  }
});

async function doAccept() {
  accepting.value = true;
  try {
    await friendStore.acceptByToken(token);
    accepted.value = true;
  } catch (e) {
    const status = e?.response?.status;
    error.value = status === 410 ? t('friends.accept_expired') : t('friends.accept_invalid');
  } finally {
    accepting.value = false;
  }
}
</script>

<style scoped>
.confirm-block {
  background: var(--surface-50);
  border: 1px solid var(--surface-100);
  border-radius: 8px;
}
</style>
