# Projet semane5 (React + Vite)

Application de liste de tâches (notes) avec:

- ajout de note,
- marquage terminé/non terminé,
- suppression,
- vidage complet,
- mode clair/sombre,
- sauvegarde locale via `localStorage`.

## Structure utile

- `src/main.jsx` : point d'entrée React (montage dans `#root`).
- `src/App.jsx` : compose l'app et persiste les notes dans `localStorage`.
- `src/context/AppContext.jsx` : état global (`useReducer`) + actions + statistiques.
- `src/context/useAppContext.js` : hook custom pour lire le context facilement.
- `src/components/` : UI (`Header`, `NoteForm`, `NoteList`).
- `src/App.css` et `src/index.css` : styles globaux et thème.
- `vite.config.js` : config Vite + base GitHub Pages.
- `eslint.config.js` : règles de qualité de code.

## Flux de données (simple)

1. L'utilisateur interagit dans les composants.
2. Les composants appellent une action du context (`addNote`, `toggleComplete`, etc.).
3. Le reducer met à jour l'état global.
4. React rerender l'UI avec le nouvel état.
5. `App.jsx` sauvegarde automatiquement les notes dans `localStorage`.

## Scripts npm

- `npm run dev` : lance le serveur de développement.
- `npm run build` : construit la version production.
- `npm run preview` : prévisualise le build.
- `npm run lint` : vérifie les règles ESLint.
- `npm run deploy` : publie `dist` sur GitHub Pages.

## Note

`package.json` est un fichier JSON pur, donc on ne peut pas y mettre des commentaires directement sans le casser. Les explications associées sont donc regroupées ici.
