# NOVA

Life OS personnel — Home, Calendar, Projects, Goals, Business, Finances, Habits, Creative Lab, Journal, Nova AI, Quick Capture, Cmd+K.

## Démarrer

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000). L'app tourne pour l'instant en local (les données sont stockées dans le navigateur via `localStorage`) — aucun compte n'est requis.

Nova AI fonctionne déjà en local (assistant à base de règles branché sur tes données réelles) — aucune clé API n'est nécessaire pour l'utiliser.

## Connecter Supabase (optionnel, pour synchroniser dans le cloud)

1. Crée un projet sur [supabase.com](https://supabase.com).
2. Applique le schéma : colle le contenu de `supabase/migrations/0001_init.sql` dans l'éditeur SQL du projet, ou avec la CLI :
   ```bash
   supabase link --project-ref <ref>
   supabase db push
   ```
3. Copie `.env.example` vers `.env.local` et renseigne `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. La bascule du stockage local vers Supabase se fait dans `lib/store/*` (même forme de données des deux côtés).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · Motion · Zustand · TanStack Query · Supabase (à connecter)
