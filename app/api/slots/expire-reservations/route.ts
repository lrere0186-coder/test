import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const now = new Date().toISOString();

    // Récupérer tous les slots réservés dont la date d'expiration est passée
    const { data: expiredSlots, error: fetchError } = await supabaseAdmin
      .from('slots')
      .select('*')
      .eq('status', 'reserved')
      .lt('reserved_until', now); // reserved_until < now

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch expired slots', details: fetchError.message },
        { status: 500 }
      );
    }

    if (!expiredSlots || expiredSlots.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No expired reservations found',
        expiredCount: 0
      });
    }

    // Extraire les IDs des slots expirés
    const expiredSlotIds = expiredSlots.map(slot => slot.id);

    // Remettre ces slots en "available"
    const { data: updatedSlots, error: updateError } = await supabaseAdmin
      .from('slots')
      .update({
        status: 'available',
        reserved_until: null,
        updated_at: new Date().toISOString()
      })
      .in('id', expiredSlotIds)
      .select();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update expired slots', details: updateError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Expired ${expiredSlotIds.length} slot(s):`, expiredSlotIds);

    return NextResponse.json({
      success: true,
      message: `Successfully expired ${expiredSlotIds.length} reservation(s)`,
      expiredCount: expiredSlotIds.length,
      expiredSlotIds: expiredSlotIds
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}