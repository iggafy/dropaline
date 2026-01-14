# Implementation Plan - Advanced Feature Suite

This plan outlines the implementation of four major features for Drop a Line: Drafts Management, Rich Media Support, Private Drops (with E2EE), and Dark Mode.

## 1. Infrastructure & Database (`/src/supabase/migrations/`)
- [ ] Create `20250523000006_feature_expansion.sql`:
    - [ ] `drafts` table: `id`, `author_id`, `title`, `content`, `layout`, `updated_at`.
    - [ ] `private_drops` table: `id`, `sender_id`, `receiver_id`, `encrypted_content`, `encrypted_title`, `created_at`.
    - [ ] Add `public_key` column to `profiles` for E2EE.
    - [ ] Add `theme_preference` column to `profiles` ('light' | 'dark' | 'system').
    - [ ] Create `media` storage bucket for post images.
    - [ ] Enable Realtime for `drafts` and `private_drops`.

## 2. Navigation & Types (`/src/types.ts`, `/src/components/Sidebar.tsx`)
- [ ] Update `AppView` enum: `DRAFTS`, `PRIVATE_DROPS`.
- [ ] Add `Draft` and `PrivateDrop` interfaces.
- [ ] Update `Sidebar.tsx` to include new navigation items.

## 3. Drafts Management (`/src/components/DraftsView.tsx`)
- [ ] Create `DraftsView.tsx` to list, delete, and open drafts.
- [ ] Refactor `WriterView.tsx`:
    - [ ] Sync auto-save to Supabase `drafts` table.
    - [ ] Support loading an existing draft for editing.

## 4. Rich Media Support (`/src/components/WriterView.tsx`)
- [ ] Install `@tiptap/extension-image`.
- [ ] Add image upload button to Tiptap toolbar.
- [ ] Implement `handleImageUpload` to Supabase `media` bucket.
- [ ] Update `generatePrintHtml` in `App.tsx` to render images correctly for physical output.

## 5. Private Drops & E2EE (`/src/components/PrivateDropsView.tsx`)
- [ ] Integrate `tweetnacl` for encryption.
- [ ] Key Management:
    - [ ] Generate keys on first access if not present.
    - [ ] Store public key in profile; private key in secure local storage (or prompted).
- [ ] Create `PrivateDropsView.tsx` for 1-to-1 secure messaging.

## 6. Dark Mode (`/src/index.css`, `/src/components/SettingsView.tsx`)
- [ ] Define CSS variable palette for `:root` and `[data-theme='dark']`.
- [ ] Implement theme toggle in `SettingsView`.
- [ ] Apply smooth transitions between themes.
