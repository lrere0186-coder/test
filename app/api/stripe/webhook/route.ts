import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

// IMPORTANT: Désactiver le body parser de Next.js pour les webhooks
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature found' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Gérer l'événement
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log('✅ Payment successful for session:', session.id);

    // Récupérer les métadonnées
    const { slotId, userId, fullName, biography, quote, status, photos: photosString, timelineEvents: timelineEventsString } = session.metadata || {};

    // Parser les photos et timeline events (elles sont en JSON string)
    const photos = photosString ? JSON.parse(photosString) : [];
    const timelineEvents = timelineEventsString ? JSON.parse(timelineEventsString) : [];

    if (!userId) {
      console.error('No userId in metadata');
      return NextResponse.json({ error: 'No userId' }, { status: 400 });
    }

    if (!slotId) {
      console.error('No slotId in metadata');
      return NextResponse.json({ error: 'No slotId' }, { status: 400 });
    }

    try {
      // 1. Mettre à jour le slot en "sold"
      const { error: slotError } = await supabaseAdmin
        .from('slots')
        .update({
          status: 'sold',
          reserved_until: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', parseInt(slotId));

      if (slotError) {
        console.error('Error updating slot:', slotError);
        throw slotError;
      }

        // 2. Créer l'entrée dans la table legacies
      const { data: legacy, error: legacyError } = await supabaseAdmin
        .from('legacies')
        .insert({
          slot_id: parseInt(slotId),
          user_id: userId,
          full_name: fullName,
          biography: biography,
          quote: quote,
          status: status,
          is_public: true,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (legacyError) {
        console.error('Error creating legacy:', legacyError);
        throw legacyError;
      }


      // 2b. Sauvegarder les photos dans la table media
      if (photos.length > 0 && legacy) {
        const mediaRecords = photos.map((photoUrl: string, index: number) => ({
          legacy_id: legacy.id,
          type: 'photo',
          url: photoUrl,
          mime_type: 'image/jpeg', // On peut améliorer ça plus tard
          sort_order: index,
          created_at: new Date().toISOString(),
        }));

        const { error: mediaError } = await supabaseAdmin
          .from('media')
          .insert(mediaRecords);

        if (mediaError) {
          console.error('Error saving media:', mediaError);
          // Ne pas throw ici - la legacy est créée, c'est l'essentiel
        } else {
          console.log(`✅ Saved ${photos.length} photo(s) for legacy ${legacy.id}`);
        }
      }

      // 2c. Sauvegarder les timeline events
      if (timelineEvents.length > 0 && legacy) {
        // Filtrer les events vides (ceux qui n'ont ni date ni texte)
        const validEvents = timelineEvents.filter(
          (event: { date: string; text: string }) => event.date || event.text
        );

        if (validEvents.length > 0) {
          const timelineRecords = validEvents.map((event: { date: string; text: string }, index: number) => ({
            legacy_id: legacy.id,
            event_date: event.date,
            event_text: event.text,
            sort_order: index,
            created_at: new Date().toISOString(),
          }));

          const { error: timelineError } = await supabaseAdmin
            .from('timeline_events')
            .insert(timelineRecords);

          if (timelineError) {
            console.error('Error saving timeline events:', timelineError);
            // Ne pas throw ici - la legacy est créée, c'est l'essentiel
          } else {
            console.log(`✅ Saved ${validEvents.length} timeline event(s) for legacy ${legacy.id}`);
          }
        }
      }

      // 3. Enregistrer le paiement
      const { error: paymentError } = await supabaseAdmin
        .from('payments')
        .insert({
          slot_id: parseInt(slotId),
          user_id: userId,
          amount: session.amount_total,
          currency: session.currency,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent as string,
          status: 'succeeded',
          created_at: new Date().toISOString(),
        });

      if (paymentError) {
        console.error('Error recording payment:', paymentError);
      }

      console.log(`✅ Slot #${slotId} successfully sold to ${fullName}`);

      return NextResponse.json({
        success: true,
        message: 'Payment processed successfully',
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      return NextResponse.json(
        { error: 'Failed to process payment' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}