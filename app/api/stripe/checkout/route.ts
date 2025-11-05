import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slotId, fullName, biography, quote, status, userId, photos, timelineEvents } = body;

    // Vérifier que userId est présent
    if (!userId) {
      return NextResponse.json(
        { error: 'User must be authenticated' },
        { status: 401 }
      );
    }


    // Validation
    if (!slotId || !fullName || !biography) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Récupérer les infos du slot
    const { data: slot, error: slotError } = await supabase
      .from('slots')
      .select('*')
      .eq('id', slotId)
      .single();

    if (slotError || !slot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }

    // Vérifier que le slot est réservé (pas vendu)
    if (slot.status !== 'reserved') {
      return NextResponse.json(
        { error: 'Slot is not reserved or already sold' },
        { status: 400 }
      );
    }

    // Créer une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Legacy Vault Slot #${String(slotId).padStart(5, '0')}`,
              description: `Permanent digital legacy slot for ${fullName}`,
              images: ['https://legacy-vault.com/og-image.png'], // Tu changeras ça plus tard
            },
            unit_amount: slot.price, // Prix en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/?success=true&slot=${slotId}`,
      cancel_url: `${request.headers.get('origin')}/?canceled=true`,
      metadata: {
        slotId: slotId.toString(),
        userId: userId,
        fullName,
        biography,
        quote: quote || '',
        status: status || 'Living',
        photos: JSON.stringify(photos || []),
        timelineEvents: JSON.stringify(timelineEvents || []),
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}