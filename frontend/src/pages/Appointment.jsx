import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Appointment.css';
import { assets } from '../assets/assets';
import RelatedDoctors from './RelatedDoctors';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const doc = doctors.find(doc => doc._id === docId);
    if (doc) {
      setDocInfo(doc);
      console.log(doc);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment');
      return navigate('/login');
    }
    try {
      const day = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime: selectedTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(currentDate.getDate() + i);
      return date;
    });
    setWeekDates(dates);
  }, [currentDate]);

  // Generate time slots from 9:00 AM to 5:00 PM in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    let start = new Date();
    start.setHours(9, 0, 0, 0); // Start time: 9:00 AM

    let end = new Date();
    end.setHours(17, 0, 0, 0); // End time: 5:00 PM

    while (start < end) {
      const timeString = start.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Format selected date to match the structure of slotDate in docInfo.slots_booked
      const day = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      // Check if the slot is available by confirming it does not exist in the booked slots
      const isSlotAvailable =
        !(docInfo.slots_booked?.[slotDate]?.includes(timeString));

      if (isSlotAvailable) {
        slots.push(timeString);
      }

      start.setMinutes(start.getMinutes() + 30); // Increment by 30 minutes
    }
    return slots;
  };

  const timeslots = selectedDate ? generateTimeSlots() : [];

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  return (
    <div>
      {docInfo && (
        <div className="banner">
          <div className="banner-image">
            <img src={docInfo.image} alt="Doctor" />
          </div>
          <div className="banner-info">
            <h2>{docInfo.name}</h2>
            <p className="degree">{docInfo.degree}</p>
            <p className="degree">{docInfo.speciality}</p>
            <p className="about">{docInfo.about}</p>
            <p className="fee">Appointment Fee: {docInfo.fees}</p>
          </div>
        </div>
      )}

      <div className="booking-slot">
        <h2>Select a Booking Slot</h2>
        <div className="date-container">
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={`date-item ${selectedDate === date ? 'selected' : ''}`}
              onClick={() => handleDateClick(date)}
            >
              <p>{date.toDateString().split(' ')[0]}</p>
              <p>{date.getDate()}</p>
            </div>
          ))}
        </div>

        {selectedDate && (
          <div className="time-container">
            {timeslots.map((time, index) => (
              <div
                key={index}
                className={`time-item ${selectedTime === time ? 'selected' : ''}`}
                onClick={() => handleTimeClick(time)}
              >
                {time}
              </div>
            ))}
          </div>
        )}

        <button className="book-button" onClick={bookAppointment}>
          Book Appointment
        </button>
      </div>

      {docInfo && <RelatedDoctors docId={docId} speciality={docInfo.speciality} />}
    </div>
  );
};

export default Appointment;
