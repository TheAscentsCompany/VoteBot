# Script Node.js de gestion automatique de votes

## Présentation

Ce script Node.js permet d’automatiser l’envoi de requêtes de vote vers plusieurs sites configurés à l’aide d’identifiants (`siteId`).

Le script :
- initialise un vote via une requête HTTP ;
- tente ensuite de valider le vote ;
- applique des délais spécifiques selon le site ;
- relance automatiquement les votes après expiration du délai ;
- affiche les résultats dans la console.

---

# Fonctionnement du script

Le fichier principal est :

```bash
vote.js
```

Le script contient notamment :

```js
const SITE_IDS = [1, 9, 7, 10];
const UUID = "UUID TRIMMED ex: eb69cef08d6b49bb9575e751185834b2";
const USERNAME = "Username ex: WarnD";
```

Avant exécution, il faut modifier :

| Variable | Description |
|---|---|
| UUID | UUID du joueur sans tirets |
| USERNAME | Pseudo du joueur |

https://mcuuid.net/
---

# Délais automatiques

Chaque site possède un délai spécifique avant le prochain vote :

| Site ID | Délai |
|---|---|
| 1 | 24 heures + 5 secondes |
| 9 | 3 heures + 5 secondes |
| 7 | 1 heure 30 + 5 secondes |
| 10 | 1 heure 30 + 5 secondes |

En cas d’erreur `"Too Early"`, le script attend 5 minutes avant de réessayer.

---

# Structure du script

Le script repose sur plusieurs fonctions principales :

| Fonction | Rôle |
|---|---|
| `voteForSite(siteId)` | Initialise et valide un vote |
| `handleVote(siteId)` | Gère les résultats et planifie la suite |
| `scheduleVote(siteId, delayMs)` | Programme un futur vote |
| `startVoting()` | Lance tous les votes |

---

# Prérequis

- Windows 10 ou Windows 11
- Node.js installé
- Connexion Internet

Le script utilise `fetch`, disponible nativement dans les versions récentes de Node.js.

Il est recommandé d’utiliser la version **LTS** de Node.js.

---

# Installation de Node.js sur Windows

## 1. Télécharger Node.js

Télécharger la version LTS depuis le site officiel :

```text
https://nodejs.org/en/download
```

---

## 2. Installer Node.js

Lancer le fichier `.msi` téléchargé puis :

- cliquer sur `Next`
- laisser les options par défaut
- terminer l’installation

---

## 3. Vérifier l’installation

Ouvrir :
- CMD
- PowerShell
- Windows Terminal

Puis exécuter :

```bash
node -v
```

Exemple :

```bash
v22.15.0
```

Vérifier également npm :

```bash
npm -v
```

Exemple :

```bash
10.9.2
```

---

# Installation du script

## 1. Créer un dossier

Exemple :

```text
C:\vote-script
```

---

## 2. Ajouter le fichier

Placer :

```text
vote.js
```

dans le dossier.

---

# Configuration du script

Modifier les variables suivantes :

```js
const UUID = "VOTRE_UUID";
const USERNAME = "VOTRE_PSEUDO";
```

Exemple :

```js
const UUID = "eb69cef08d6b49bb9575e751185834b2";
const USERNAME = "WarnD";
```

---

# Exécution du script

## 1. Ouvrir un terminal

Dans Windows :
- CMD
- PowerShell
- Windows Terminal

---

## 2. Se déplacer dans le dossier

Exemple :

```bash
cd C:\vote-script
```

---

## 3. Lancer le script

```bash
node vote.js
```

---

# Exemple de logs

```bash
[23/05/2026 15:30:00] Vote initié pour le site de vote ID 1 !
[23/05/2026 15:30:01] A Voté pour le site de vote ID 1
[23/05/2026 15:30:01] Prochain vote pour le site 1 dans 1440.1 minutes (succès)
```

---

# Arrêter le script

Dans le terminal :

```bash
CTRL + C
```

---

# Gestion des erreurs

Le script gère :
- les erreurs réseau ;
- les erreurs HTTP ;
- les votes trop précoces (`425 Too Early`) ;
- les exceptions JavaScript.

Toutes les erreurs sont affichées dans la console.

---

# Notes importantes

- Le terminal doit rester ouvert.
- Le script fonctionne en continu grâce à `setTimeout`.
- Si le PC redémarre, il faudra relancer le script.
- Les délais sont configurés dans :

```js
const SITE_DELAYS = {
    1: 24 * 60 * 60 * 1000 + 5000,
    9: 3 * 60 * 60 * 1000 + 5000,
    7: 1.5 * 60 * 60 * 1000 + 5000,
    10: 1.5 * 60 * 60 * 1000 + 5000
};
```

---

# Technologies utilisées

- Node.js
- JavaScript
- Fetch API

---

# Sources

Node.js recommande l’utilisation de la version LTS pour les environnements stables et inclut npm avec l’installation officielle Windows.

Sources :

- Node.js — Download Node.js : https://nodejs.org/en/download
- npm Docs — Downloading and installing Node.js and npm : https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/
