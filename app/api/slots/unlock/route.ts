import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST() {
  try {
    // 1. Compter combien de slots sont actuellement available
    const { count: availableCount } = await supabaseAdmin
      .from('slots')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available');

    const currentAvailable = availableCount || 0;
    const targetAvailable = 200; // On veut toujours 200 slots disponibles

    // 2. Si on a moins de 200 available, débloquer des slots locked
    if (currentAvailable < targetAvailable) {
      const slotsToUnlock = targetAvailable - currentAvailable;

      // Trouver les X premiers slots locked et les débloquer
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

        console.log(`✅ Unlocked ${idsToUnlock.length} slots: ${idsToUnlock[0]} to ${idsToUnlock[idsToUnlock.length - 1]}`);
      }
    }

    // 3. Retourner le statut
    const { count: newAvailableCount } = await supabaseAdmin
      .from('slots')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available');

    return NextResponse.json({
      success: true,
      availableSlots: newAvailableCount,
      unlockedCount: (newAvailableCount || 0) - currentAvailable,
    });
  } catch (error) {
    console.error('Error unlocking slots:', error);
    return NextResponse.json(
      { error: 'Failed to unlock slots' },
      { status: 500 }
    );
  }
}