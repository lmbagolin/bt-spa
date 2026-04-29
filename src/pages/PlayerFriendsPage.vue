<template>
  <q-page class="q-pa-lg">
    <PageHeader :title="$t('friends.page_title')" :back="() => router.back()">
      <q-btn
        unelevated no-caps icon="person_add"
        :label="$t('friends.add_friend')"
        color="primary" class="text-bold"
        @click="showAddDialog = true"
      />
    </PageHeader>

    <!-- Tabs -->
    <q-tabs
      v-model="tab"
      align="left"
      dense
      class="q-mb-lg text-surface-600"
      active-color="primary"
      indicator-color="primary"
    >
      <q-tab name="friends" :label="$t('friends.tab_friends')" />
      <q-tab name="requests" :label="$t('friends.tab_requests')">
        <q-badge v-if="friendStore.requests.length" color="negative" floating>
          {{ friendStore.requests.length }}
        </q-badge>
      </q-tab>
      <q-tab name="sent" :label="$t('friends.tab_sent')" />
    </q-tabs>

    <div v-if="friendStore.loading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <template v-else>
      <!-- Meus Amigos -->
      <div v-show="tab === 'friends'">
        <div v-if="!friendStore.friends.length" class="text-center q-pa-xl">
          <q-icon name="group" size="64px" color="surface-200" class="q-mb-md" />
          <div class="text-base text-bold text-surface-400 q-mb-xs">{{ $t('friends.no_friends') }}</div>
          <div class="text-sm text-surface-300">{{ $t('friends.no_friends_hint') }}</div>
        </div>
        <div v-else class="row q-col-gutter-md">
          <div
            v-for="item in friendStore.friends"
            :key="item.id"
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card class="shadow-card">
              <q-card-section class="row items-center no-wrap q-gutter-md">
                <q-avatar size="48px" color="primary" text-color="white" class="text-bold text-lg flex-shrink-0">
                  <img v-if="item.friend?.image_url" :src="item.friend.image_url" />
                  <template v-else>{{ item.friend?.name?.charAt(0)?.toUpperCase() || '?' }}</template>
                </q-avatar>
                <div class="col">
                  <div class="text-sm text-bold text-surface-900">{{ item.friend?.name }}</div>
                  <div v-if="item.friend?.nickname" class="text-xs text-surface-400">{{ item.friend.nickname }}</div>
                  <div class="row items-center q-gutter-xs q-mt-xs">
                    <q-chip v-if="item.friend?.level" dense color="surface-100" text-color="surface-600" class="text-xs q-ma-none">
                      {{ item.friend.level }}
                    </q-chip>
                    <q-chip v-if="item.friend?.city" dense color="surface-100" text-color="surface-600" class="text-xs q-ma-none">
                      {{ item.friend.city }}
                    </q-chip>
                  </div>
                </div>
              </q-card-section>
              <q-separator color="surface-100" />
              <q-card-actions class="q-px-md q-py-xs">
                <q-space />
                <q-btn
                  flat dense no-caps size="sm" icon="person_remove"
                  :label="$t('friends.btn_remove')"
                  color="negative" class="text-bold"
                  :loading="friendStore.loadingAction"
                  @click="confirmRemove(item)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Pedidos Recebidos -->
      <div v-show="tab === 'requests'">
        <div v-if="!friendStore.requests.length" class="text-center q-pa-xl">
          <q-icon name="mark_email_read" size="64px" color="surface-200" class="q-mb-md" />
          <div class="text-base text-bold text-surface-400">{{ $t('friends.no_requests') }}</div>
        </div>
        <div v-else class="column q-gutter-sm">
          <q-card
            v-for="req in friendStore.requests"
            :key="req.id"
            class="shadow-card"
          >
            <q-card-section class="row items-center no-wrap q-gutter-md">
              <q-avatar size="44px" color="primary" text-color="white" class="text-bold flex-shrink-0">
                {{ req.requester?.name?.charAt(0)?.toUpperCase() || '?' }}
              </q-avatar>
              <div class="col">
                <div class="text-sm text-bold text-surface-900">{{ req.requester?.name }}</div>
                <div v-if="req.requester?.city" class="text-xs text-surface-400">{{ req.requester.city }}</div>
              </div>
              <div class="row q-gutter-sm no-wrap">
                <q-btn
                  unelevated no-caps size="sm" icon="check"
                  :label="$t('friends.btn_accept')"
                  color="positive" class="text-bold"
                  :loading="friendStore.loadingAction"
                  @click="accept(req.id)"
                />
                <q-btn
                  outline no-caps size="sm" icon="close"
                  :label="$t('friends.btn_reject')"
                  color="negative" class="text-bold"
                  :loading="friendStore.loadingAction"
                  @click="reject(req.id)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Pedidos Enviados -->
      <div v-show="tab === 'sent'">
        <div v-if="!friendStore.sent.length" class="text-center q-pa-xl">
          <q-icon name="send" size="64px" color="surface-200" class="q-mb-md" />
          <div class="text-base text-bold text-surface-400">{{ $t('friends.no_sent') }}</div>
        </div>
        <div v-else class="column q-gutter-sm">
          <q-card
            v-for="req in friendStore.sent"
            :key="req.id"
            class="shadow-card"
          >
            <q-card-section class="row items-center no-wrap q-gutter-md">
              <q-avatar size="44px" color="surface-200" text-color="surface-600" class="text-bold flex-shrink-0">
                {{ req.addressee?.name?.charAt(0)?.toUpperCase() || '?' }}
              </q-avatar>
              <div class="col">
                <div class="text-sm text-bold text-surface-900">{{ req.addressee?.name }}</div>
                <div v-if="req.addressee?.city" class="text-xs text-surface-400">{{ req.addressee.city }}</div>
              </div>
              <div class="row items-center q-gutter-sm no-wrap">
                <q-chip dense color="amber-1" text-color="amber-9" class="text-bold text-xs">
                  {{ $t('friends.chip_pending') }}
                </q-chip>
                <q-btn
                  flat dense no-caps size="sm" icon="cancel"
                  :label="$t('friends.btn_cancel_request')"
                  color="surface-500" class="text-bold"
                  :loading="friendStore.loadingAction"
                  @click="cancelRequest(req.id)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>

    <!-- Dialog: Adicionar Amigo -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="width: 400px; max-width: 95vw;" class="radius-lg overflow-hidden">
        <q-card-section class="row items-center q-pa-lg bg-surface-50">
          <q-avatar icon="person_add" color="primary" text-color="white" />
          <div class="text-lg text-bold text-surface-900 q-ml-md">{{ $t('friends.add_dialog_title') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="surface-400" />
        </q-card-section>
        <q-separator color="surface-100" />
        <q-card-section class="q-pa-lg">
          <BtInput
            v-model="addEmail"
            :label="$t('friends.email_label')"
            :placeholder="$t('friends.email_placeholder')"
            type="email"
            autofocus
            @keyup.enter="sendRequest"
          />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-lg bg-surface-50">
          <q-btn flat no-caps :label="$t('friends.btn_cancel')" v-close-popup color="surface-500" class="text-bold" />
          <q-btn
            unelevated no-caps icon="send" :label="$t('friends.btn_send')"
            color="primary" class="text-bold q-px-lg"
            :loading="friendStore.loadingAction"
            :disable="!addEmail.trim()"
            @click="sendRequest"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog: Confirmar remoção -->
    <q-dialog v-model="showRemoveDialog">
      <q-card style="width: 360px; max-width: 95vw;">
        <q-card-section>
          <div class="text-base text-bold text-surface-900">{{ $t('friends.btn_remove') }}</div>
          <p class="text-sm text-surface-600 q-mt-sm q-mb-none">
            {{ $t('friends.confirm_remove', { name: removeTarget?.friend?.name }) }}
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancelar" v-close-popup color="surface-500" />
          <q-btn
            unelevated no-caps :label="$t('friends.btn_remove')"
            color="negative" class="text-bold"
            :loading="friendStore.loadingAction"
            @click="doRemove"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import PageHeader from 'src/components/others/PageHeader.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useFriendStore } from 'src/stores/friend';

const router      = useRouter();
const $q          = useQuasar();
const { t }       = useI18n();
const friendStore = useFriendStore();

const tab            = ref('friends');
const showAddDialog  = ref(false);
const showRemoveDialog = ref(false);
const addEmail       = ref('');
const removeTarget   = ref(null);

onMounted(() => Promise.all([friendStore.fetchFriends(), friendStore.fetchRequests()]));

async function sendRequest() {
  try {
    await friendStore.sendRequest(addEmail.value.trim());
    $q.notify({ type: 'positive', message: t('friends.notify_sent'), position: 'top' });
    showAddDialog.value = false;
    addEmail.value = '';
  } catch (e) {
    const msg = e?.response?.data?.message ?? t('friends.notify_error');
    $q.notify({ type: 'negative', message: msg, position: 'top' });
  }
}

async function accept(id) {
  await friendStore.acceptRequest(id);
  $q.notify({ type: 'positive', message: t('friends.notify_accepted'), position: 'top' });
}

async function reject(id) {
  await friendStore.rejectRequest(id);
  $q.notify({ type: 'info', message: t('friends.notify_rejected'), position: 'top' });
}

function confirmRemove(item) {
  removeTarget.value = item;
  showRemoveDialog.value = true;
}

async function doRemove() {
  await friendStore.removeFriend(removeTarget.value.id);
  $q.notify({ type: 'info', message: t('friends.notify_removed'), position: 'top' });
  showRemoveDialog.value = false;
}

async function cancelRequest(id) {
  await friendStore.cancelRequest(id);
  $q.notify({ type: 'info', message: t('friends.notify_cancelled'), position: 'top' });
}
</script>

<style scoped>
.radius-lg { border-radius: 12px; }
.flex-shrink-0 { flex-shrink: 0; }
</style>
