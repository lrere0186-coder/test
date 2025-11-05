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
