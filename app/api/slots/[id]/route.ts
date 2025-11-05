import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slotId = parseInt(params.id);

    // Vérifier que l'ID est valide
    if (isNaN(slotId) || slotId < 1 || slotId > 10000) {
      return NextResponse.json(
        { error: 'Invalid slot ID. Must be between 1 and 10000' },
        { status: 400 }
      );
    }

    // Récupérer le slot depuis la DB
    const { data: slot, error } = await supabase
      .from('slots')
      .select('*')
      .eq('id', slotId)
      .single();

    if (error || !slot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }

    // Transformer les données
    const formattedSlot = {
      id: slot.id,
      price: slot.price / 100, // Convertir centimes → euros
      status: slot.status,
      reservedUntil: slot.reserved_until ? new Date(slot.reserved_until) : null,
      ownerId: slot.owner_id,
      createdAt: slot.created_at,
      updatedAt: slot.updated_at
    };

    // Si le slot a un owner, récupérer aussi les infos de la legacy
    let legacy = null;
    if (slot.owner_id) {
      const { data: legacyData } = await supabase
        .from('legacies')
        .select('*')
        .eq('slot_id', slotId)
        .single();
      
      if (legacyData) {
        legacy = {
          id: legacyData.id,
          fullName: legacyData.full_name,
          quote: legacyData.quote,
          biography: legacyData.biography,
          profileImage: legacyData.profile_image_url,
          birthDate: legacyData.birth_date,
          deathDate: legacyData.death_date,
          isPublic: legacyData.is_public,
          arweaveHash: legacyData.arweave_hash,
          ipfsHash: legacyData.ipfs_hash,
          blockchainTx: legacyData.blockchain_tx
        };
      }
    }

    return NextResponse.json({
      success: true,
      slot: formattedSlot,
      legacy: legacy
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}