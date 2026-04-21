---
name: api-integration
description: Axios API integration, error handling, request/response interceptors, and type safety for Laravel backend.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# API Integration with Axios

> **Philosophy:** Type-safe API calls to Laravel backend using Axios interceptors and error handling.
> **Context:** SPA consuming REST API from Beach Tennis Laravel backend with Sanctum auth.

---

## 📋 Quick Reference

| Need | File |
|------|------|
| API client setup | [client-setup.md](client-setup.md) |
| Service layer | [service-layer.md](service-layer.md) |
| Error handling | [error-handling.md](error-handling.md) |
| Interceptors | [interceptors.md](interceptors.md) |
| Authentication | [authentication.md](authentication.md) |
| Request/response types | [response-types.md](response-types.md) |

---

## 🔗 Related Skills

| Need | Skill |
|------|-------|
| State management | `@[skills/pinia-state-management]` |
| Vue 3 components | `@[skills/vue3-typescript]` |
| TypeScript | `@[skills/vue3-typescript#typescript-patterns.md]` |
| Backend API | Laravel documentation |

---

## ✅ Before Starting

- [ ] Understood Axios basics?
- [ ] Know about request/response interceptors?
- [ ] Read [client-setup.md](client-setup.md)?

---

## 🚀 Quick Start

**Create API client (`src/services/api.ts`):**

```typescript
import axios from 'axios'
import type { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

**Create service (`src/services/tournament.ts`):**

```typescript
import api from './api'
import type { Tournament, CreateTournamentInput } from '@/types/models'
import type { ApiResponse } from '@/types/api'

export async function getTournaments(): Promise<Tournament[]> {
  const response = await api.get<ApiResponse<Tournament[]>>('/tournaments')
  return response.data
}

export async function getTournament(id: string): Promise<Tournament> {
  const response = await api.get<ApiResponse<Tournament>>(`/tournaments/${id}`)
  return response.data
}

export async function createTournament(data: CreateTournamentInput): Promise<Tournament> {
  const response = await api.post<ApiResponse<Tournament>>('/tournaments', data)
  return response.data
}

export async function updateTournament(id: string, data: Partial<Tournament>): Promise<Tournament> {
  const response = await api.put<ApiResponse<Tournament>>(`/tournaments/${id}`, data)
  return response.data
}

export async function deleteTournament(id: string): Promise<void> {
  await api.delete(`/tournaments/${id}`)
}
```

**Use in store:**

```typescript
import { useTournamentStore } from '@/stores/tournament'
import * as tournamentService from '@/services/tournament'

export const useTournamentStore = defineStore('tournament', () => {
  const tournaments = ref<Tournament[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTournaments = async () => {
    loading.value = true
    error.value = null
    try {
      tournaments.value = await tournamentService.getTournaments()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch'
    } finally {
      loading.value = false
    }
  }

  return { tournaments, loading, error, fetchTournaments }
})
```

---

## 🏗️ API Response Format

**Laravel returns wrapped in `data` field:**

```json
{
  "data": {
    "id": "1",
    "name": "Tournament Name",
    "status": "active"
  }
}
```

**Type definition:**

```typescript
// src/types/api.ts
export interface ApiResponse<T> {
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
```

---

## 🔐 Authentication

**With Sanctum tokens:**

```typescript
// In auth service
export async function login(email: string, password: string): Promise<string> {
  const response = await api.post<{ token: string }>('/login', { email, password })
  const token = response.data.token
  
  // Store token
  localStorage.setItem('auth_token', token)
  
  // Add to axios headers
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  
  return token
}

export function logout(): void {
  localStorage.removeItem('auth_token')
  delete api.defaults.headers.common['Authorization']
}

export function getToken(): string | null {
  return localStorage.getItem('auth_token')
}
```

---

## ⚠️ Error Handling

**Create error handler:**

```typescript
// src/utils/error.ts
import { useQuasar } from 'quasar'

export function handleApiError(error: unknown): string {
  const $q = useQuasar()
  
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message
    
    // Show toast notification
    $q.notify({
      type: 'negative',
      message,
      icon: 'error',
    })
    
    return message
  }
  
  return 'Unknown error'
}
```

---

## 📚 Resources

| Resource | URL |
|----------|-----|
| Axios Docs | https://axios-http.com |
| Axios Interceptors | https://axios-http.com/docs/interceptors |
| Laravel API Auth | https://laravel.com/docs/13/sanctum |
| TypeScript Axios | https://github.com/microsoft/TypeScript-Axios |

---

## 🎯 Common Patterns

### Fetching Data with Loading State
```typescript
const loading = ref(false)
const data = ref<Data[]>([])

const fetch = async () => {
  loading.value = true
  try {
    data.value = await service.getData()
  } finally {
    loading.value = false
  }
}
```

### Pagination
```typescript
const fetchPage = async (page: number) => {
  const response = await api.get('/items', { params: { page } })
  return response.data
}
```

### Search with Query
```typescript
const search = async (query: string) => {
  const response = await api.get('/search', { params: { q: query } })
  return response.data
}
```

### File Upload
```typescript
const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}
```

---

## ✅ Checklist

- [ ] API base URL configured?
- [ ] Auth token added to all requests?
- [ ] Error handling on all API calls?
- [ ] Response types defined with TypeScript?
- [ ] Interceptors set up for auth/errors?
- [ ] Loading states managed in components?
- [ ] Sensitive data not logged?

---

**For detailed patterns, see:**
- [client-setup.md](client-setup.md) - Axios configuration
- [service-layer.md](service-layer.md) - Service pattern
- [error-handling.md](error-handling.md) - Error strategies
- [interceptors.md](interceptors.md) - Request/response handling
- [authentication.md](authentication.md) - Sanctum auth
