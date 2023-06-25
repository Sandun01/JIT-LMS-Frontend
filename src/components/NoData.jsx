import React from 'react'

const NoData = () => {
  return (
    <div className='no-data-img-container'>
        <h4 className="no-data-title">No Data Found!</h4>
        <img className="no-data-img" alt="no data" src="/images/noData.jpg" />
    </div>
  )
}

export default NoData