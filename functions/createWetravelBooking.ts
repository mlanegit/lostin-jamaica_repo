import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookingData = await req.json();
    
    // Validate required fields
    if (!bookingData.name || !bookingData.email || !bookingData.package || 
        !bookingData.nights || !bookingData.occupancy || !bookingData.total_price) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const WETRAVEL_API_KEY = Deno.env.get('WETRAVEL_API_KEY');
    const WETRAVEL_TRIP_ID = Deno.env.get('WETRAVEL_TRIP_ID');

    if (!WETRAVEL_API_KEY || !WETRAVEL_TRIP_ID) {
      return Response.json({ error: 'WeTravel API not configured' }, { status: 500 });
    }

    // Create booking/lead in WeTravel
    const wetravelResponse = await fetch(`https://api.wetravel.com/v1/trips/${WETRAVEL_TRIP_ID}/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WETRAVEL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: {
          first_name: bookingData.name.split(' ')[0],
          last_name: bookingData.name.split(' ').slice(1).join(' ') || bookingData.name.split(' ')[0],
          email: bookingData.email,
          phone: bookingData.phone || '',
        },
        notes: `Package: ${bookingData.package_name}\nNights: ${bookingData.nights}\nOccupancy: ${bookingData.occupancy}\nGuests: ${bookingData.guests}`,
        amount: bookingData.total_price,
      }),
    });

    if (!wetravelResponse.ok) {
      const error = await wetravelResponse.text();
      console.error('WeTravel API Error:', error);
      return Response.json({ 
        error: 'Failed to create WeTravel booking',
        details: error 
      }, { status: 500 });
    }

    const wetravelBooking = await wetravelResponse.json();
    
    // Store booking in Base44
    const booking = await base44.asServiceRole.entities.Booking.create({
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone || '',
      package: bookingData.package,
      nights: bookingData.nights,
      occupancy: bookingData.occupancy,
      guests: bookingData.guests,
      price_per_person: bookingData.price_per_person,
      total_price: bookingData.total_price,
      wetravel_booking_id: wetravelBooking.id || wetravelBooking.booking_id,
      checkout_url: wetravelBooking.checkout_url || wetravelBooking.payment_url,
      payment_status: 'pending',
      status: 'pending',
    });

    return Response.json({
      success: true,
      booking_id: booking.id,
      checkout_url: wetravelBooking.checkout_url || wetravelBooking.payment_url,
      wetravel_booking_id: wetravelBooking.id || wetravelBooking.booking_id,
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
});