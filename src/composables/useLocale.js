import { useI18n } from 'vue-i18n';
import { api } from 'boot/axios';

const LOCALE_KEY = 'user_locale';

const LOCALES = [
  { value: 'pt_br', label: 'Português', flag: '🇧🇷', short: 'PT' },
  { value: 'es', label: 'Español', flag: '🇪🇸', short: 'ES' },
];

export function useLocale() {
  const { locale } = useI18n();

  function currentLocale() {
    return LOCALES.find((l) => l.value === locale.value) ?? LOCALES[0];
  }

  async function setLocale(newLocale, saveToServer = true) {
    locale.value = newLocale;
    localStorage.setItem(LOCALE_KEY, newLocale);

    if (saveToServer) {
      try {
        await api.patch('/user/locale', { locale: newLocale });
      } catch {
        // falha silenciosa — preferência já salva no localStorage
      }
    }
  }

  function initLocale(userLocale) {
    const saved = userLocale || localStorage.getItem(LOCALE_KEY);
    const valid = LOCALES.find((l) => l.value === saved);
    if (valid) locale.value = valid.value;
  }

  return { locale, locales: LOCALES, currentLocale, setLocale, initLocale };
}
