import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Lead {
  id: number; name: string; email: string; message: string;
  page: string; language: string; state: 'new' | 'in_progress' | 'done'; createdAt: string;
}
interface Subscriber {
  id: number; email: string; name: string; language: 'hu' | 'en';
  confirmed: boolean; unsubscribed: boolean; unsubscribed_at?: string;
  subscribed_at: string; source: string; createdAt: string; updatedAt?: string;
}
interface Campaign {
  id: string | number; subject: string; language: string;
  sentAt: string; sentCount: number; bodyPreview: string;
  fullHtml?: string; isTest?: boolean;
}
interface ToastMsg { type: 'success' | 'error' | 'info'; text: string; }
interface QuotaData {
  month: {
    sent: number; limit: number; remaining: number; percentUsed: number;
    breakdown: { campaigns: number; transactional: number; tests: number };
  };
  today: { sent: number; limit: number; remaining: number; percentUsed: number };
  yearMonth: string;
}

async function fetchCampaigns(): Promise<Campaign[]> {
  try { const res = await fetch('/api/communications/campaigns'); const data = await res.json(); return data.ok ? data.data : []; } catch { return []; }
}
async function postCampaign(c: Omit<Campaign, 'id'>): Promise<void> {
  try { await fetch('/api/communications/campaigns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) }); } catch {}
}
async function deleteAllLeads(): Promise<boolean> {
  try { const res = await fetch('/api/communications/leads/all', { method: 'DELETE' }); const data = await res.json(); return data.ok; } catch { return false; }
}
async function deleteAllSubscribers(): Promise<boolean> {
  try { const res = await fetch('/api/communications/subscribers/all', { method: 'DELETE' }); const data = await res.json(); return data.ok; } catch { return false; }
}

const DARK_TOKENS: Record<string, string> = {
  '--bg-page': '#030712', '--bg-card': '#0d1117', '--bg-inner': '#161b22', '--bg-inner2': '#21262d',
  '--border': '#21262d', '--border-hover': '#30363d',
  '--text-primary': '#f0f6fc', '--text-secondary': '#c9d1d9', '--text-muted': '#8b949e',
  '--text-faint': '#484f58', '--text-faintest': '#30363d',
  '--accent-green': '#3dffa0', '--accent-red': '#f85149', '--accent-amber': '#f0c742',
  '--accent-indigo': '#7c6af7', '--accent-indigo-light': '#a78bfa',
  '--shadow': '0 0 0 1px rgba(240,246,252,0.04), 0 2px 8px rgba(0,0,0,0.5)',
  '--shadow-hover': '0 0 0 1px rgba(240,246,252,0.06), 0 8px 28px rgba(0,0,0,0.55)',
};
const LIGHT_TOKENS: Record<string, string> = {
  '--bg-page': '#fafafa', '--bg-card': '#ffffff', '--bg-inner': '#f3f4f6', '--bg-inner2': '#e5e7eb',
  '--border': 'rgba(15,23,42,0.09)', '--border-hover': 'rgba(15,23,42,0.17)',
  '--text-primary': '#0b1220', '--text-secondary': '#1a2235', '--text-muted': 'rgba(17,24,39,0.58)',
  '--text-faint': 'rgba(17,24,39,0.40)', '--text-faintest': 'rgba(17,24,39,0.24)',
  '--accent-green': '#1a7f37', '--accent-red': '#cf222e', '--accent-amber': '#9a6700',
  '--accent-indigo': '#6639ba', '--accent-indigo-light': '#7c3aed',
  '--shadow': '0 0 0 1px rgba(15,23,42,0.06), 0 1px 4px rgba(15,23,42,0.06)',
  '--shadow-hover': '0 0 0 1px rgba(15,23,42,0.08), 0 6px 20px rgba(15,23,42,0.10)',
};
function getStrapiTheme(): 'light' | 'dark' {
  const html = document.documentElement;
  const attr = html.getAttribute('data-theme');
  if (attr === 'light') return 'light'; if (attr === 'dark') return 'dark';
  if (html.classList.contains('light-theme')) return 'light'; if (html.classList.contains('dark-theme')) return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
function applyTokens(theme: 'light' | 'dark') {
  const tokens = theme === 'dark' ? DARK_TOKENS : LIGHT_TOKENS;
  Object.entries(tokens).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
}

const staticStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap');
  .comm-app * { box-sizing: border-box; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .comm-app { padding: 24px 28px; color: var(--text-secondary); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-height: 100vh; background: var(--bg-page); transition: background 200ms; }
  .comm-stat-card { background: var(--bg-card); border: 0.5px solid var(--border); border-radius: 12px; padding: 16px 18px; box-shadow: var(--shadow); cursor: default; }
  .comm-tab-btn { padding: 7px 16px; border-radius: 10px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; background: transparent; color: var(--text-muted); transition: color 160ms ease; position: relative; z-index: 1; }
  .comm-tab-btn.active { color: var(--text-primary); font-weight: 600; }
  .comm-table-wrap { background: var(--bg-card); border: 0.5px solid var(--border); border-radius: 14px; overflow: hidden; box-shadow: var(--shadow); }
  .comm-toolbar { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
  .comm-table { width: 100%; border-collapse: collapse; }
  .comm-table th { text-align: left; padding: 10px 16px; font-size: 10px; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--border); background: var(--bg-inner); }
  .comm-table td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid var(--border); vertical-align: middle; color: var(--text-secondary); transition: background 100ms; }
  .comm-table tr:last-child td { border-bottom: none; }
  .comm-table tr:hover td { background: var(--bg-inner); cursor: pointer; }
  .comm-filter-chip { padding: 5px 12px; border-radius: 8px; font-size: 12px; font-weight: 500; cursor: pointer; border: 0.5px solid var(--border); background: var(--bg-card); color: var(--text-muted); transition: all 120ms ease; box-shadow: 0 0 0 0.5px var(--border); }
  .comm-filter-chip:hover { border-color: var(--border-hover); color: var(--text-primary); }
  .comm-filter-chip.active { background: var(--text-primary); border-color: var(--text-primary); color: var(--bg-page); box-shadow: none; }
  .comm-input { padding: 7px 11px; border-radius: 9px; border: 0.5px solid var(--border); background: var(--bg-inner); color: var(--text-primary); font-size: 13px; outline: none; transition: border-color 150ms; font-family: inherit; }
  .comm-input:focus { border-color: var(--border-hover); }
  .comm-select { padding: 7px 11px; border-radius: 9px; border: 0.5px solid var(--border); background: var(--bg-inner); color: var(--text-primary); font-size: 13px; outline: none; cursor: pointer; font-family: inherit; }
  .comm-textarea { padding: 10px 12px; border-radius: 9px; border: 0.5px solid var(--border); background: var(--bg-inner); color: var(--text-primary); font-size: 13px; outline: none; resize: vertical; line-height: 1.6; transition: border-color 150ms; font-family: inherit; }
  .comm-textarea:focus { border-color: var(--border-hover); }
  .comm-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 9px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 140ms ease; font-family: inherit; }
  .btn-primary { background: var(--accent-indigo); color: #fff; }
  .btn-primary:hover { filter: brightness(1.15); }
  .btn-primary:disabled { background: var(--bg-inner2); color: var(--text-faint); cursor: not-allowed; filter: none; }
  .btn-ghost { background: transparent; color: var(--text-muted); border: 0.5px solid var(--border); }
  .btn-ghost:hover { color: var(--text-primary); border-color: var(--border-hover); background: var(--bg-inner); }
  .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-danger { background: transparent; color: var(--accent-red); border: 0.5px solid rgba(248,81,73,0.25); }
  .btn-danger:hover { background: rgba(248,81,73,0.08); }
  .btn-success { background: var(--accent-green); color: var(--bg-page); font-weight: 600; }
  .btn-success:hover { filter: brightness(1.1); }
  .btn-success:disabled { background: var(--bg-inner2); color: var(--text-faint); cursor: not-allowed; filter: none; }
  .btn-sm { padding: 4px 10px; font-size: 12px; }
  .comm-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 500; font-family: 'Geist Mono', monospace; letter-spacing: 0.2px; }
  .badge-new { background: rgba(240,199,66,0.1); color: var(--accent-amber); border: 1px solid rgba(240,199,66,0.2); }
  .badge-in_progress { background: rgba(124,106,247,0.1); color: var(--accent-indigo); border: 1px solid rgba(124,106,247,0.2); }
  .badge-done { background: rgba(61,255,160,0.08); color: var(--accent-green); border: 1px solid rgba(61,255,160,0.18); }
  .badge-confirmed { background: rgba(61,255,160,0.08); color: var(--accent-green); border: 1px solid rgba(61,255,160,0.18); }
  .badge-pending { background: rgba(240,199,66,0.1); color: var(--accent-amber); border: 1px solid rgba(240,199,66,0.2); }
  .badge-unsubscribed { background: rgba(248,81,73,0.08); color: var(--accent-red); border: 1px solid rgba(248,81,73,0.2); }
  .badge-hu { background: rgba(37,99,235,0.1); color: #60a5fa; border: 1px solid rgba(37,99,235,0.2); }
  .badge-en { background: rgba(220,38,38,0.1); color: #f87171; border: 1px solid rgba(220,38,38,0.2); }
  .comm-modal { background: var(--bg-card); border: 0.5px solid var(--border); border-radius: 16px; width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-hover); }
  .comm-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid var(--border); }
  .comm-modal-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }
  .comm-modal-body { padding: 20px 24px; }
  .comm-modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 16px 24px; border-top: 1px solid var(--border); }
  .comm-card { background: var(--bg-card); border: 0.5px solid var(--border); border-radius: 14px; overflow: hidden; box-shadow: var(--shadow); }
  .comm-card-header { padding: 14px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
  .comm-card-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .comm-card-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; }
  .comm-info-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; background: var(--bg-inner); border-radius: 8px; border: 0.5px solid var(--border); }
  .comm-info-key { font-size: 12px; color: var(--text-faint); }
  .comm-info-val { font-size: 12px; color: var(--text-secondary); font-weight: 500; font-family: 'Geist Mono', monospace; }
  .comm-editor { background: var(--bg-card); border: 0.5px solid var(--border); border-radius: 14px; overflow: hidden; box-shadow: var(--shadow); }
  .comm-editor-header { padding: 14px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .comm-label { font-size: 11px; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.5px; }
  .comm-msg { color: var(--text-muted); font-size: 12px; line-height: 1.5; max-width: 260px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .comm-message-box { background: var(--bg-inner); border: 0.5px solid var(--border); border-radius: 9px; padding: 12px; font-size: 13px; color: var(--text-secondary); line-height: 1.6; white-space: pre-wrap; margin-top: 8px; }
  .comm-detail-row { display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-start; }
  .comm-detail-label { width: 88px; flex-shrink: 0; font-size: 12px; color: var(--text-faint); padding-top: 2px; }
  .comm-detail-value { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
  .comm-empty { text-align: center; padding: 56px 20px; color: var(--text-faint); }
  .comm-loading { display: flex; align-items: center; justify-content: center; padding: 56px; color: var(--text-faint); font-size: 13px; gap: 8px; }
  .comm-spinner { width: 14px; height: 14px; border: 2px solid var(--border); border-top-color: var(--accent-indigo); border-radius: 50%; animation: spin 0.6s linear infinite; flex-shrink: 0; }
  .comm-pagination { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text-faint); }
  .comm-toast { position: fixed; bottom: 24px; right: 24px; z-index: 9999; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 500; box-shadow: var(--shadow-hover); display: flex; align-items: center; gap: 8px; }
  .toast-success { background: var(--accent-green); color: var(--bg-page); }
  .toast-error { background: var(--accent-red); color: #fff; }
  .toast-info { background: var(--accent-indigo); color: #fff; }
  .comm-audience-box { background: var(--bg-inner); border: 0.5px solid var(--border); border-radius: 10px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; }
  .ios-toggle-track { width: 44px; height: 26px; border-radius: 13px; padding: 3px; cursor: pointer; transition: background 220ms ease; position: relative; flex-shrink: 0; }
  .ios-toggle-thumb { width: 20px; height: 20px; border-radius: 50%; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.3); position: absolute; top: 3px; transition: left 220ms cubic-bezier(0.34,1.56,0.64,1); }
  .comm-history-row { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 100ms; }
  .comm-history-row:last-child { border-bottom: none; }
  .comm-history-row:hover { background: var(--bg-inner); }
  .comm-desktop-only { display: block; }
  .comm-mobile-only { display: none !important; flex-direction: column; gap: 8px; padding: 10px; }
  .comm-filter-scroll-wrap { display: flex; flex: 1; min-width: 0; }
  .comm-filter-scroll { display: flex; gap: 5px; flex-wrap: wrap; flex: 1; min-width: 0; }
  .comm-tab-bar { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; width: 100% !important; box-sizing: border-box; }
  .comm-tab-bar::-webkit-scrollbar { display: none; }
  .comm-campaign-layout { display: flex; gap: 16px; flex-wrap: wrap; }
  .comm-campaign-editor { flex: 1 1 480px; min-width: 0; width: 100%; }
  .comm-campaign-sidebar { flex: 0 0 270px; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
  @media (max-width: 768px) {
    .comm-app { padding: 16px 14px; }
    .comm-toolbar { flex-direction: column; align-items: stretch; }
    .comm-toolbar input { width: 100% !important; }
    .comm-tab-btn { padding: 6px 10px; font-size: 12px; }
    .comm-stat-card { padding: 12px 14px; }
    .comm-modal { max-width: 100% !important; margin: 0 10px; }
    .comm-editor-header { flex-direction: column; align-items: flex-start; gap: 8px; }
    .comm-desktop-only { display: none !important; }
    .comm-mobile-only { display: flex !important; }
    .comm-filter-scroll { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 2px; scrollbar-width: none; }
    .comm-filter-scroll::-webkit-scrollbar { display: none; }
    .comm-filter-chip { flex-shrink: 0; }
    .comm-filter-scroll-wrap { display: none !important; }
    .comm-tab-bar { width: 100% !important; max-width: 100% !important; border-radius: 12px; }
    .comm-campaign-sidebar { flex: 1 1 100%; width: 100%; }
    .comm-campaign-editor { flex: 1 1 100%; }
  }
  @media (max-width: 480px) {
    .comm-app { padding: 12px 10px; }
    .comm-tab-btn { padding: 5px 8px; font-size: 11px; }
  }
`;

const Icons = {
  Mail: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>),
  Users: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  Send: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>),
  Settings: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>),
  Eye: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  Trash: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>),
  Rocket: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>),
  Flask: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 3h6M9 3v7l-4.5 9A1 1 0 0 0 5.5 21h13a1 1 0 0 0 .9-1.45L15 10V3"/><path d="M6.5 15h11"/></svg>),
  Globe: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>),
  Shield: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
  Bolt: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
  Close: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  AlertTriangle: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
  Check: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>),
  Inbox: () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>),
  Reply: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>),
  Save: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>),
  UserCheck: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>),
  History: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>),
  ChevronDown: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>),
};

const formatDate = (d: string) => { if (!d) return '–'; return new Date(d).toLocaleString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); };
const formatDateShort = (d: string) => { if (!d) return '–'; return new Date(d).toLocaleString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' }); };
const StateBadge = ({ state }: { state: string }) => { const labels: Record<string, string> = { new: 'Új', in_progress: 'Folyamatban', done: 'Kész' }; return <span className={`comm-badge badge-${state}`}>{labels[state] || state}</span>; };
const UnsubscribedBadge = ({ sub }: { sub: Subscriber }) => {
  if (!sub.unsubscribed) return null;
  const date = sub.unsubscribed_at || sub.updatedAt || '';
  return (<div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}><span className="comm-badge badge-unsubscribed">Leiratkozott</span>{date && (<span style={{ fontSize: '10px', color: 'var(--text-faint)', fontFamily: 'Geist Mono, monospace', paddingLeft: '2px' }}>{formatDateShort(date)}</span>)}</div>);
};
const IOSToggle = ({ value, onChange, disabled = false }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) => (
  <div className="ios-toggle-track" onClick={() => !disabled && onChange(!value)} style={{ background: value ? 'var(--accent-green)' : 'var(--bg-inner2)', opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
    <div className="ios-toggle-thumb" style={{ left: value ? '21px' : '3px' }} />
  </div>
);
const fadeUp = { hidden: { opacity: 0, y: 8 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.22, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] as any } }) };
const cardVariants = { hidden: { opacity: 0, y: 12, scale: 0.97 }, show: (i: number) => ({ opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 400, damping: 30, delay: i * 0.06 } }) };

const ConfirmDialog = ({ title, message, confirmLabel = 'Igen', cancelLabel = 'Mégse', danger = false, onConfirm, onCancel }: { title: string; message: string; confirmLabel?: string; cancelLabel?: string; danger?: boolean; onConfirm: () => void; onCancel: () => void; }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)' }} onClick={onCancel}>
    <motion.div className="comm-modal" style={{ maxWidth: '360px' }} initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ type: 'spring', stiffness: 480, damping: 38 }} onClick={e => e.stopPropagation()}>
      <div className="comm-modal-header"><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{danger && <span style={{ color: 'var(--accent-amber)' }}><Icons.AlertTriangle /></span>}<div className="comm-modal-title">{title}</div></div></div>
      <div className="comm-modal-body"><p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{message}</p></div>
      <div className="comm-modal-footer"><button className="comm-btn btn-ghost" onClick={onCancel}>{cancelLabel}</button><button className={`comm-btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>{confirmLabel}</button></div>
    </motion.div>
  </motion.div>
);
const LeadModal = ({ lead, onClose, onUpdate }: { lead: Lead; onClose: () => void; onUpdate: (id: number, state: string) => void }) => {
  const [state, setState] = useState(lead.state);
  const [saving, setSaving] = useState(false);
  const handleSave = async () => { setSaving(true); await onUpdate(lead.id, state); setSaving(false); onClose(); };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <motion.div className="comm-modal" initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ type: 'spring', stiffness: 480, damping: 38 }} onClick={e => e.stopPropagation()}>
        <div className="comm-modal-header"><div className="comm-modal-title">Érdeklődő részletei</div><button className="comm-btn btn-ghost btn-sm" onClick={onClose}><Icons.Close /></button></div>
        <div className="comm-modal-body">
          {[{ label: 'Név', value: lead.name || '–' }, { label: 'Oldal', value: lead.page || '–' }, { label: 'Beérkezett', value: formatDate(lead.createdAt) }].map(r => (<div key={r.label} className="comm-detail-row"><div className="comm-detail-label">{r.label}</div><div className="comm-detail-value">{r.value}</div></div>))}
          <div className="comm-detail-row"><div className="comm-detail-label">Email</div><div className="comm-detail-value"><a href={`mailto:${lead.email}`} style={{ color: 'var(--accent-indigo)' }}>{lead.email}</a></div></div>
          <div className="comm-detail-row"><div className="comm-detail-label">Nyelv</div><div className="comm-detail-value">{lead.language ? <span className={`comm-badge badge-${lead.language}`}>{lead.language.toUpperCase()}</span> : '–'}</div></div>
          <div className="comm-detail-row"><div className="comm-detail-label">Státusz</div><div className="comm-detail-value"><select className="comm-select" value={state} onChange={e => setState(e.target.value as any)}><option value="new">Új</option><option value="in_progress">Folyamatban</option><option value="done">Kész</option></select></div></div>
          <div><div className="comm-label" style={{ marginBottom: '6px' }}>Üzenet</div><div className="comm-message-box">{lead.message || '(nincs üzenet)'}</div></div>
        </div>
        <div className="comm-modal-footer">
          <button className="comm-btn btn-ghost" onClick={onClose}>Mégse</button>
          <a href={`mailto:${lead.email}?subject=Re: ${lead.page || 'Érdeklődés'}`} className="comm-btn btn-ghost" style={{ textDecoration: 'none' }}><Icons.Reply /> Válasz</a>
          <button className="comm-btn btn-primary" onClick={handleSave} disabled={saving}><Icons.Save />{saving ? 'Mentés...' : 'Mentés'}</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LeadsTab = ({ showToast, initialFilter, onFilterApplied }: { showToast: (t: ToastMsg) => void; initialFilter?: string | null; onFilterApplied?: () => void }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 15;
  useEffect(() => { if (initialFilter) { setFilter(initialFilter); setPage(1); onFilterApplied?.(); } }, [initialFilter]);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
      if (filter !== 'all') qs.set('state', filter);
      const res = await fetch(`/api/communications/leads?${qs}`);
      const data = await res.json();
      if (data.ok) { setLeads(data.data); setTotal(data.total); }
    } catch { showToast({ type: 'error', text: 'Betöltési hiba' }); }
    setLoading(false);
  }, [filter, page]);
  useEffect(() => { load(); }, [load]);
  const handleUpdate = async (id: number, state: string) => {
    const res = await fetch(`/api/communications/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state }) });
    const data = await res.json();
    if (data.ok) { setLeads(prev => prev.map(l => l.id === id ? { ...l, state: state as any } : l)); showToast({ type: 'success', text: 'Státusz frissítve' }); }
    else showToast({ type: 'error', text: 'Hiba a mentésnél' });
  };
  const handleDelete = async (id: number) => {
    setDeleteConfirm(null);
    const res = await fetch(`/api/communications/leads/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.ok) { setLeads(prev => prev.filter(l => l.id !== id)); setTotal(t => t - 1); showToast({ type: 'success', text: 'Érdeklődő törölve' }); }
  };
  const handleDeleteAll = async () => { setDeleteAllConfirm(false); const ok = await deleteAllLeads(); if (ok) { setLeads([]); setTotal(0); showToast({ type: 'success', text: 'Összes érdeklődő törölve' }); } else showToast({ type: 'error', text: 'Törlési hiba' }); };
  const filtered = leads.filter(l => { if (!search) return true; const q = search.toLowerCase(); return (l.name || '').toLowerCase().includes(q) || (l.email || '').toLowerCase().includes(q) || (l.message || '').toLowerCase().includes(q); });
  return (
    <div>
      <div className="comm-table-wrap">
        <div className="comm-toolbar">
          <div className="comm-filter-scroll-wrap"><div className="comm-filter-scroll">{[{ k: 'all', l: 'Összes' }, { k: 'new', l: 'Új' }, { k: 'in_progress', l: 'Folyamatban' }, { k: 'done', l: 'Kész' }].map(f => (<button key={f.k} className={`comm-filter-chip${filter === f.k ? ' active' : ''}`} onClick={() => { setFilter(f.k); setPage(1); }}>{f.l}</button>))}</div></div>
          <input className="comm-input" placeholder="Keresés név, email, üzenet..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '220px' }} />
          <motion.button className="comm-btn btn-danger btn-sm" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setDeleteAllConfirm(true)}><Icons.Trash /><span style={{ fontSize: '12px' }}>Összes törlése</span></motion.button>
        </div>
        <AnimatePresence mode="wait">
          {loading ? (<motion.div key="loading" className="comm-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="comm-spinner" /><span>Betöltés...</span></motion.div>)
          : filtered.length === 0 ? (<motion.div key="empty" className="comm-empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><div style={{ marginBottom: '10px' }}><Icons.Inbox /></div><div style={{ fontSize: '13px' }}>Nincs érdeklődő ebben a kategóriában</div></motion.div>)
          : (
            <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="comm-desktop-only" style={{ overflowX: 'auto' } as any}>
                <table className="comm-table">
                  <thead><tr><th>Név</th><th>Email</th><th>Üzenet</th><th>Oldal</th><th>Nyelv</th><th>Státusz</th><th>Beérkezett</th><th></th></tr></thead>
                  <tbody>{filtered.map((lead, i) => (<motion.tr key={lead.id} custom={i} variants={fadeUp} initial="hidden" animate="show" onClick={() => setSelected(lead)}><td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{lead.name || '–'}</td><td style={{ color: 'var(--accent-indigo)', fontFamily: 'Geist Mono, monospace', fontSize: '12px' }}>{lead.email}</td><td><div className="comm-msg">{lead.message || '–'}</div></td><td style={{ fontSize: '12px', color: 'var(--text-faint)', fontFamily: 'Geist Mono, monospace' }}>{lead.page || '–'}</td><td>{lead.language ? <span className={`comm-badge badge-${lead.language}`}>{lead.language.toUpperCase()}</span> : '–'}</td><td><StateBadge state={lead.state} /></td><td style={{ fontSize: '12px', color: 'var(--text-faint)', whiteSpace: 'nowrap', fontFamily: 'Geist Mono, monospace' }}>{formatDate(lead.createdAt)}</td><td onClick={e => e.stopPropagation()}><div style={{ display: 'flex', gap: '5px' }}><motion.button className="comm-btn btn-ghost btn-sm" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setSelected(lead)}><Icons.Eye /></motion.button><motion.button className="comm-btn btn-danger btn-sm" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setDeleteConfirm(lead.id)}><Icons.Trash /></motion.button></div></td></motion.tr>))}</tbody>
                </table>
              </div>
              <div className="comm-mobile-only">
                {filtered.map((lead, i) => (<motion.div key={lead.id} custom={i} variants={fadeUp} initial="hidden" animate="show" onClick={() => setSelected(lead)} style={{ background: 'var(--bg-inner)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '12px 14px', cursor: 'pointer' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}><div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{lead.name || '–'}</div><StateBadge state={lead.state} /></div><div style={{ fontSize: '12px', color: 'var(--accent-indigo)', fontFamily: 'Geist Mono, monospace', marginBottom: '4px' }}>{lead.email}</div>{lead.message && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.message}</div>}<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}><div style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'Geist Mono, monospace' }}>{formatDate(lead.createdAt)}</div><div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}><button className="comm-btn btn-ghost btn-sm" onClick={() => setSelected(lead)}><Icons.Eye /></button><button className="comm-btn btn-danger btn-sm" onClick={() => setDeleteConfirm(lead.id)}><Icons.Trash /></button></div></div></motion.div>))}
              </div>
              {Math.ceil(total / PAGE_SIZE) > 1 && (<div className="comm-pagination"><span style={{ fontFamily: 'Geist Mono, monospace' }}>{total} érdeklődő összesen</span><div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><button className="comm-btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Előző</button><span style={{ fontFamily: 'Geist Mono, monospace', color: 'var(--text-muted)' }}>{page} / {Math.ceil(total / PAGE_SIZE)}</span><button className="comm-btn btn-ghost btn-sm" disabled={page >= Math.ceil(total / PAGE_SIZE)} onClick={() => setPage(p => p + 1)}>Következő →</button></div></div>)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>{selected && <LeadModal lead={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}</AnimatePresence>
      <AnimatePresence>{deleteConfirm !== null && (<ConfirmDialog title="Érdeklődő törlése" message="Biztosan törlöd ezt az érdeklődőt? A művelet nem vonható vissza." confirmLabel="Igen, törlöm" danger onConfirm={() => handleDelete(deleteConfirm!)} onCancel={() => setDeleteConfirm(null)} />)}</AnimatePresence>
      <AnimatePresence>{deleteAllConfirm && (<ConfirmDialog title="Összes érdeklődő törlése" message={`Biztosan törlöd az összes ${total} érdeklődőt? Ez a művelet nem vonható vissza.`} confirmLabel="Igen, mindet törlöm" danger onConfirm={handleDeleteAll} onCancel={() => setDeleteAllConfirm(false)} />)}</AnimatePresence>
    </div>
  );
};

const SubscriberModal = ({ sub, onClose, onUpdate, showToast }: { sub: Subscriber; onClose: () => void; onUpdate: (updated: Subscriber) => void; showToast: (t: ToastMsg) => void; }) => {
  const [name, setName] = useState(sub.name || '');
  const [language, setLanguage] = useState<'hu' | 'en'>(sub.language || 'hu');
  const [confirmed, setConfirmed] = useState(sub.confirmed);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirmDialog] = useState(false);
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/communications/subscribers/${(sub as any).documentId || sub.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, language, confirmed }) });
      const data = await res.json();
      if (data.ok) { onUpdate({ ...sub, name, language, confirmed }); showToast({ type: 'success', text: 'Mentve' }); onClose(); } else showToast({ type: 'error', text: 'Mentési hiba' });
    } catch { showToast({ type: 'error', text: 'Hálózati hiba' }); }
    setSaving(false);
  };
  const handleUnsubscribe = async () => {
    setConfirmDialog(false);
    try {
      const res = await fetch('/api/communications/unsubscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: (sub as any).documentId || sub.id }) });
      const data = await res.json();
      if (data.ok) { onUpdate({ ...sub, unsubscribed: true, unsubscribed_at: new Date().toISOString() }); showToast({ type: 'success', text: 'Leiratkoztatva' }); onClose(); } else showToast({ type: 'error', text: 'Hiba' });
    } catch { showToast({ type: 'error', text: 'Hálózati hiba' }); }
  };
  const unsubDate = sub.unsubscribed_at || sub.updatedAt;
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)' }} onClick={onClose}>
        <motion.div className="comm-modal" initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ type: 'spring', stiffness: 480, damping: 38 }} onClick={e => e.stopPropagation()}>
          <div className="comm-modal-header"><div className="comm-modal-title">Feliratkozó részletei</div><button className="comm-btn btn-ghost btn-sm" onClick={onClose}><Icons.Close /></button></div>
          <div className="comm-modal-body">
            <div className="comm-detail-row"><div className="comm-detail-label">Email</div><div className="comm-detail-value"><a href={`mailto:${sub.email}`} style={{ color: 'var(--accent-indigo)' }}>{sub.email}</a></div></div>
            <div className="comm-detail-row"><div className="comm-detail-label">Forrás</div><div className="comm-detail-value">{sub.source || '–'}</div></div>
            <div className="comm-detail-row"><div className="comm-detail-label">Feliratkozott</div><div className="comm-detail-value" style={{ fontFamily: 'Geist Mono, monospace', fontSize: '12px' }}>{formatDate(sub.subscribed_at || sub.createdAt)}</div></div>
            {sub.unsubscribed && unsubDate && (<div className="comm-detail-row"><div className="comm-detail-label">Leiratkozott</div><div className="comm-detail-value" style={{ fontFamily: 'Geist Mono, monospace', fontSize: '12px', color: 'var(--accent-red)' }}>{formatDate(unsubDate)}</div></div>)}
            <div style={{ borderTop: '1px solid var(--border)', margin: '10px 0', paddingTop: '10px' }}>
              <div className="comm-detail-row"><div className="comm-detail-label">Név</div><div className="comm-detail-value" style={{ flex: 1 }}><input className="comm-input" value={name} onChange={e => setName(e.target.value)} placeholder="Név" style={{ width: '100%' }} /></div></div>
              <div className="comm-detail-row"><div className="comm-detail-label">Nyelv</div><div className="comm-detail-value"><select className="comm-select" value={language} onChange={e => setLanguage(e.target.value as 'hu' | 'en')}><option value="hu">Magyar</option><option value="en">English</option></select></div></div>
              <div className="comm-detail-row" style={{ alignItems: 'center' }}><div className="comm-detail-label" style={{ paddingTop: 0 }}>Megerősített</div><div className="comm-detail-value" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IOSToggle value={confirmed} onChange={setConfirmed} /><span style={{ fontSize: '12px', color: confirmed ? 'var(--accent-green)' : 'var(--text-faint)' }}>{confirmed ? 'Igen' : 'Nem'}</span></div></div>
            </div>
          </div>
          <div className="comm-modal-footer" style={{ justifyContent: 'space-between' }}>
            {!sub.unsubscribed ? (<button className="comm-btn btn-danger btn-sm" onClick={() => setConfirmDialog(true)}>Leiratkoztatás</button>) : (<div style={{ fontSize: '12px', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="comm-badge badge-unsubscribed">Leiratkozott</span></div>)}
            <div style={{ display: 'flex', gap: '8px' }}><button className="comm-btn btn-ghost" onClick={onClose}>Mégse</button><button className="comm-btn btn-primary" onClick={handleSave} disabled={saving || sub.unsubscribed}><Icons.Save />{saving ? 'Mentés...' : 'Mentés'}</button></div>
          </div>
        </motion.div>
      </motion.div>
      <AnimatePresence>{confirm && (<ConfirmDialog title="Leiratkoztatás" message={`Biztosan leiratkoztatod a(z) ${sub.email} feliratkozót?`} confirmLabel="Igen, leiratkoztatom" danger onConfirm={handleUnsubscribe} onCancel={() => setConfirmDialog(false)} />)}</AnimatePresence>
    </>
  );
};

const SubscribersTab = ({ showToast, initialFilter, onFilterApplied }: { showToast: (t: ToastMsg) => void; initialFilter?: string | null; onFilterApplied?: () => void }) => {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Subscriber | null>(null);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  useEffect(() => { if (initialFilter) { setFilter(initialFilter === 'new' ? 'unconfirmed' : initialFilter); onFilterApplied?.(); } }, [initialFilter]);
  const load = useCallback(async () => { setLoading(true); try { const res = await fetch('/api/communications/subscribers'); const data = await res.json(); if (data.ok) setSubs(data.data); } catch { showToast({ type: 'error', text: 'Betöltési hiba' }); } setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);
  const filtered = subs.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !search || (s.email || '').toLowerCase().includes(q) || (s.name || '').toLowerCase().includes(q);
    if (!matchSearch) return false;
    if (filter === 'active') return !s.unsubscribed;
    if (filter === 'unconfirmed') return !s.unsubscribed && !s.confirmed;
    if (filter === 'unsubscribed') return s.unsubscribed;
    return true;
  });
  const counts = { all: subs.length, active: subs.filter(s => !s.unsubscribed && s.confirmed).length, unconfirmed: subs.filter(s => !s.unsubscribed && !s.confirmed).length, unsubscribed: subs.filter(s => s.unsubscribed).length };
  const handleUpdate = (updated: Subscriber) => setSubs(prev => prev.map(s => s.id === updated.id ? updated : s));
  const handleDeleteAll = async () => { setDeleteAllConfirm(false); const ok = await deleteAllSubscribers(); if (ok) { setSubs([]); showToast({ type: 'success', text: 'Összes feliratkozó törölve' }); } else showToast({ type: 'error', text: 'Törlési hiba' }); };
  return (
    <div>
      <div className="comm-table-wrap">
        <div className="comm-toolbar">
          <div className="comm-filter-scroll-wrap"><div className="comm-filter-scroll">{[{ k: 'all', l: `Összes (${counts.all})` }, { k: 'active', l: `Aktív (${counts.active})` }, { k: 'unconfirmed', l: `Új (${counts.unconfirmed})` }, { k: 'unsubscribed', l: `Leiratkozott (${counts.unsubscribed})` }].map(f => (<button key={f.k} className={`comm-filter-chip${filter === f.k ? ' active' : ''}`} onClick={() => setFilter(f.k)}>{f.l}</button>))}</div></div>
          <input className="comm-input" placeholder="Keresés..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '200px' }} />
          <motion.button className="comm-btn btn-danger btn-sm" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setDeleteAllConfirm(true)}><Icons.Trash /><span style={{ fontSize: '12px' }}>Összes törlése</span></motion.button>
        </div>
        <AnimatePresence mode="wait">
          {loading ? (<motion.div key="loading" className="comm-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="comm-spinner" /><span>Betöltés...</span></motion.div>)
          : filtered.length === 0 ? (<motion.div key="empty" className="comm-empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><div style={{ marginBottom: '10px' }}><Icons.Users /></div><div style={{ fontSize: '13px' }}>Nincs feliratkozó ebben a kategóriában</div></motion.div>)
          : (
            <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="comm-desktop-only" style={{ overflowX: 'auto' } as any}>
                <table className="comm-table">
                  <thead><tr><th>Email</th><th>Név</th><th>Státusz</th><th>Nyelv</th><th>Forrás</th><th>Feliratkozott</th><th></th></tr></thead>
                  <tbody>{filtered.map((s, i) => (<motion.tr key={s.id} custom={i} variants={fadeUp} initial="hidden" animate="show" style={{ cursor: 'pointer' }} onClick={() => setSelected(s)}><td style={{ color: 'var(--accent-indigo)', fontFamily: 'Geist Mono, monospace', fontSize: '12px' }}>{s.email}</td><td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{s.name || '–'}</td><td><UnsubscribedBadge sub={s} /></td><td>{s.language ? <span className={`comm-badge badge-${s.language}`}>{s.language.toUpperCase()}</span> : '–'}</td><td style={{ fontSize: '12px', color: 'var(--text-faint)' }}>{s.source || '–'}</td><td style={{ fontSize: '12px', color: 'var(--text-faint)', whiteSpace: 'nowrap', fontFamily: 'Geist Mono, monospace' }}>{formatDate(s.subscribed_at || s.createdAt)}</td><td><motion.button className="comm-btn btn-ghost btn-sm" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={e => { e.stopPropagation(); setSelected(s); }}><Icons.Eye /></motion.button></td></motion.tr>))}</tbody>
                </table>
              </div>
              <div className="comm-mobile-only">
                {filtered.map((s, i) => (<motion.div key={s.id} custom={i} variants={fadeUp} initial="hidden" animate="show" onClick={() => setSelected(s)} style={{ background: 'var(--bg-inner)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '12px 14px', cursor: 'pointer' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}><div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{s.name || '–'}</div><UnsubscribedBadge sub={s} /></div><div style={{ fontSize: '12px', color: 'var(--accent-indigo)', fontFamily: 'Geist Mono, monospace', marginBottom: '4px' }}>{s.email}</div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}><div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>{s.language && <span className={`comm-badge badge-${s.language}`}>{s.language.toUpperCase()}</span>}<span style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'Geist Mono, monospace' }}>{formatDate(s.subscribed_at || s.createdAt)}</span></div><button className="comm-btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setSelected(s); }}><Icons.Eye /></button></div></motion.div>))}
              </div>
              <div className="comm-pagination"><span style={{ fontFamily: 'Geist Mono, monospace' }}>{filtered.length} feliratkozó látható</span></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>{selected && <SubscriberModal sub={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} showToast={showToast} />}</AnimatePresence>
      <AnimatePresence>{deleteAllConfirm && (<ConfirmDialog title="Összes feliratkozó törlése" message={`Biztosan törlöd az összes ${subs.length} feliratkozót?`} confirmLabel="Igen, mindet törlöm" danger onConfirm={handleDeleteAll} onCancel={() => setDeleteAllConfirm(false)} />)}</AnimatePresence>
    </div>
  );
};
const CampaignHistoryModal = ({ campaign, onClose, showToast }: { campaign: Campaign; onClose: () => void; showToast: (t: ToastMsg) => void; }) => {
  const [tab, setTab] = React.useState<'info' | 'preview'>('info');
  const [resending, setResending] = React.useState(false);
  const [resendResult, setResendResult] = React.useState<{ sent: number; message?: string } | null>(null);
  const [confirmResend, setConfirmResend] = React.useState(false);
  const [newSubCount, setNewSubCount] = React.useState<number | null>(null);
  React.useEffect(() => {
    fetch('/api/communications/subscribers').then(r => r.json()).then(d => {
      if (!d.ok) return;
      const sentDate = new Date(campaign.sentAt);
      setNewSubCount((d.data as any[]).filter(s => !s.unsubscribed && s.confirmed && new Date(s.createdAt) > sentDate).length);
    });
  }, [campaign.sentAt]);
  const handleResend = async () => {
    setConfirmResend(false); setResending(true); setResendResult(null);
    try {
      const res = await fetch('/api/communications/resend-campaign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaignId: campaign.id }) });
      const data = await res.json();
      if (data.ok) { setResendResult({ sent: data.sent, message: data.message }); setNewSubCount(0); showToast({ type: 'success', text: data.sent > 0 ? `${data.sent} főnek újraküldve` : 'Nincs új feliratkozó' }); }
      else showToast({ type: 'error', text: data.error || 'Újraküldési hiba' });
    } catch { showToast({ type: 'error', text: 'Hálózati hiba' }); }
    setResending(false);
  };
  const langLabel = campaign.language === 'hu' ? 'Magyar feliratkozók' : campaign.language === 'en' ? 'Angol feliratkozók' : 'Mindenki';
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <motion.div className="comm-modal" style={{ maxWidth: '560px', width: '100%' }} initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ type: 'spring', stiffness: 480, damping: 38 }} onClick={e => e.stopPropagation()}>
        <div className="comm-modal-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}><div className="comm-modal-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '380px' }}>{campaign.subject}</div><div style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'Geist Mono, monospace' }}>{formatDate(campaign.sentAt)} · {campaign.sentCount} fő</div></div>
          <button className="comm-btn btn-ghost btn-sm" onClick={onClose}><Icons.Close /></button>
        </div>
        <div style={{ display: 'flex', gap: '2px', padding: '8px 16px 0', borderBottom: '1px solid var(--border)' }}>
          {(['info', 'preview'] as const).map(t => (<button key={t} onClick={() => setTab(t)} style={{ padding: '6px 14px', fontSize: '12px', fontWeight: tab === t ? 600 : 400, color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', borderBottom: tab === t ? '2px solid var(--text-primary)' : '2px solid transparent', marginBottom: '-1px', transition: 'all 140ms' }}>{t === 'info' ? 'Részletek' : 'Email előnézet'}</button>))}
        </div>
        <div className="comm-modal-body" style={{ padding: tab === 'preview' ? '0' : undefined }}>
          {tab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[{ label: 'Tárgy', value: campaign.subject }, { label: 'Kiküldve', value: formatDate(campaign.sentAt) }, { label: 'Elküldve', value: `${campaign.sentCount} főnek` }, { label: 'Célcsoport', value: langLabel }].map(r => (<div key={r.label} className="comm-detail-row"><div className="comm-detail-label">{r.label}</div><div className="comm-detail-value" style={{ fontFamily: 'Geist Mono, monospace', fontSize: '12px' }}>{r.value}</div></div>))}
              <div style={{ marginTop: '4px', padding: '14px', background: 'var(--bg-inner)', borderRadius: '10px', border: '0.5px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div><div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Újraküldés az újaknak</div><div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>Csak azok kapják, akik a kampány küldése után iratkoztak fel</div></div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>{newSubCount === null ? <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Számolás...</div> : <div style={{ fontSize: '20px', fontWeight: 700, color: newSubCount > 0 ? 'var(--accent-green)' : 'var(--text-faint)', fontFamily: 'Geist Mono, monospace' }}>{newSubCount}</div>}<div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>új feliratkozó</div></div>
                </div>
                {resendResult ? (<div style={{ padding: '10px 12px', background: 'rgba(61,255,160,0.06)', border: '0.5px solid rgba(61,255,160,0.2)', borderRadius: '8px', fontSize: '12px', color: 'var(--accent-green)' }}>✓ {resendResult.sent > 0 ? `${resendResult.sent} főnek elküldve` : resendResult.message || 'Nincs új feliratkozó'}</div>)
                : !campaign.fullHtml ? (<div style={{ fontSize: '12px', color: 'var(--text-faint)', padding: '8px 0' }}>⚠ Ez a kampány régi – a HTML tartalma nem elérhető az újraküldéshez.</div>)
                : (<motion.button className={`comm-btn ${(newSubCount ?? 0) > 0 ? 'btn-success' : 'btn-ghost'}`} style={{ width: '100%', justifyContent: 'center' }} onClick={() => setConfirmResend(true)} disabled={resending || newSubCount === 0 || !campaign.fullHtml} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}><Icons.Send />{resending ? 'Küldés...' : newSubCount === 0 ? 'Nincs új feliratkozó' : `Küldés ${newSubCount} új főnek`}</motion.button>)}
              </div>
            </div>
          )}
          {tab === 'preview' && (campaign.fullHtml ? <iframe srcDoc={campaign.fullHtml} style={{ width: '100%', height: '480px', border: 'none', borderRadius: '0 0 12px 12px', background: '#fff' }} title="Email előnézet" /> : <div className="comm-empty" style={{ padding: '40px' }}><div style={{ fontSize: '13px' }}>Ez a kampány régi – az előnézet nem elérhető.</div></div>)}
        </div>
        {tab === 'info' && <div className="comm-modal-footer"><button className="comm-btn btn-ghost" onClick={onClose}>Bezárás</button></div>}
      </motion.div>
      <AnimatePresence>{confirmResend && (<ConfirmDialog title="Újraküldés megerősítése" message={`Biztosan elkülded ezt a kampányt a ${newSubCount} új feliratkozónak?\n\n„${campaign.subject}"\n\nŐk a kampány eredeti küldése (${formatDate(campaign.sentAt)}) után iratkoztak fel.`} confirmLabel="Igen, küldés" onConfirm={handleResend} onCancel={() => setConfirmResend(false)} />)}</AnimatePresence>
    </motion.div>
  );
};

const RichEditor = React.forwardRef<HTMLDivElement, { onChange: (html: string) => void; placeholder?: string; }>(({ onChange, placeholder }, ref) => {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const editorRef = (ref as React.RefObject<HTMLDivElement>) || innerRef;
  const [showImagePanel, setShowImagePanel] = React.useState(false);
  const [imgUrl, setImgUrl] = React.useState('');
  const [imgAlign, setImgAlign] = React.useState<'left'|'center'|'right'>('center');
  const [imgWidth, setImgWidth] = React.useState('100');
  const savedRange = React.useRef<Range | null>(null);
  const saveRange = () => { const sel = window.getSelection(); if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange(); };
  const restoreRange = () => { const sel = window.getSelection(); if (sel && savedRange.current) { sel.removeAllRanges(); sel.addRange(savedRange.current); } };
  const exec = (cmd: string, value?: string) => { editorRef.current?.focus(); document.execCommand(cmd, false, value); onChange(editorRef.current?.innerHTML || ''); };
  const insertImage = () => {
    if (!imgUrl.trim()) return;
    restoreRange(); editorRef.current?.focus();
    const alignStyle = imgAlign === 'center' ? 'display:block;margin:12px auto;' : imgAlign === 'right' ? 'display:block;margin:12px 0 12px auto;float:right;' : 'display:block;margin:12px auto 12px 0;float:left;';
    const widthStyle = imgWidth && imgWidth !== '100' ? `max-width:${imgWidth}%;` : 'max-width:100%;';
    document.execCommand('insertHTML', false, `<img src="${imgUrl.trim()}" style="${alignStyle}${widthStyle}border-radius:8px;" alt=""/><br style="clear:both"/>`);
    onChange(editorRef.current?.innerHTML || ''); setImgUrl(''); setShowImagePanel(false);
  };
  const btnStyle = (active = false): React.CSSProperties => ({ padding: '3px 8px', borderRadius: '6px', border: `0.5px solid ${active ? 'var(--border-hover)' : 'var(--border)'}`, background: active ? 'var(--bg-card)' : 'transparent', color: active ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', fontWeight: 600, lineHeight: '1.5', display: 'inline-flex', alignItems: 'center', gap: '3px' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', padding: '6px 8px', background: 'var(--bg-inner)', borderRadius: '8px 8px 0 0', border: '0.5px solid var(--border)', borderBottom: 'none' }}>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('bold');}}><b>B</b></button>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('italic');}}><i style={{fontStyle:'italic'}}>I</i></button>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('underline');}}><u>U</u></button>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('strikeThrough');}}><s>S</s></button>
        <div style={{width:'1px',background:'var(--border)',margin:'0 2px'}}/>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('formatBlock','h1');}}>H1</button>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('formatBlock','h2');}}>H2</button>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('formatBlock','h3');}}>H3</button>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('formatBlock','p');}}>¶</button>
        <div style={{width:'1px',background:'var(--border)',margin:'0 2px'}}/>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('insertUnorderedList');}}>• ul</button>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('insertOrderedList');}}>1. ol</button>
        <div style={{width:'1px',background:'var(--border)',margin:'0 2px'}}/>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('justifyLeft');}}>◀</button>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('justifyCenter');}}>◆</button>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('justifyRight');}}>▶</button>
        <div style={{width:'1px',background:'var(--border)',margin:'0 2px'}}/>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('insertHorizontalRule');}}>─</button>
        <button style={btnStyle()} onMouseDown={e=>{e.preventDefault();exec('removeFormat');}}>Tx</button>
        <div style={{width:'1px',background:'var(--border)',margin:'0 2px'}}/>
        <button style={btnStyle(showImagePanel)} onMouseDown={e=>{e.preventDefault();saveRange();setShowImagePanel(v=>!v);}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>Kép
        </button>
      </div>
      <AnimatePresence>
        {showImagePanel && (<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} style={{overflow:'hidden'}}><div style={{padding:'10px 12px',background:'var(--bg-inner)',border:'0.5px solid var(--border)',borderTop:'none',display:'flex',flexDirection:'column',gap:'8px'}}><input className="comm-input" value={imgUrl} onChange={e=>setImgUrl(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')insertImage();}} placeholder="https://kep-url.com/kep.jpg" style={{fontSize:'12px'}}/><div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}><div style={{display:'flex',gap:'3px'}}>{(['left','center','right'] as const).map(a=>(<button key={a} style={btnStyle(imgAlign===a)} onClick={()=>setImgAlign(a)} type="button">{a==='left'?'◀ Bal':a==='center'?'◆ Közép':'▶ Jobb'}</button>))}</div><div style={{display:'flex',alignItems:'center',gap:'6px'}}><span style={{fontSize:'11px',color:'var(--text-faint)'}}>Szélesség:</span><input type="number" min="10" max="100" value={imgWidth} onChange={e=>setImgWidth(e.target.value)} style={{width:'52px',padding:'3px 6px',borderRadius:'6px',border:'0.5px solid var(--border)',background:'var(--bg-inner2)',color:'var(--text-primary)',fontSize:'12px'}}/><span style={{fontSize:'11px',color:'var(--text-faint)'}}>%</span></div><button className="comm-btn btn-primary btn-sm" onClick={insertImage} disabled={!imgUrl.trim()}>Beszúr</button><button className="comm-btn btn-ghost btn-sm" onClick={()=>setShowImagePanel(false)}><Icons.Close/></button></div></div></motion.div>)}
      </AnimatePresence>
      <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={()=>onChange(editorRef.current?.innerHTML||'')} onBlur={()=>onChange(editorRef.current?.innerHTML||'')} data-placeholder={placeholder} style={{ minHeight:'260px',padding:'12px 14px',borderRadius:'0 0 8px 8px',border:'0.5px solid var(--border)',borderTop:showImagePanel?'0.5px solid var(--border)':'none',background:'var(--bg-inner)',color:'var(--text-primary)',fontSize:'14px',lineHeight:'1.7',outline:'none',overflowY:'auto',fontFamily:'inherit' }} onFocus={e=>(e.currentTarget.style.borderColor='var(--border-hover)')} onBlurCapture={e=>(e.currentTarget.style.borderColor='var(--border)')} />
      <style>{`[contenteditable]:empty:before{content:attr(data-placeholder);color:var(--text-faintest,rgba(255,255,255,0.18));pointer-events:none;}[contenteditable] h1{font-size:24px;font-weight:700;color:var(--text-primary);margin:16px 0 10px;}[contenteditable] h2{font-size:19px;font-weight:700;color:var(--text-primary);margin:14px 0 8px;}[contenteditable] h3{font-size:16px;font-weight:600;color:var(--text-primary);margin:12px 0 6px;}[contenteditable] p{margin:0 0 10px;}[contenteditable] ul,[contenteditable] ol{margin:0 0 10px;padding-left:22px;}[contenteditable] hr{border:none;border-top:1px solid var(--border);margin:18px 0;}[contenteditable] img{border-radius:6px;vertical-align:middle;}[contenteditable] a{color:var(--accent-indigo);}[contenteditable] blockquote{border-left:3px solid var(--border-hover);margin:0 0 10px 0;padding:6px 12px;color:var(--text-muted);}`}</style>
    </div>
  );
});
RichEditor.displayName = 'RichEditor';
const CampaignsTab = ({ showToast }: { showToast: (t: ToastMsg) => void }) => {
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [language, setLanguage] = useState('all');
  const [testEmail, setTestEmail] = useState('');
  const [editorMode, setEditorMode] = useState<'rich' | 'html' | 'preview'>('rich');
  const [sending, setSending] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [stats, setStats] = useState<{ activeSubs: number; huSubs: number; enSubs: number } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [customHtml, setCustomHtml] = useState('');
  useEffect(() => {
    fetch('/api/communications/stats').then(r => r.json()).then(d => { if (d.ok) setStats({ activeSubs: d.activeSubs ?? 0, huSubs: d.huSubs ?? 0, enSubs: d.enSubs ?? 0 }); });
    fetchCampaigns().then(setCampaigns);
    const interval = setInterval(() => fetchCampaigns().then(setCampaigns), 10000);
    return () => clearInterval(interval);
  }, []);
  const targetCount = !stats ? 0 : language === 'hu' ? stats.huSubs : language === 'en' ? stats.enSubs : stats.activeSubs;
  const targetLabel = language === 'hu' ? 'Magyar feliratkozók' : language === 'en' ? 'Angol feliratkozók' : 'Minden aktív feliratkozó';
  const buildHtml = (innerHtml = bodyHtml) => {
    const body = innerHtml || '<p>(Szöveg...)</p>';
    return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>*{box-sizing:border-box;}body{margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111;}.outer{padding:32px 16px;}.card{max-width:540px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;}.card-header{padding:18px 28px 16px;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;justify-content:space-between;}.logo{font-size:13px;font-weight:700;color:#111;font-family:ui-monospace,'Courier New',monospace;}.lang-badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#f3f4f6;border:1px solid #e5e7eb;color:#6b7280;font-family:ui-monospace,'Courier New',monospace;}.body{padding:32px 28px;}h1{font-size:22px;font-weight:700;color:#111;margin:0 0 20px;letter-spacing:-0.3px;line-height:1.3;}h2{font-size:18px;font-weight:700;color:#111;margin:20px 0 10px;}h3{font-size:15px;font-weight:600;color:#333;margin:16px 0 8px;}p{font-size:15px;color:#444;line-height:1.75;margin:0 0 14px;}ul,ol{font-size:15px;color:#444;line-height:1.75;margin:0 0 14px;padding-left:22px;}hr{border:none;border-top:1px solid #f0f0f0;margin:24px 0;}img{max-width:100%;border-radius:8px;}a{color:#6d5df4;}.footer{background:#fafafa;border-top:1px solid #f0f0f0;padding:16px 28px;text-align:center;}.footer p{font-size:12px;color:#9ca3af;margin:0 0 4px;font-family:ui-monospace,'Courier New',monospace;}.unsub{font-size:11px;color:#9ca3af!important;text-decoration:none;font-family:ui-monospace,'Courier New',monospace;}@media(max-width:600px){.body{padding:24px 18px;}.card-header{padding:14px 18px;}}</style></head><body><div class="outer"><div class="card"><div class="card-header"><div class="logo">[davelopment]®</div><span class="lang-badge">hírlevél</span></div><div class="body"><h1>${subject || '(Tárgy)'}</h1>${body}</div><div class="footer"><p>davelopment.hu · hello@davelopment.hu</p><a class="unsub" href="{{UNSUBSCRIBE_URL}}">Leiratkozás a hírlevélről</a></div></div></div></body></html>`;
  };
  const finalHtml = editorMode === 'html' ? customHtml : buildHtml();
  const hasContent = editorMode === 'html' ? !!customHtml : !!bodyHtml;
  const handleTestSend = async () => {
    if (!testEmail || !subject || !hasContent) { showToast({ type: 'error', text: 'Tárgy, szöveg és teszt email szükséges' }); return; }
    setSendingTest(true);
    try { const res = await fetch('/api/communications/send-campaign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, htmlContent: finalHtml, testEmail }) }); const data = await res.json(); if (data.ok) showToast({ type: 'success', text: `Teszt elküldve → ${testEmail}` }); else showToast({ type: 'error', text: data.error || 'Küldési hiba' }); } catch { showToast({ type: 'error', text: 'Hálózati hiba' }); }
    setSendingTest(false);
  };
  const handleRealSend = async () => {
    setSending(true); setConfirmOpen(false);
    try {
      const res = await fetch('/api/communications/send-campaign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, htmlContent: finalHtml, language }) });
      const data = await res.json();
      if (data.ok) { showToast({ type: 'success', text: `${data.sent} email elküldve` }); await postCampaign({ subject, language, sentAt: new Date().toISOString(), sentCount: data.sent ?? targetCount, bodyPreview: bodyHtml.replace(/<[^>]+>/g, '').slice(0, 200), fullHtml: finalHtml }); setTimeout(() => fetchCampaigns().then(setCampaigns), 400); setSubject(''); setBodyHtml(''); setCustomHtml(''); } else showToast({ type: 'error', text: data.error || 'Küldési hiba' });
    } catch { showToast({ type: 'error', text: 'Hálózati hiba' }); }
    setSending(false);
  };
  const langLabel = (l: string) => l === 'hu' ? '🇭🇺 HU' : l === 'en' ? '🇬🇧 EN' : 'Mindenki';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="comm-campaign-layout">
        <motion.div className="comm-editor comm-campaign-editor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <div className="comm-editor-header">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '7px' }}><Icons.Mail /> Hírlevél szerkesztő</span>
            <div style={{ display: 'flex', gap: '3px' }}>
              {(['rich', 'html', 'preview'] as const).map((m, i) => (<button key={m} className="comm-btn btn-ghost btn-sm" onClick={() => { if (m === 'html' && editorMode === 'rich') setCustomHtml(buildHtml()); setEditorMode(m); }} style={{ color: editorMode === m ? 'var(--text-primary)' : undefined, fontWeight: editorMode === m ? 600 : undefined }}>{['Szerkesztő', 'HTML', 'Előnézet'][i]}</button>))}
            </div>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label className="comm-label">Tárgy</label><input className="comm-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="pl. Új funkció a Davelopmentnél 🚀" /></div>
            <AnimatePresence mode="wait">
              {editorMode === 'rich' && (<motion.div key="rich" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label className="comm-label">Tartalom</label><RichEditor onChange={setBodyHtml} placeholder="Kezdd el írni a hírlevelet... Képeket a toolbar Kép gombjával szúrhatsz be." /></div></motion.div>)}
              {editorMode === 'html' && (<motion.div key="html" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label className="comm-label">Egyedi HTML</label><button className="comm-btn btn-ghost btn-sm" onClick={() => setCustomHtml(buildHtml())} style={{ fontSize: '11px' }}>← Betöltés szerkesztőből</button></div><textarea className="comm-textarea" value={customHtml} onChange={e => setCustomHtml(e.target.value)} placeholder="<!DOCTYPE html>..." rows={18} style={{ fontFamily: 'Geist Mono, monospace', fontSize: '12px' }} /><div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>A <span style={{ fontFamily: 'Geist Mono, monospace', color: 'var(--text-muted)' }}>{'{{UNSUBSCRIBE_URL}}'}</span> automatikusan kicserélődik per-subscriber leiratkozó linkre.</div></motion.div>)}
              {editorMode === 'preview' && (<motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><iframe srcDoc={finalHtml} style={{ width: '100%', minHeight: '480px', border: 'none', borderRadius: '8px', background: '#fff' }} title="Előnézet" /></motion.div>)}
            </AnimatePresence>
          </div>
        </motion.div>
        <div className="comm-campaign-sidebar">
          <motion.div className="comm-card" custom={0} variants={cardVariants} initial="hidden" animate="show">
            <div className="comm-card-header"><div className="comm-card-icon" style={{ background: 'rgba(124,106,247,0.1)', color: 'var(--accent-indigo)' }}><Icons.Users /></div><div><div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Kinek megy?</div><div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Válaszd ki a célcsoportot</div></div></div>
            <div className="comm-card-body">
              <select className="comm-select" value={language} onChange={e => setLanguage(e.target.value)} style={{ width: '100%' }}><option value="all">Mindenki – {stats?.activeSubs ?? '...'} fő</option><option value="hu">Magyar feliratkozók – {stats?.huSubs ?? '...'} fő</option><option value="en">Angol feliratkozók – {stats?.enSubs ?? '...'} fő</option></select>
              <div className="comm-audience-box"><div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(61,255,160,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', flexShrink: 0 }}><Icons.UserCheck /></div><div><div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'Geist Mono, monospace', letterSpacing: '-0.5px' }}>{targetCount}</div><div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{targetLabel}</div></div></div>
              {targetCount === 0 && <div style={{ fontSize: '12px', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.AlertTriangle /> Nincs aktív feliratkozó</div>}
            </div>
          </motion.div>
          <motion.div className="comm-card" custom={1} variants={cardVariants} initial="hidden" animate="show">
            <div className="comm-card-header"><div className="comm-card-icon" style={{ background: 'rgba(240,199,66,0.1)', color: 'var(--accent-amber)' }}><Icons.Flask /></div><div><div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Teszt küldés</div><div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Ellenőrizd mielőtt kiküldöd</div></div></div>
            <div className="comm-card-body">
              <input className="comm-input" type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} placeholder="hello.davelopment@gmail.com" style={{ width: '100%' }} />
              <motion.button className="comm-btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={handleTestSend} disabled={sendingTest || !testEmail || !subject} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}><Icons.Send />{sendingTest ? 'Küldés...' : 'Teszt elküldése'}</motion.button>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)', lineHeight: 1.5 }}>A tárgyban <span style={{ fontFamily: 'Geist Mono, monospace', color: 'var(--text-muted)' }}>[TEST]</span> prefix lesz.</div>
            </div>
          </motion.div>
          <motion.div className="comm-card" custom={2} variants={cardVariants} initial="hidden" animate="show">
            <div className="comm-card-header"><div className="comm-card-icon" style={{ background: 'rgba(61,255,160,0.08)', color: 'var(--accent-green)' }}><Icons.Rocket /></div><div><div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Éles küldés</div><div style={{ fontSize: '11px', color: 'var(--accent-red)' }}>Visszavonhatatlan</div></div></div>
            <div className="comm-card-body">
              <motion.button className="comm-btn btn-success" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setConfirmOpen(true)} disabled={sending || !subject || !hasContent || targetCount === 0} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}><Icons.Rocket />{sending ? 'Küldés...' : `Küldés – ${targetCount} főnek`}</motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div className="comm-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="comm-card-header" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setHistoryOpen(o => !o)}>
          <div className="comm-card-icon" style={{ background: 'rgba(124,106,247,0.1)', color: 'var(--accent-indigo)' }}><Icons.History /></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Kampány előzmények</div><div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{campaigns.filter(c => !c.isTest).length} éles · {campaigns.filter(c => c.isTest).length} teszt</div></div>
          <motion.div animate={{ rotate: historyOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ color: 'var(--text-faint)' }}><Icons.ChevronDown /></motion.div>
        </div>
        <AnimatePresence>
          {historyOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
              {campaigns.length === 0 ? (<div className="comm-empty" style={{ padding: '28px 20px' }}><div style={{ fontSize: '13px' }}>Még nem küldtél kampányt</div></div>)
              : campaigns.map((c, i) => (<motion.div key={c.id} className="comm-history-row" custom={i} variants={fadeUp} initial="hidden" animate="show" onClick={() => setSelectedCampaign(c)} style={{ opacity: c.isTest ? 0.6 : 1 }}><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</div><div style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'Geist Mono, monospace' }}>{formatDate(c.sentAt)}</div></div><div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>{c.isTest ? <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '5px', background: 'rgba(240,199,66,0.1)', color: 'var(--accent-amber)', border: '0.5px solid rgba(240,199,66,0.2)', fontFamily: 'Geist Mono, monospace', fontWeight: 600 }}>TEST</span> : <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'Geist Mono, monospace' }}>{langLabel(c.language)}</span>}<span style={{ fontSize: '11px', color: c.isTest ? 'var(--text-faint)' : 'var(--accent-green)', fontFamily: 'Geist Mono, monospace', fontWeight: 600 }}>{c.sentCount} fő</span><button className="comm-btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setSelectedCampaign(c); }}><Icons.Eye /></button></div></motion.div>))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {confirmOpen && (<ConfirmDialog title="Megerősítés szükséges" message={`Biztosan elkülded a „${subject}" tárgyú hírlevelet ${targetCount} főnek? (${targetLabel})\n\nEz a művelet nem vonható vissza.`} confirmLabel="Igen, küldés" onConfirm={handleRealSend} onCancel={() => setConfirmOpen(false)} />)}
        {selectedCampaign && <CampaignHistoryModal campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} showToast={showToast} />}
      </AnimatePresence>
    </div>
  );
};
// ─── QuotaCard ────────────────────────────────────────────────────────────────

const QuotaCard = () => {
  const [quota, setQuota] = React.useState<QuotaData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/communications/quota');
        const data = await res.json();
        if (data.ok) setQuota(data);
      } catch {}
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <motion.div className="comm-card" custom={4} variants={cardVariants} initial="hidden" animate="show">
      <div className="comm-card-header">
        <div className="comm-card-icon" style={{ background: 'rgba(124,106,247,0.1)', color: 'var(--accent-indigo)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        </div>
        <div><div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Resend kvóta</div><div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Betöltés...</div></div>
      </div>
    </motion.div>
  );

  if (!quota) return null;

  const p = quota.month.percentUsed;
  const barColor = p >= 90 ? 'var(--accent-red)' : p >= 70 ? 'var(--accent-amber)' : 'var(--accent-indigo)';

  return (
    <motion.div className="comm-card" custom={4} variants={cardVariants} initial="hidden" animate="show">
      <div className="comm-card-header">
        <div className="comm-card-icon" style={{ background: 'rgba(124,106,247,0.1)', color: 'var(--accent-indigo)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Resend kvóta – {quota.yearMonth}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Free tier: 3 000/hó · 100/nap</div>
        </div>
        {p >= 80 && (
          <span style={{ fontSize: '11px', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Icons.AlertTriangle /> Figyelem
          </span>
        )}
      </div>
      <div className="comm-card-body">
        {/* Havi progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Havi felhasználás</span>
          <span style={{ fontSize: '20px', fontWeight: 700, color: barColor, fontFamily: 'Geist Mono, monospace' }}>
            {quota.month.sent}
            <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-faint)' }}> / {quota.month.limit}</span>
          </span>
        </div>
        <div style={{ height: '6px', background: 'var(--bg-inner2)', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, p)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ height: '100%', background: barColor, borderRadius: '3px' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'Geist Mono, monospace' }}>{p}% felhasználva</span>
          <span style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'Geist Mono, monospace', color: quota.month.remaining < 300 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
            {quota.month.remaining} maradt
          </span>
        </div>

        {/* Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          {[
            { label: 'Kampány', value: quota.month.breakdown.campaigns, color: 'var(--accent-indigo)' },
            { label: 'Tranzakciós', value: quota.month.breakdown.transactional, color: 'var(--accent-green)' },
            { label: 'Teszt', value: quota.month.breakdown.tests, color: 'var(--text-muted)' },
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--bg-inner)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: item.color, fontFamily: 'Geist Mono, monospace' }}>{item.value}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '2px' }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Napi */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ma elküldve</span>
            <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'Geist Mono, monospace', color: quota.today.percentUsed >= 90 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
              {quota.today.sent} / {quota.today.limit}
              <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-faint)', marginLeft: '6px' }}>({quota.today.remaining} maradt)</span>
            </span>
          </div>
          <div style={{ height: '4px', background: 'var(--bg-inner2)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, quota.today.percentUsed)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              style={{ height: '100%', background: quota.today.percentUsed >= 90 ? 'var(--accent-red)' : 'var(--accent-green)', borderRadius: '2px' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Settings Tab ─────────────────────────────────────────────────────────────

const SettingsTab = ({ showToast }: { showToast: (t: ToastMsg) => void }) => {
  const [testTo, setTestTo] = useState('');
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  const handleTest = async () => {
    if (!testTo) { showToast({ type: 'error', text: 'Add meg a teszt email címet' }); return; }
    setTesting(true); setStatus('idle');
    try {
      const res = await fetch('/api/communications/test-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: testTo }) });
      const data = await res.json();
      if (data.ok) { setStatus('ok'); showToast({ type: 'success', text: 'Teszt email elküldve!' }); }
      else { setStatus('error'); showToast({ type: 'error', text: data.error || 'Küldési hiba' }); }
    } catch { setStatus('error'); showToast({ type: 'error', text: 'Hálózati hiba' }); }
    setTesting(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[
        { icon: <Icons.Bolt />, iconBg: 'rgba(240,199,66,0.1)', iconColor: 'var(--accent-amber)', title: 'Resend konfiguráció', subtitle: 'Email küldő szolgáltatás', rows: [{ k: 'Szolgáltatás', v: 'Resend.com' }, { k: 'API kulcs', v: '.env-ből betöltve' }, { k: 'Feladó', v: 'hello@davelopment.hu' }, { k: 'Domain', v: 'davelopment.hu ✓ Verified' }, { k: 'Értesítések', v: 'hello.davelopment@gmail.com' }, { k: 'Free tier', v: '3 000 email/hó · 100/nap' }] },
        { icon: <Icons.Globe />, iconBg: 'rgba(37,99,235,0.1)', iconColor: '#60a5fa', title: 'DNS rekordok', subtitle: 'Rackforest – davelopment.hu', rows: [{ k: 'TXT · resend._domainkey', v: 'DKIM ✓' }, { k: 'MX · send', v: 'Visszapattanó email ✓' }, { k: 'TXT · send', v: 'SPF ✓' }] },
        { icon: <Icons.Shield />, iconBg: 'rgba(61,255,160,0.08)', iconColor: 'var(--accent-green)', title: 'Biztonság', subtitle: 'Környezeti változók', rows: [{ k: 'RESEND_API_KEY', v: 'GitHub Secrets ✓' }, { k: 'NOTIFY_EMAIL', v: 'hello.davelopment@gmail.com' }] },
      ].map((s, i) => (
        <motion.div key={s.title} className="comm-card" custom={i} variants={cardVariants} initial="hidden" animate="show">
          <div className="comm-card-header"><div className="comm-card-icon" style={{ background: s.iconBg, color: s.iconColor }}>{s.icon}</div><div><div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.title}</div><div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{s.subtitle}</div></div></div>
          <div className="comm-card-body">{s.rows.map(r => (<div key={r.k} className="comm-info-row"><span className="comm-info-key">{r.k}</span><span className="comm-info-val">{r.v}</span></div>))}</div>
        </motion.div>
      ))}

      <motion.div className="comm-card" custom={3} variants={cardVariants} initial="hidden" animate="show">
        <div className="comm-card-header"><div className="comm-card-icon" style={{ background: 'rgba(124,106,247,0.1)', color: 'var(--accent-indigo)' }}><Icons.Flask /></div><div><div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Kapcsolat teszt</div><div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Ellenőrizd az email küldést</div></div></div>
        <div className="comm-card-body">
          <div style={{ display: 'flex', gap: '8px' }}>
            <input className="comm-input" type="email" value={testTo} onChange={e => setTestTo(e.target.value)} placeholder="hello.davelopment@gmail.com" style={{ flex: 1 }} />
            <motion.button className="comm-btn btn-primary" onClick={handleTest} disabled={testing || !testTo} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              {testing ? <div className="comm-spinner" /> : <Icons.Send />}{testing ? '' : 'Küldés'}
            </motion.button>
          </div>
          <AnimatePresence>
            {status === 'ok' && <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: '10px 12px', background: 'rgba(61,255,160,0.06)', border: '1px solid rgba(61,255,160,0.15)', borderRadius: '8px', fontSize: '13px', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '7px' }}><Icons.Check /> Rendben! Az email megérkezett.</motion.div>}
            {status === 'error' && <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: '10px 12px', background: 'rgba(248,81,73,0.06)', border: '1px solid rgba(248,81,73,0.15)', borderRadius: '8px', fontSize: '13px', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '7px' }}><Icons.AlertTriangle /> Hiba! Ellenőrizd a RESEND_API_KEY-t.</motion.div>}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ÚJ: Kvóta kártya */}
      <QuotaCard />
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────

export const App = () => {
  const [tab, setTab] = useState<'leads' | 'subscribers' | 'campaigns' | 'settings'>('leads');
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const [stats, setStats] = useState<{ newLeads: number; activeSubs: number; totalLeads: number; newSubs: number; monthSent: number; totalSubs: number } | null>(null);

  useEffect(() => {
    const apply = () => { applyTokens(getStrapiTheme()); };
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', apply);
    return () => { obs.disconnect(); mq.removeEventListener('change', apply); };
  }, []);

  useEffect(() => {
    const load = () => fetch('/api/communications/stats').then(r => r.json()).then(d => { if (d.ok) setStats(d); });
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, []);

  const showToast = useCallback((t: ToastMsg) => { setToast(t); setTimeout(() => setToast(null), 3500); }, []);
  const tabContentRef = React.useRef<HTMLDivElement>(null);
  const [pendingFilter, setPendingFilter] = React.useState<string | null>(null);

  const navigateTo = (targetTab: typeof tab, filter?: string) => {
    setTab(targetTab);
    if (filter) setPendingFilter(filter);
    setTimeout(() => { tabContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
  };

  const tabs = [
    { key: 'leads' as const, label: 'Érdeklődők', icon: <Icons.Mail />, badge: stats?.newLeads },
    { key: 'subscribers' as const, label: 'Feliratkozók', icon: <Icons.Users />, badge: stats?.newSubs },
    { key: 'campaigns' as const, label: 'Kampányok', icon: <Icons.Send /> },
    { key: 'settings' as const, label: 'Beállítások', icon: <Icons.Settings /> },
  ];

  const statCards = stats ? [
    { label: 'Új érdeklődő', value: stats.newLeads, color: 'var(--accent-amber)', sub: 'feldolgozásra vár', alert: stats.newLeads > 0, targetTab: 'leads' as const, targetFilter: 'new' },
    { label: 'Összes érdeklődő', value: stats.totalLeads, color: 'var(--text-primary)', sub: 'beérkezett', alert: false, targetTab: 'leads' as const, targetFilter: 'all' },
    { label: 'Új feliratkozó', value: stats.newSubs, color: 'var(--accent-amber)', sub: 'megerősítés alatt', alert: stats.newSubs > 0, targetTab: 'subscribers' as const, targetFilter: 'new' },
    { label: 'Aktív feliratkozó', value: stats.activeSubs, color: 'var(--accent-green)', sub: `${stats.totalSubs ?? 0} összes`, alert: false, targetTab: 'subscribers' as const, targetFilter: 'active' },
    { label: 'Elküldött e-mail', value: stats.monthSent ?? 0, color: 'var(--accent-indigo)', sub: `${3000 - (stats.monthSent ?? 0)} maradt / hó`, alert: false, targetTab: 'campaigns' as const, targetFilter: undefined },
  ] : [];

  return (
    <>
      <style>{staticStyles}</style>
      <div className="comm-app">
        <motion.div style={{ marginBottom: '24px' }} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 style={{ fontSize: '17px', fontWeight: 600, margin: 0, letterSpacing: '-0.4px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icons.Mail /> Communications
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '3px 0 0' }}>Érdeklődők, feliratkozók, kampányok</p>
        </motion.div>

        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            {statCards.map((s, i) => (
              <motion.div key={s.label} className="comm-stat-card" custom={i} variants={cardVariants} initial="hidden" animate="show"
                onClick={() => navigateTo(s.targetTab, s.targetFilter)}
                whileHover={{ y: -2, scale: 1.02, transition: { duration: 0.12 } }} whileTap={{ scale: 0.97 }} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '22px', fontWeight: 600, color: s.alert ? 'var(--accent-amber)' : s.color, fontFamily: 'Geist Mono, monospace', letterSpacing: '-0.5px' }}>{s.value}</div>
                  {s.alert && s.value > 0 && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-amber)', marginTop: '6px', flexShrink: 0 }} />}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>{s.label}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '1px', fontFamily: 'Geist Mono, monospace' }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="comm-tab-bar" style={{ display: 'flex', gap: '2px', marginBottom: '20px', background: 'var(--bg-inner)', padding: '3px', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`comm-tab-btn${tab === t.key ? ' active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {tab === t.key && <motion.div layoutId="comm-tab-pill" transition={{ type: 'spring', stiffness: 520, damping: 40 }} style={{ position: 'absolute', inset: 0, borderRadius: '10px', background: 'var(--bg-card)', border: '0.5px solid var(--border-hover)', boxShadow: 'var(--shadow)', zIndex: 0 }} />}
              <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                {t.icon}{t.label}
                {(t.badge ?? 0) > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '17px', height: '17px', padding: '0 4px', background: 'var(--accent-amber)', color: 'var(--bg-page)', borderRadius: '20px', fontSize: '10px', fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}>
                    {t.badge}
                  </motion.span>
                )}
              </span>
            </button>
          ))}
        </div>

        <div ref={tabContentRef}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
              {tab === 'leads' && <LeadsTab showToast={showToast} initialFilter={pendingFilter} onFilterApplied={() => setPendingFilter(null)} />}
              {tab === 'subscribers' && <SubscribersTab showToast={showToast} initialFilter={pendingFilter} onFilterApplied={() => setPendingFilter(null)} />}
              {tab === 'campaigns' && <CampaignsTab showToast={showToast} />}
              {tab === 'settings' && <SettingsTab showToast={showToast} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div className={`comm-toast toast-${toast.type}`} initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ type: 'spring', stiffness: 480, damping: 36 }}>
              {toast.type === 'success' && <Icons.Check />}
              {toast.type === 'error' && <Icons.AlertTriangle />}
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default App;
