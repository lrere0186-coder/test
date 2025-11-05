# 📋 INSTRUCTIONS POUR CORRIGER SUPABASE

## 🚨 PROBLÈMES RÉSOLUS

Toutes les modifications de code sont **terminées et pushées** !
Il reste juste à exécuter 2 scripts SQL dans votre base de données Supabase.

---

## 📝 ÉTAPE 1 : Corriger les prix des slots

### Pourquoi ?
Les prix actuels sont incorrects (slot 201 = 100.25€ au lieu de suivre la logique +50€/2 slots).

### Comment faire ?

1. **Allez sur Supabase** : https://supabase.com/dashboard
2. **Ouvrez votre projet**
3. Cliquez sur **"SQL Editor"** dans la barre latérale
4. Cliquez sur **"New query"**
5. **Copiez-collez** le contenu du fichier `fix-prices.sql` :

```sql
-- ===============================================
-- SCRIPT DE CORRECTION DES PRIX DES SLOTS
-- Logique : +50€ tous les 2 slots
-- Slot 1-2: 5000€ (500000 centimes)
-- Slot 3-4: 5050€ (505000 centimes)
-- Slot 5-6: 5100€ (510000 centimes)
-- etc.
-- ===============================================

-- Mise à jour des prix pour tous les 10,000 slots
UPDATE slots
SET price = 500000 + (FLOOR((id - 1) / 2) * 5000)
WHERE id >= 1 AND id <= 10000;

-- Vérification : Afficher les 20 premiers slots
SELECT id, price, price / 100 as price_in_euros, status
FROM slots
ORDER BY id
LIMIT 20;
```

6. **Cliquez sur "Run"** (ou Ctrl+Entrée)
7. **Vérifiez les résultats** : Vous devriez voir les 20 premiers slots avec leurs nouveaux prix

✅ **Résultat attendu :**
- Slot 1-2 : 5000€
- Slot 3-4 : 5050€
- Slot 5-6 : 5100€
- etc.

---

## 🧹 ÉTAPE 2 : Nettoyer les données de test

### Pourquoi ?
Vous avez des slots "sold" qui sont des données de test (70 slots environ).

### Comment faire ?

1. Dans le **SQL Editor** de Supabase
2. Créez une **nouvelle query**
3. **Copiez-collez** le contenu du fichier `clean-test-data.sql` :

```sql
-- ===============================================
-- SCRIPT DE NETTOYAGE DES DONNÉES DE TEST
-- ===============================================

-- 1. Réinitialiser tous les slots "sold" en "locked"
-- (Les slots 201+ doivent être locked, seuls les 200 premiers disponibles)
UPDATE slots
SET status = 'locked', reserved_until = NULL, updated_at = NOW()
WHERE status = 'sold' AND id > 200;

-- 2. Pour les slots 1-200 qui sont sold, les remettre en available
UPDATE slots
SET status = 'available', reserved_until = NULL, updated_at = NOW()
WHERE status = 'sold' AND id <= 200;

-- 3. Supprimer toutes les legacies de test
DELETE FROM timeline_events WHERE legacy_id IN (SELECT id FROM legacies);
DELETE FROM media WHERE legacy_id IN (SELECT id FROM legacies);
DELETE FROM payments;
DELETE FROM legacies;

-- 4. Vérifier l'état final
SELECT
  status,
  COUNT(*) as count
FROM slots
GROUP BY status
ORDER BY status;
```

4. **Cliquez sur "Run"**
5. **Vérifiez les résultats** : Vous devriez voir le compte de slots par statut

✅ **Résultat attendu :**
- available : ~200 slots
- locked : ~9800 slots
- reserved : 0
- sold : 0

---

## ⚠️ ATTENTION

**NE LANCEZ PAS LE SCRIPT DE NETTOYAGE SI :**
- Vous avez de vraies ventes/legacies de clients
- Vous voulez garder les données de test

**Sinon, toutes les legacies seront supprimées !**

---

## 🎉 ÉTAPE 3 : Tester le site

Après avoir exécuté les scripts :

1. **Rechargez votre site** : `npm run dev`
2. **Allez sur "The Slots"** : Vous devriez voir exactement 200 slots disponibles
3. **Vérifiez les prix** :
   - Slot 1 : 5000€
   - Slot 3 : 5050€
   - Slot 5 : 5100€
4. **Testez la timeline** :
   - Réservez un slot
   - Dans Step 2, ajoutez des events à la timeline
   - Tapez une date, puis un texte, appuyez sur **Entrée**
   - Vérifiez le design avec la flèche
5. **Allez sur le Dashboard** :
   - Si vous avez des legacies, vous devriez voir la timeline affichée

---

## 📚 MODIFICATIONS EFFECTUÉES DANS LE CODE

Tout est **déjà pushé** sur la branche `claude/improve-project-011CUphaYWmx3poybNhb8inZ` :

✅ **Fichiers modifiés :**
1. `components/TimelineEditor.tsx` - Nouveau design avec flèche et Enter
2. `pages-old/DashboardPage.tsx` - Affichage de la timeline
3. `app/api/user/legacies/route.ts` - API récupère les timeline events
4. `fix-prices.sql` - Script de correction des prix
5. `clean-test-data.sql` - Script de nettoyage

✅ **Fonctionnalités :**
- Prix correctement calculés (+50€/2 slots)
- Affichage limité à 200 slots disponibles
- Timeline avec design amélioré (flèche, date gauche, texte droite, Enter pour valider)
- Timeline visible dans le Dashboard
- Scripts SQL pour corriger la base de données

---

## 🆘 BESOIN D'AIDE ?

Si vous avez des problèmes :

1. **Erreur SQL** : Vérifiez que vous êtes bien connecté à votre projet Supabase
2. **Données manquantes** : Assurez-vous que la table `timeline_events` existe
3. **Prix toujours incorrects** : Exécutez à nouveau le script `fix-prices.sql`
4. **270 slots au lieu de 200** : Le déblocage automatique maintient toujours 200 slots "available"

---

## ✅ CHECKLIST FINALE

- [ ] Script `fix-prices.sql` exécuté dans Supabase
- [ ] Script `clean-test-data.sql` exécuté dans Supabase (si souhaité)
- [ ] Site relancé avec `npm run dev`
- [ ] Vérification : 200 slots disponibles exactement
- [ ] Vérification : Prix corrects (5000€, 5050€, 5100€...)
- [ ] Test : Timeline fonctionne avec Enter
- [ ] Test : Timeline visible dans Dashboard

**TOUT EST PRÊT ! 🚀**
