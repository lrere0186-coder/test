#!/bin/bash

# =====================================================
# SCRIPT D'EXPORT DU PROJET EN UN SEUL FICHIER TEXTE
# =====================================================

OUTPUT_FILE="project-export.txt"

echo "🚀 Démarrage de l'export du projet..."
echo ""

# Supprimer le fichier de sortie s'il existe déjà
rm -f "$OUTPUT_FILE"

# Ajouter un header
cat > "$OUTPUT_FILE" << 'EOF'
================================================================================
                    EXPORT COMPLET DU PROJET LEGACY VAULT
================================================================================
Date d'export : $(date '+%Y-%m-%d %H:%M:%S')
================================================================================

EOF

echo "📝 Export en cours..."

# Trouver tous les fichiers pertinents et les exporter
find . -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/.next/*" \
  -not -path "*/.git/*" \
  -not -path "*/dist/*" \
  -not -path "*/build/*" \
  -not -path "*/.cache/*" \
  -not -path "*/coverage/*" \
  -not -path "*/public/*" \
  -not -path "*/*.log" \
  -not -path "*/package-lock.json" \
  -not -path "*/yarn.lock" \
  -not -path "*/pnpm-lock.yaml" \
  -not -name "*.png" \
  -not -name "*.jpg" \
  -not -name "*.jpeg" \
  -not -name "*.gif" \
  -not -name "*.svg" \
  -not -name "*.ico" \
  -not -name "*.woff" \
  -not -name "*.woff2" \
  -not -name "*.ttf" \
  -not -name "*.eot" \
  -not -name "*.webp" \
  -not -name "$OUTPUT_FILE" \
  -not -name "export-project.sh" \
  | sort | while read -r file; do

    # Calculer le chemin relatif
    relative_path="${file#./}"

    # Ajouter le nom du fichier
    echo "" >> "$OUTPUT_FILE"
    echo "================================================================================" >> "$OUTPUT_FILE"
    echo "FILE: $relative_path" >> "$OUTPUT_FILE"
    echo "================================================================================" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    # Ajouter le contenu du fichier
    cat "$file" >> "$OUTPUT_FILE"

    echo "" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    # Afficher le progrès
    echo "✅ Exporté : $relative_path"
done

echo ""
echo "✅ Export terminé !"
echo "📄 Fichier créé : $OUTPUT_FILE"
echo ""

# Afficher quelques stats
file_count=$(grep -c "^FILE:" "$OUTPUT_FILE")
line_count=$(wc -l < "$OUTPUT_FILE")

echo "📊 Statistiques :"
echo "   - Nombre de fichiers exportés : $file_count"
echo "   - Nombre total de lignes : $line_count"
echo "   - Taille du fichier : $(du -h "$OUTPUT_FILE" | cut -f1)"
echo ""
echo "🎉 Terminé ! Vous pouvez maintenant ouvrir $OUTPUT_FILE"
