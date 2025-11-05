import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    // 1. DÉBLOCAGE AUTOMATIQUE : S'assurer qu'il y a toujours 200 slots available
    const { count: availableCount } = await supabaseAdmin
      .from('slots')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available');

    const currentAvailable = availableCount || 0;
    const targetAvailable = 200;

    if (currentAvailable < targetAvailable) {
      const slotsToUnlock = targetAvailable - currentAvailable;

      const { data: lockedSlots } = await supabaseAdmin
        .from('slots')
        .select('id')
        .eq('status', 'locked')
        .order('id', { ascending: true })
        .limit(slotsToUnlock);

      if (lockedSlots && lockedSlots.length > 0) {
        const idsToUnlock = lockedSlots.map(slot => slot.id);

        await supabaseAdmin
          .from('slots')
          .update({ status: 'available' })
          .in('id', idsToUnlock);

        console.log(`✅ Unlocked ${idsToUnlock.length} slots`);
      }
    }

    // 2. RÉCUPÉRER LES SLOTS DISPONIBLES
    const { data: slots, error } = await supabaseAdmin
      .from('slots')
      .select('*')
      .eq('status', 'available')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching slots:', error);
      return NextResponse.json(
        { error: 'Failed to fetch slots' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      slots: slots || [],
    });
  } catch (error) {
    console.error('Error in slots API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}