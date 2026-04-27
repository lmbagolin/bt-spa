import { createI18n } from 'vue-i18n';
import messages from 'src/i18n';

const LOCALE_KEY = 'user_locale';
const DEFAULT_LOCALE = 'pt_br';
const VALID_LOCALES = ['pt_br', 'es'];

let i18n;

const boot = ({ app }) => {
  const saved = localStorage.getItem(LOCALE_KEY);
  const locale = VALID_LOCALES.includes(saved) ? saved : DEFAULT_LOCALE;

  i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    globalInjection: true,
    messages,
  });

  app.use(i18n);
};

export { i18n };
export default boot;
