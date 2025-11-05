import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slotId } = body;

    if (!slotId) {
      return NextResponse.json(
        { error: 'Slot ID is required' },
        { status: 400 }
      );
    }

    // Vérifier que le slot existe et est disponible
    const { data: slot, error: fetchError } = await supabaseAdmin
      .from('slots')
      .select('*')
      .eq('id', slotId)
      .single();

    if (fetchError || !slot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }

    if (slot.status !== 'available') {
      return NextResponse.json(
        { error: 'Slot is not available', status: slot.status },
        { status: 400 }
      );
    }

    // Calculer la date d'expiration (1 heure)
    const reservedUntil = new Date();
    reservedUntil.setHours(reservedUntil.getHours() + 1);

    // Mettre à jour le slot en "reserved"
    const { data: updatedSlot, error: updateError } = await supabaseAdmin
      .from('slots')
      .update({
        status: 'reserved',
        reserved_until: reservedUntil.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', slotId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to reserve slot', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      slot: {
        id: updatedSlot.id,
        price: updatedSlot.price / 100,
        status: updatedSlot.status,
        reservedUntil: updatedSlot.reserved_until
      },
      message: `Slot #${slotId} reserved for 1 hour`
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}