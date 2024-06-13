import React from 'react'
import './Footer.css'
export default function Footer() {
  return (
    <div className='footer'>
      <div className='branches'>
        <h3 style={{margin: "10px"}}>OUR BRANCHES</h3>
        <div className='city'>
          <p className='city-name'>Bengaluru</p>
          <p className='address'>#951, 16th Main, BTM 2nd Stage, Bengaluru, Karnataka, 560076.
          </p>
        </div>
        
        <div className='city'>
          <p className='city-name'>Hyderabad</p>
          <p className='address'>
            Kothwal Madhava Reddy Plaza, Beside Indian Oil Petrol Bunk, JNTUH Metro Station, Nizampet X Roads, Hyderabad, 500072.</p>
        </div>
        <div className='city'>
          <p className='city-name'>Vijayawada</p>
          <p className='address'>40-5-19/16, Prasad Naidu Complex, P.B.Siddhartha Busstop,
            Moghalrajpuram, Vijayawada, Andhra Pradesh, 520010.</p>
        </div>
      </div>
      <p className='copyright'>© Copyright 2018-2024 | Codegnan IT Solutions PVT LTD</p>
    </div>
  )
}
