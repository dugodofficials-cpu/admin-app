export const ROUTES = {
  DASHBOARD: {
    HOME: '/dashboard',
    USERS: '/users',
    SETTINGS: '/settings',
    ORDERS: '/orders',
    MUSIC_MANAGER: {
      HOME: '/music-manager',
      ADD_SINGLE: '/music-manager/add-single',
    },
    SHOP: {
      HOME: '/shop',
    },
    COUPONS: {
      HOME: '/coupons',
    },
    SHIPPING_ZONES: {
      HOME: '/shipping-zones',
    },
    LOCATIONS: {
      HOME: '/locations',
    },
    BLACKBOX: {
      HOME: '/blackbox',
      GAME: '/blackbox/play',
    },
    CONTENT_MANAGER: {
      HOME: '/content-manager',
    },
    GAME_EDITOR: {
      HOME: '/game-editor',
    },
    COUNTDOWN: {
      HOME: '/countdown',
    },
    AUTH: {
      LOGIN: '/login',
    },
  },
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export const generatePath = (path: string, params: Record<string, string> = {}) => {
  return path.replace(/:(\w+)/g, (_, key) => params[key] || '');
};

export const isActiveRoute = (currentPath: string, routePath: string): boolean => {
  return currentPath.startsWith(routePath);
};
