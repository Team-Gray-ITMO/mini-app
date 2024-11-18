import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';

export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  HOME: 'home',
  PERSIK: 'persik',
  PATTERN: 'pattern',
  CREATE: 'create',
} as const;

export const DEFAULT_VIEW_PANELS_PATHS = {
  HOME: '/',
  PERSIK: `/${DEFAULT_VIEW_PANELS.PERSIK}`,
  PATTERN: `/${DEFAULT_VIEW_PANELS.PATTERN}`,
  CREATE: `/${DEFAULT_VIEW_PANELS.CREATE}`,
}

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.HOME, DEFAULT_VIEW_PANELS_PATHS.HOME, []),
      createPanel(DEFAULT_VIEW_PANELS.PERSIK, DEFAULT_VIEW_PANELS_PATHS.PERSIK, []),
      createPanel(DEFAULT_VIEW_PANELS.PATTERN, DEFAULT_VIEW_PANELS_PATHS.PATTERN, []),
      createPanel(DEFAULT_VIEW_PANELS.CREATE, DEFAULT_VIEW_PANELS_PATHS.CREATE, []),
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
