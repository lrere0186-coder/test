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
