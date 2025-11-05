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

    // Remettre le slot en "available"
    const { data: updatedSlot, error: updateError } = await supabaseAdmin
      .from('slots')
      .update({
        status: 'available',
        reserved_until: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', slotId)
      .eq('status', 'reserved') // Seulement si réservé
      .select()
      .single();

    if (updateError) {
      console.error('Release error:', updateError);
      return NextResponse.json(
        { error: 'Failed to release slot', details: updateError.message },
        { status: 500 }
      );
    }

    if (!updatedSlot) {
      return NextResponse.json(
        { error: 'Slot was not reserved or does not exist' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Slot #${slotId} is now available again`
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}