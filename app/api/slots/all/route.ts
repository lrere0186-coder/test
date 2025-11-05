import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Récupérer TOUS les slots avec une limite explicite
    const { data: slots, error } = await supabase
      .from('slots')
      .select('*')
      .order('id', { ascending: true })
      .limit(10000); // Augmenter la limite

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      );
    }

    // Reste du code inchangé...
    const formattedSlots = slots?.map(slot => ({
      id: slot.id,
      price: slot.price / 100,
      status: slot.status,
      reservedUntil: slot.reserved_until ? new Date(slot.reserved_until) : undefined
    })) || [];

    const stats = {
      total: formattedSlots.length,
      available: formattedSlots.filter(s => s.status === 'available').length,
      reserved: formattedSlots.filter(s => s.status === 'reserved').length,
      sold: formattedSlots.filter(s => s.status === 'sold').length,
      locked: formattedSlots.filter(s => s.status === 'locked').length,
    };

    return NextResponse.json({
      success: true,
      count: formattedSlots.length,
      stats: stats,
      slots: formattedSlots
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}