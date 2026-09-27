import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import BookingForm from "./components/BookingForm.jsx";
import BookingList from "./components/BookingList.jsx";
import "./App.css";

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingRefresh, setBookingRefresh] = useState(0);

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("match_date", { ascending: true });

    if (error) {
      console.error(error);
      alert("Error loading matches: " + error.message);
    } else {
      setMatches(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="app">
      <h1>🏏 IPL Match & Ticket Booking</h1>

      <p className="subtitle">
        Live match data from Supabase
      </p>

      <BookingForm
  matches={matches}
  onBookingAdded={() =>
    setBookingRefresh((value) => value + 1)
  }
/>

      <h2>📅 IPL Matches</h2>

      {loading ? (
        <p>Loading matches...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Team 1</th>
              <th>Team 2</th>
              <th>Venue</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {matches.map((match) => (
              <tr key={match.id}>
                <td>{match.id}</td>
                <td>{match.team1}</td>
                <td>{match.team2}</td>
                <td>{match.venue}</td>
                <td>{match.match_date}</td>
                <td>{match.match_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;