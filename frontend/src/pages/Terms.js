import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Terms() {

  const [isChecked, setIsChecked] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const vehicle = location.state;

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (bottom) {
      setScrolled(true);
    }
  };

  const handleAgree = () => {
    navigate("/booking", { state: vehicle });
  };

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">Terms, Conditions & Insurance</h2>

      <div className="card p-4 shadow">

        <h5>Terms & Conditions</h5>
        <p>
          1. The vehicle must be returned on time.<br />
          2. Any damage caused will be charged.<br />
          3. Driver must carry valid license.<br />
          4. Fuel policy must be followed.<br />
          5. Follow all traffic rules strictly.<br />
        </p>

        <h5 className="mt-3">Vehicle Insurance (Read Completely)</h5>

        {/* SCROLL BOX */}
        <div
          style={{
            height: "150px",
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px"
          }}
          onScroll={handleScroll}
        >
          <p>
            This vehicle is covered under a comprehensive insurance policy.
            The insurance covers accidental damages, third-party liability,
            and partial theft.
          </p>

          <p>
            However, insurance does NOT cover:
            - Driving under alcohol/drugs
            - Negligence or rash driving
            - Unauthorized driver usage
          </p>

          <p>
            In case of accident:
            - Inform company immediately
            - File FIR if required
            - Do not leave vehicle unattended
          </p>

          <p>
            Customer may need to pay a deductible amount depending on damage.
            Please ensure you understand all policies before proceeding.
          </p>

          <p><b>Scroll to the bottom to enable agreement.</b></p>
        </div>

        {/* CHECKBOX */}
        <div className="form-check mt-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="agreeCheck"
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="agreeCheck">
            I have read the insurance and agree to Terms & Conditions
          </label>
        </div>

        {/* BUTTON */}
        <button
          className="btn btn-success mt-3"
          disabled={!isChecked}
          onClick={handleAgree}
        >
          I Agree
        </button>

      </div>

    </div>
  );
}

export default Terms;