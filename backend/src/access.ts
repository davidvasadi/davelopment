import type { Access } from 'payload'

// Admin: bejelentkezett felhasználó aki NEM editor
// (role === 'admin' VAGY role nincs beállítva — bootstrap eset)
export const isAdmin: Access = ({ req }) =>
  !!req.user && req.user?.role !== 'editor'

// Bármely bejelentkezett felhasználó
export const isAdminOrEditor: Access = ({ req }) => !!req.user

// Field-szintű: csak nem-editor (admin v. nincs role)
export const isAdminField = ({ req }: any) =>
  !!req.user && req.user?.role !== 'editor'
