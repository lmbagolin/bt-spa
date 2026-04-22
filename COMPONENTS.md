# Beach Tennis (Bt) Components Library

> Componentes customizados Bt baseados no padrão Sakai para o Beach Tennis SPA

---

## 📦 Componentes Disponíveis

| Componente     | Descrição                      | Localização                       |
| -------------- | ------------------------------ | --------------------------------- |
| `BtInput`      | Input text field customizado   | `src/components/BtInput.vue`      |
| `BtSelect`     | Select/dropdown customizado    | `src/components/BtSelect.vue`     |
| `BtTextarea`   | Textarea com contador          | `src/components/BtTextarea.vue`   |
| `BtDatePicker` | Date picker com popup          | `src/components/BtDatePicker.vue` |
| `BtCheckbox`   | Checkbox customizado           | `src/components/BtCheckbox.vue`   |
| `BtRadio`      | Radio button customizado       | `src/components/BtRadio.vue`      |
| `BtButton`     | Button com múltiplas variantes | `src/components/BtButton.vue`     |
| `BtCard`       | Card com header, body, footer  | `src/components/BtCard.vue`       |
| `BtDialog`     | Modal dialog customizado       | `src/components/BtDialog.vue`     |
| `BtTable`      | Table com paginação e estilo   | `src/components/BtTable.vue`      |
| `BtBanner`     | Alert/Banner com variantes     | `src/components/BtBanner.vue`     |

---

## 🚀 Como Usar

### Import automático (se global)

Se registrados globalmente em `main.js`:

```vue
<template>
  <BtInput v-model="name" label="Nome" />
</template>
```

### Import manual

```vue
<script setup>
import BtInput from '@/components/BtInput.vue';
</script>

<template>
  <BtInput v-model="name" label="Nome" />
</template>
```

---

## 📋 Documentação de Componentes

### 1. BtInput

**Input text field com validação e dicas**

```vue
<template>
  <BtInput
    v-model="email"
    label="Email"
    type="email"
    placeholder="seu@email.com"
    hint="Email válido para login"
    icon="email"
    clearable
    @update:model-value="onEmailChange"
  />
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');

const onEmailChange = (value) => {
  console.log('Email:', value);
};
</script>
```

**Props:**

| Prop           | Type             | Default | Descrição                                 |
| -------------- | ---------------- | ------- | ----------------------------------------- |
| `modelValue`   | string \| number | ''      | Valor do input                            |
| `label`        | string           | -       | Label do input                            |
| `type`         | string           | 'text'  | Tipo (text, email, password, number, etc) |
| `placeholder`  | string           | -       | Placeholder text                          |
| `hint`         | string           | -       | Dica abaixo do input                      |
| `disabled`     | boolean          | false   | Desabilitar input                         |
| `readonly`     | boolean          | false   | Modo somente leitura                      |
| `error`        | boolean          | false   | Mostrar estado de erro                    |
| `errorMessage` | string           | -       | Mensagem de erro                          |
| `icon`         | string           | -       | Ícone Quasar                              |
| `clearable`    | boolean          | false   | Mostrar botão limpar                      |
| `size`         | string           | 'md'    | Tamanho (sm, md, lg)                      |

---

### 2. BtSelect

**Select/dropdown com filtro**

```vue
<template>
  <BtSelect
    v-model="selectedCity"
    label="Cidade"
    :options="cities"
    placeholder="Selecione uma cidade"
    clearable
    filterable
  />
</template>

<script setup>
import { ref } from 'vue';

const selectedCity = ref(null);
const cities = ref([
  { label: 'São Paulo', value: 'sp' },
  { label: 'Rio de Janeiro', value: 'rj' },
  { label: 'Belo Horizonte', value: 'bh' },
]);
</script>
```

**Props:**

| Prop           | Type           | Default | Descrição                   |
| -------------- | -------------- | ------- | --------------------------- |
| `modelValue`   | any            | null    | Valor selecionado           |
| `options`      | SelectOption[] | []      | Array de opções             |
| `label`        | string         | -       | Label do select             |
| `placeholder`  | string         | -       | Texto placeholder           |
| `disabled`     | boolean        | false   | Desabilitar select          |
| `error`        | boolean        | false   | Estado de erro              |
| `errorMessage` | string         | -       | Mensagem de erro            |
| `clearable`    | boolean        | false   | Mostrar botão limpar        |
| `filterable`   | boolean        | true    | Habilitar filtro            |
| `multiple`     | boolean        | false   | Permitir múltiplas seleções |

**Interface SelectOption:**

```typescript
interface SelectOption {
  label: string;
  value: any;
}
```

---

### 3. BtCard

**Card com header, body e footer**

```vue
<template>
  <BtCard title="Tournament Info" subtitle="Details about the tournament" padding="lg" hoverable>
    <p>Card content goes here</p>

    <template #header-action>
      <q-btn flat icon="edit" size="sm" />
    </template>

    <template #footer>
      <q-btn label="Cancel" flat />
      <q-btn label="Save" color="primary" />
    </template>
  </BtCard>
</template>
```

**Props:**

| Prop        | Type    | Default   | Descrição                          |
| ----------- | ------- | --------- | ---------------------------------- |
| `title`     | string  | -         | Título do card                     |
| `subtitle`  | string  | -         | Subtítulo do card                  |
| `padding`   | string  | 'md'      | Padding (sm, md, lg)               |
| `hoverable` | boolean | false     | Efeito hover lift                  |
| `border`    | boolean | false     | Mostrar borda                      |
| `variant`   | string  | 'default' | Variante (default, flat, elevated) |

**Slots:**

- `default` - Conteúdo principal
- `header` - Customizar header
- `header-action` - Ações no header
- `footer` - Footer do card

---

### 4. BtButton

**Button com múltiplas variantes**

```vue
<template>
  <div class="q-gutter-md">
    <!-- Variantas básicas -->
    <BtButton label="Primary" variant="primary" />
    <BtButton label="Secondary" variant="secondary" />
    <BtButton label="Danger" variant="danger" />
    <BtButton label="Success" variant="success" />

    <!-- Com ícones -->
    <BtButton icon="add" label="Criar" variant="primary" />
    <BtButton icon="delete" label="Deletar" variant="danger" />

    <!-- Tamanhos -->
    <BtButton label="Small" size="sm" />
    <BtButton label="Large" size="lg" />

    <!-- Estados -->
    <BtButton label="Loading" :loading="isLoading" />
    <BtButton label="Disabled" disabled />

    <!-- Outline -->
    <BtButton label="Outline" variant="outline" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isLoading = ref(false);
</script>
```

**Props:**

| Prop        | Type    | Default   | Descrição                                                         |
| ----------- | ------- | --------- | ----------------------------------------------------------------- |
| `label`     | string  | -         | Texto do button                                                   |
| `icon`      | string  | -         | Ícone Quasar                                                      |
| `variant`   | string  | 'primary' | primary, secondary, danger, success, warning, info, outline, flat |
| `size`      | string  | 'md'      | sm, md, lg                                                        |
| `disabled`  | boolean | false     | Desabilitar                                                       |
| `loading`   | boolean | false     | Estado de loading                                                 |
| `fullWidth` | boolean | false     | Largura total                                                     |
| `rounded`   | boolean | false     | Bordas arredondadas                                               |
| `to`        | string  | -         | Vue Router link                                                   |
| `href`      | string  | -         | Link externo                                                      |
| `type`      | string  | 'button'  | button, submit, reset                                             |

---

### 5. BtDatePicker

**Date picker com popup calendar**

```vue
<template>
  <BtDatePicker
    v-model="birthDate"
    label="Data de Nascimento"
    placeholder="dd/mm/yyyy"
    clearable
    max-date="2010-12-31"
  />
</template>

<script setup>
import { ref } from 'vue';

const birthDate = ref(null);
</script>
```

**Props:**

| Prop           | Type    | Default      | Descrição            |
| -------------- | ------- | ------------ | -------------------- |
| `modelValue`   | string  | null         | Valor da data        |
| `label`        | string  | -            | Label                |
| `placeholder`  | string  | 'dd/mm/yyyy' | Placeholder          |
| `clearable`    | boolean | true         | Mostrar botão limpar |
| `minDate`      | string  | -            | Data mínima          |
| `maxDate`      | string  | -            | Data máxima          |
| `error`        | boolean | false        | Estado de erro       |
| `errorMessage` | string  | -            | Mensagem de erro     |

---

### 6. BtTextarea

**Textarea com contador de caracteres**

```vue
<template>
  <BtTextarea
    v-model="description"
    label="Descrição"
    placeholder="Digite a descrição..."
    :rows="5"
    :max-length="500"
    show-counter
  />
</template>

<script setup>
import { ref } from 'vue';

const description = ref('');
</script>
```

**Props:**

| Prop           | Type    | Default | Descrição            |
| -------------- | ------- | ------- | -------------------- |
| `modelValue`   | string  | ''      | Conteúdo             |
| `label`        | string  | -       | Label                |
| `placeholder`  | string  | -       | Placeholder          |
| `rows`         | number  | 4       | Número de linhas     |
| `maxLength`    | number  | -       | Máximo de caracteres |
| `showCounter`  | boolean | true    | Mostrar contador     |
| `error`        | boolean | false   | Estado de erro       |
| `errorMessage` | string  | -       | Mensagem de erro     |

---

### 7. BtCheckbox

**Checkbox customizado**

```vue
<template>
  <div class="q-gutter-md">
    <BtCheckbox v-model="agreed" label="Concordo com os termos" />
    <BtCheckbox v-model="selectedFeatures" value="feature1" label="Feature 1" />
    <BtCheckbox v-model="selectedFeatures" value="feature2" label="Feature 2" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const agreed = ref(false);
const selectedFeatures = ref([]);
</script>
```

**Props:**

| Prop         | Type             | Default | Descrição         |
| ------------ | ---------------- | ------- | ----------------- |
| `modelValue` | boolean \| array | -       | Valor             |
| `label`      | string           | -       | Label             |
| `value`      | any              | -       | Valor para arrays |
| `disabled`   | boolean          | false   | Desabilitar       |
| `size`       | string           | 'md'    | sm, md, lg        |

---

### 8. BtRadio

**Radio button customizado**

```vue
<template>
  <div class="q-gutter-md">
    <BtRadio v-model="selectedOption" value="option1" label="Opção 1" />
    <BtRadio v-model="selectedOption" value="option2" label="Opção 2" />
    <BtRadio v-model="selectedOption" value="option3" label="Opção 3" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedOption = ref('option1');
</script>
```

**Props:**

| Prop         | Type    | Default | Descrição         |
| ------------ | ------- | ------- | ----------------- |
| `modelValue` | any     | -       | Valor selecionado |
| `value`      | any     | -       | Valor desta opção |
| `label`      | string  | -       | Label             |
| `disabled`   | boolean | false   | Desabilitar       |
| `size`       | string  | 'md'    | sm, md, lg        |

---

### 9. BtDialog

**Modal dialog customizado**

```vue
<template>
  <div>
    <BtButton label="Abrir Dialog" @click="dialogOpen = true" />

    <BtDialog v-model="dialogOpen" title="Confirmar Ação" closable>
      <p>Deseja continuar com esta ação?</p>

      <template #actions>
        <BtButton label="Cancelar" variant="flat" @click="dialogOpen = false" />
        <BtButton label="Confirmar" variant="primary" @click="handleConfirm" />
      </template>
    </BtDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const dialogOpen = ref(false);

const handleConfirm = () => {
  console.log('Confirmado!');
  dialogOpen.value = false;
};
</script>
```

**Props:**

| Prop         | Type    | Default    | Descrição                          |
| ------------ | ------- | ---------- | ---------------------------------- |
| `modelValue` | boolean | false      | Aberto/fechado                     |
| `title`      | string  | -          | Título                             |
| `closable`   | boolean | true       | Mostrar botão fechar               |
| `persistent` | boolean | false      | Não fechar ao clicar fora          |
| `position`   | string  | 'standard' | top, right, bottom, left, standard |

**Slots:**

- `default` - Conteúdo do dialog
- `actions` - Botões de ação no footer

---

### 10. BtTable

**Table com paginação, sorting e estilo**

```vue
<template>
  <BtTable
    title="Tournaments"
    subtitle="All registered tournaments"
    :rows="tournaments"
    :columns="columns"
    row-key="id"
  >
    <!-- Customizar coluna -->
    <template #cell-status="{ value }">
      <q-badge :color="value === 'active' ? 'positive' : 'negative'" :label="value" />
    </template>

    <!-- Ações -->
    <template #cell-actions="{ row }">
      <BtButton icon="edit" size="sm" variant="flat" @click="editTournament(row.id)" />
      <BtButton
        icon="delete"
        size="sm"
        variant="flat"
        color="negative"
        @click="deleteTournament(row.id)"
      />
    </template>

    <!-- Header com botão novo -->
    <template #header>
      <BtButton icon="add" label="Novo Tournament" size="sm" variant="primary" />
    </template>
  </BtTable>
</template>

<script setup>
import { ref } from 'vue';

const tournaments = ref([
  { id: 1, name: 'Tournament 1', status: 'active' },
  { id: 2, name: 'Tournament 2', status: 'completed' },
]);

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
];

const editTournament = (id) => console.log('Edit:', id);
const deleteTournament = (id) => console.log('Delete:', id);
</script>
```

**Props:**

| Prop          | Type     | Default     | Descrição             |
| ------------- | -------- | ----------- | --------------------- |
| `rows`        | any[]    | []          | Dados da tabela       |
| `columns`     | Column[] | []          | Colunas               |
| `rowKey`      | string   | 'id'        | Chave única por linha |
| `title`       | string   | -           | Título                |
| `subtitle`    | string   | -           | Subtítulo             |
| `loading`     | boolean  | false       | Estado de loading     |
| `noDataLabel` | string   | 'Sem dados' | Mensagem sem dados    |
| `rowsPerPage` | number   | 10          | Linhas por página     |

**Slots:**

- `default` - Linhas customizadas
- `cell-{name}` - Customizar coluna
- `cell-actions` - Coluna de ações
- `header` - Conteúdo no header

---

### 11. BtBanner

**Alert/Banner com variantes**

```vue
<template>
  <div class="q-gutter-md">
    <!-- Sucesso -->
    <BtBanner
      v-model="showSuccess"
      variant="success"
      title="Sucesso!"
      message="Ação realizada com sucesso"
      closable
    />

    <!-- Aviso -->
    <BtBanner
      v-model="showWarning"
      variant="warning"
      title="Aviso"
      message="Verifique os dados antes de continuar"
    />

    <!-- Erro -->
    <BtBanner
      v-model="showError"
      variant="danger"
      title="Erro!"
      message="Algo deu errado. Tente novamente"
    />

    <!-- Informação -->
    <BtBanner
      v-model="showInfo"
      variant="info"
      title="Informação"
      message="Novos dados disponíveis"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showSuccess = ref(true);
const showWarning = ref(true);
const showError = ref(true);
const showInfo = ref(true);
</script>
```

**Props:**

| Prop         | Type    | Default | Descrição                      |
| ------------ | ------- | ------- | ------------------------------ |
| `modelValue` | boolean | true    | Visível                        |
| `variant`    | string  | 'info'  | success, warning, danger, info |
| `title`      | string  | -       | Título                         |
| `message`    | string  | -       | Mensagem                       |
| `closable`   | boolean | true    | Mostrar botão fechar           |
| `icon`       | string  | -       | Ícone customizado              |

---

## 🎨 Temas e Cores

Todos os componentes usam as variáveis de cor definidas em `bt-variables.scss`:

- **Primary**: #1976d2 (Azul Oceano)
- **Success**: #27ae60
- **Warning**: #f39c12
- **Danger**: #e74c3c
- **Info**: #3498db

---

## 📱 Responsividade

Todos os componentes são responsivos e testados para:

- ✅ Desktop (1024px+)
- ✅ Tablet (600px - 1024px)
- ✅ Mobile (< 600px)

---

## 💡 Boas Práticas

1. **Use TypeScript**: Todos os componentes têm tipos definidos
2. **Validação**: Sempre defina `error` e `errorMessage` quando necessário
3. **Feedback visual**: Use `loading` para operações assíncronas
4. **Acessibilidade**: Todos têm `label` e atributos ARIA
5. **Reusabilidade**: Combine componentes para criar formulários complexos

---

## 🚀 Próximos Passos

- [ ] Registrar componentes globalmente em `main.js`
- [ ] Criar exemplos de formulários completos
- [ ] Adicionar testes unitários
- [ ] Documentar composables para validação

---

**Última atualização**: 2026-04-21
**Versão**: 1.0.0
