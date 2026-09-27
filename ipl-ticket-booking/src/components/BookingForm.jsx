import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function BookingForm({ matches }) {
  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    match_id: "",
    seat_type: "",
    number_of_tickets: 1,
  });

  const prices = {
    General: 500,
    Premium: 1000,
    VIP: 2000,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const pricePerTicket = prices[form.seat_type] || 0;

  const totalPrice =
    Number(form.number_of_tickets) * pricePerTicket;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.customer_name ||
      !form.email ||
      !form.match_id ||
      !form.seat_type ||
      !form.number_of_tickets
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const { error } = await supabase
      .from("bookings")
      .insert([
        {
          customer_name: form.customer_name,
          email: form.email,
          phone: form.phone,
          match_id: Number(form.match_id),
          seat_type: form.seat_type,
          number_of_tickets: Number(form.number_of_tickets),
          price_per_ticket: pricePerTicket,
          total_price: totalPrice,
        },
      ]);

    if (error) {
      alert("Booking failed: " + error.message);
      return;
    }

    alert("Ticket booked successfully!");

    setForm({
      customer_name: "",
      email: "",
      phone: "",
      match_id: "",
      seat_type: "",
      number_of_tickets: 1,
    });
  };

  return (
    <div className="booking-form">
      <h2>🎟️ Book IPL Tickets</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="customer_name"
          placeholder="Customer Name"
          value={form.customer_name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />

        <select
          name="match_id"
          value={form.match_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Match</option>

          {matches.map((match) => (
            <option key={match.id} value={match.id}>
              {match.team1} vs {match.team2}
            </option>
          ))}
        </select>

        <select
          name="seat_type"
          value={form.seat_type}
          onChange={handleChange}
          required
        >
          <option value="">Select Seat Type</option>
          <option value="General">General - ₹500</option>
          <option value="Premium">Premium - ₹1000</option>
          <option value="VIP">VIP - ₹2000</option>
        </select>

        <input
          type="number"
          name="number_of_tickets"
          min="1"
          value={form.number_of_tickets}
          onChange={handleChange}
          required
        />

        <p>Price per ticket: ₹{pricePerTicket}</p>

        <p>
          <strong>Total Price: ₹{totalPrice}</strong>
        </p>

        <button type="submit">Book Ticket</button>
      </form>
    </div>
  );
}

export default BookingForm;