// src/utils/roles.js
export const ROLES = {
  HOST: 'host',
  NGO: 'ngo',
  VOLUNTEER: 'volunteer'
};

export const ROLE_LABELS = {
  [ROLES.HOST]: 'Event Host',
  [ROLES.NGO]: 'NGO / Orphanage',
  [ROLES.VOLUNTEER]: 'Volunteer / Donor'
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.HOST]: 'I have leftover food to donate',
  [ROLES.NGO]: 'We need food for people in need',
  [ROLES.VOLUNTEER]: 'I want to help with food delivery'
};

export const ROLE_ICONS = {
  [ROLES.HOST]: '🏢',
  [ROLES.NGO]: '🤝',
  [ROLES.VOLUNTEER]: '🚚'
};

export const DASHBOARD_ROUTES = {
  [ROLES.HOST]: '/host/dashboard',
  [ROLES.NGO]: '/ngo/dashboard',
  [ROLES.VOLUNTEER]: '/volunteer/dashboard'
};