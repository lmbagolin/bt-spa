import { boot } from 'quasar/wrappers';
import { defineAsyncComponent } from 'vue';

const components = import.meta.glob('../components/*.vue');

export default boot(({ app }) => {
  Object.entries(components).forEach(([path, loadComponent]) => {
    const componentName = path.split('/').pop().replace('.vue', '');

    app.component(componentName, defineAsyncComponent(loadComponent));
  });
});
