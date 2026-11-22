import { Link } from 'react-router-dom';
import { BOOKING_CUTOFF_DAYS } from '../rules/bookingCutoff.js';
import { MAX_TRAVELLERS_PER_BOOKING } from '../rules/travellerLimit.js';
import { DOORSTEP_PICKUP_FEE } from '../rules/pricing.js';
import { formatPKR } from '../utils/format.js';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <p className="site-footer__brand">Shimal Trails</p>
          <p>Small-group trips to the north, leaving from Islamabad and Rawalpindi.</p>
          <p className="simulated-note">
            Student project (CS4032). Bookings on this site are simulated: no payment is taken and no booking is sent.
          </p>
        </div>
        <div>
          <h2 className="site-footer__heading">Booking rules</h2>
          <ul>
            <li>1 to {MAX_TRAVELLERS_PER_BOOKING} travellers per booking, up to the seats left</li>
            <li>Online booking closes {BOOKING_CUTOFF_DAYS} days before departure</li>
            <li>Youngest traveller must meet each trip&apos;s age limit</li>
            <li>Meeting-point pickup is free; doorstep pickup is {formatPKR(DOORSTEP_PICKUP_FEE)} per trip</li>
          </ul>
        </div>
        <div>
          <h2 className="site-footer__heading">For testers</h2>
          <ul>
            <li>
              <Link to="/demo">Demo settings (loading failure, sold-out seats, date shift)</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
