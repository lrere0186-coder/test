import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: legacies, error: legaciesError } = await supabaseAdmin
      .from('legacies')
      .select(`
        id,
        slot_id,
        full_name,
        biography,
        quote,
        status,
        birth_date,
        death_date,
        created_at,
        slots (
          id,
          price,
          status
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (legaciesError) {
      console.error('Error fetching legacies:', legaciesError);
      return NextResponse.json(
        { error: 'Failed to fetch legacies' },
        { status: 500 }
      );
    }

    const legaciesWithPhotos = await Promise.all(
      (legacies || []).map(async (legacy) => {
        const { data: media } = await supabaseAdmin
          .from('media')
          .select('id, type, url, title, caption')
          .eq('legacy_id', legacy.id)
          .eq('type', 'photo')
          .order('sort_order');

        const { data: timelineEvents } = await supabaseAdmin
          .from('timeline_events')
          .select('id, event_date, event_text, sort_order')
          .eq('legacy_id', legacy.id)
          .order('sort_order');

        return {
          ...legacy,
          photos: media || [],
          timeline_events: timelineEvents || [],
        };
      })
    );

    const { data: payments } = await supabaseAdmin
      .from('payments')
      .select('amount, created_at')
      .eq('user_id', userId);

    const totalSpent = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalSlots = legacies?.length || 0;

    return NextResponse.json({
      success: true,
      legacies: legaciesWithPhotos,
      stats: {
        totalSlots,
        totalSpent: totalSpent / 100,
      },
    });
  } catch (error) {
    console.error('Error in user legacies API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}