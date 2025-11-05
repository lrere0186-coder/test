'use client';
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

interface FileUploadProps {
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
  existingFiles?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadComplete, 
  maxFiles = 10,
  existingFiles = [] 
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(existingFiles);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Vérifier le nombre total de fichiers
    if (uploadedFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} photos allowed`);
      return;
    }

    setUploading(true);
    setError('');

    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validation de taille (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError(`${file.name} is too large (max 10MB)`);
          continue;
        }

        // Validation de type
        if (!file.type.startsWith('image/')) {
          setError(`${file.name} is not an image`);
          continue;
        }

        // Créer un nom de fichier unique
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload vers Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('legacy-photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          setError(`Failed to upload ${file.name}`);
          continue;
        }

        // Obtenir l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('legacy-photos')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      // Mettre à jour la liste des fichiers uploadés
      const updatedFiles = [...uploadedFiles, ...newUrls];
      setUploadedFiles(updatedFiles);
      onUploadComplete(updatedFiles);

    } catch (err) {
      console.error('Upload error:', err);
      setError('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (urlToRemove: string) => {
    const updatedFiles = uploadedFiles.filter(url => url !== urlToRemove);
    setUploadedFiles(updatedFiles);
    onUploadComplete(updatedFiles);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <label className="cursor-pointer bg-[#D4AF37] text-[#0A0A0A] px-6 py-3 rounded-md font-bold hover:bg-yellow-300 transition-colors inline-flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {uploading ? 'Uploading...' : 'Upload Photos'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading || uploadedFiles.length >= maxFiles}
            className="hidden"
          />
        </label>
        <span className="text-sm text-gray-400">
          {uploadedFiles.length} / {maxFiles} photos
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Preview Grid */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedFiles.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-md border border-[#D4AF37]/30"
              />
              <button
                onClick={() => handleRemoveFile(url)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-gray-500">
        Accepted formats: JPG, PNG, GIF, WEBP • Max size: 10MB per photo
      </p>
    </div>
  );
};

export default FileUpload;