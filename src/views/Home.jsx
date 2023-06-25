import React from 'react'
import Title from '../components/Title'

const Home = () => {
  return (
    <div>
        <Title title="LMS Home" />
        <div className='home-img-container'>
            <img className="home-img" alt="lms home" src="/images/home.jpg" />
        </div>
        
    </div>
  )
}

export default Home