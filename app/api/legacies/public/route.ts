import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const legacyId = searchParams.get('legacyId');

    // Si on demande une legacy spécifique
    if (legacyId) {
      const { data: legacy, error: legacyError } = await supabaseAdmin
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
        .eq('id', legacyId)
        .eq('is_public', true)
        .single();

      if (legacyError || !legacy) {
        return NextResponse.json(
          { error: 'Legacy not found' },
          { status: 404 }
        );
      }

      // Récupérer les photos
      const { data: media } = await supabaseAdmin
        .from('media')
        .select('id, type, url, title, caption, sort_order')
        .eq('legacy_id', legacy.id)
        .eq('type', 'photo')
        .order('sort_order');

      // Récupérer les timeline events
      const { data: timelineEvents } = await supabaseAdmin
        .from('timeline_events')
        .select('id, event_date, event_text, sort_order')
        .eq('legacy_id', legacy.id)
        .order('sort_order');

      return NextResponse.json({
        success: true,
        legacy: {
          ...legacy,
          photos: media || [],
          timeline_events: timelineEvents || [],
        },
      });
    }

    // Sinon, récupérer toutes les legacies publiques
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
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (legaciesError) {
      console.error('Error fetching legacies:', legaciesError);
      return NextResponse.json(
        { error: 'Failed to fetch legacies' },
        { status: 500 }
      );
    }

    // Pour chaque legacy, récupérer ses photos
    const legaciesWithPhotos = await Promise.all(
      (legacies || []).map(async (legacy) => {
        const { data: media } = await supabaseAdmin
          .from('media')
          .select('id, type, url, title, caption')
          .eq('legacy_id', legacy.id)
          .eq('type', 'photo')
          .order('sort_order')
          .limit(1); // Juste la première photo pour la vue d'ensemble

        return {
          ...legacy,
          coverPhoto: media && media.length > 0 ? media[0].url : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      legacies: legaciesWithPhotos,
    });
  } catch (error) {
    console.error('Error in public legacies API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}