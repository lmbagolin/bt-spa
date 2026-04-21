const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } },
      { path: 'arenas', component: () => import('pages/ArenaPage.vue'), meta: { requiresAuth: true } },
      { path: 'discover', component: () => import('pages/DiscoverArenasPage.vue'), meta: { requiresAuth: true } },
      { path: 'profile', component: () => import('pages/PlayerProfilePage.vue'), meta: { requiresAuth: true } },
      { path: 'arena/:id/public', name: 'arena-public', component: () => import('pages/ArenaPublicPage.vue'), meta: { requiresAuth: true } }
    ],
  },
  {
    path: '/admin/arena/:id',
    component: () => import('layouts/ArenaAdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: () => import('pages/ArenaDashboardPage.vue') },
      { path: 'tournaments', component: () => import('pages/ArenaTournamentsPage.vue') },
      { path: 'players', component: () => import('pages/ArenaPlayersPage.vue') },
      { path: 'leagues', component: () => import('pages/ArenaLeaguesPage.vue') },
      { path: 'leagues/:leagueId', component: () => import('pages/ArenaLeagueDetailPage.vue') },
      { path: 'settings', component: () => import('pages/ArenaSettingsPage.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') },
      { path: 'forgot-password', component: () => import('pages/ForgotPasswordPage.vue') },
      { path: 'reset-password', component: () => import('pages/ResetPasswordPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
