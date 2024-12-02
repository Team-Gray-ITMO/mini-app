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
  PATTERN: 'pattern',
  CREATE: 'create',
  CV_PAGE: 'cv-page/:id'
} as const;

export const DEFAULT_VIEW_PANELS_PATHS = {
  HOME: '/',
  PATTERN: `/${DEFAULT_VIEW_PANELS.PATTERN}`,
  CREATE: `/${DEFAULT_VIEW_PANELS.CREATE}`,
  CV_PAGE: `/${DEFAULT_VIEW_PANELS.CV_PAGE}`,
}

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.HOME, DEFAULT_VIEW_PANELS_PATHS.HOME, []),
      createPanel(DEFAULT_VIEW_PANELS.PATTERN, DEFAULT_VIEW_PANELS_PATHS.PATTERN, []),
      createPanel(DEFAULT_VIEW_PANELS.CREATE, DEFAULT_VIEW_PANELS_PATHS.CREATE, []),
        createPanel(DEFAULT_VIEW_PANELS.CV_PAGE, DEFAULT_VIEW_PANELS_PATHS.CV_PAGE, [])
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
