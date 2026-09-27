import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function BookingList({ refresh }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        customer_name,
        email,
        phone,
        seat_type,
        number_of_tickets,
        price_per_ticket,
        total_price,
        booking_status,
        created_at,
        matches (
          team1,
          team2,
          venue
        )
      `)
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      alert("Error loading bookings: " + error.message);
    } else {
      setBookings(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [refresh]);

  return (
    <div className="booking-list">
      <h2>🎟️ Booking List</h2>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Match</th>
              <th>Venue</th>
              <th>Seat</th>
              <th>Tickets</th>
              <th>Price</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.customer_name}</td>
                <td>{booking.email}</td>

                <td>
                  {booking.matches
                    ? `${booking.matches.team1} vs ${booking.matches.team2}`
                    : "N/A"}
                </td>

                <td>
                  {booking.matches?.venue || "N/A"}
                </td>

                <td>{booking.seat_type}</td>
                <td>{booking.number_of_tickets}</td>
                <td>₹{booking.price_per_ticket}</td>
                <td>₹{booking.total_price}</td>

                <td>{booking.booking_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BookingList;