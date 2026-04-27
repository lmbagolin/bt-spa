const TIPO_MAP = {
  'rei-da-praia': 'Rei da Praia',
  'dupla-fixa':   'Dupla Fixa',
  'simples':      'Simples',
};

export const tipoOptions = [
  { label: 'Rei da Praia', value: 'rei-da-praia' },
  { label: 'Dupla Fixa',   value: 'dupla-fixa'   },
  { label: 'Simples',      value: 'simples'       },
];

export function tipoLabel(value) {
  return TIPO_MAP[value] ?? value;
}
