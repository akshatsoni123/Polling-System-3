import './KickedOut.css'

function KickedOut() {
  return (
    <div className="kicked-out">
      <div className="logo-container">
        <div className="logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">Intervue Poll</span>
        </div>
      </div>

      <div className="content">
        <h1 className="main-title">You've been Kicked out !</h1>
        <p className="description">
          Looks like the teacher had removed you from the poll system .Please<br />
          Try again sometime.
        </p>
      </div>
    </div>
  )
}

export default KickedOut