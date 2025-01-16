import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [snakeCount, setSnakeCount] = useState('')
  const [snakes, setSnakes] = useState([])
  const [isRacing, setIsRacing] = useState(false)
  const [winners, setWinners] = useState([])
  const [winner, setWinner] = useState(null)
  const raceIntervalRef = useRef(null);
  const hasWinnerRef = useRef(false);


  const generateSnakes = (count) => {
    // Mảng các cặp màu gradient
    const colorPairs = [
      ['#FF9800', '#F44336'], // Cam - Đỏ
      ['#2196F3', '#673AB7'], // Xanh dương - Tím
      ['#4CAF50', '#8BC34A'], // Xanh lá đậm - Xanh lá nhạt
      ['#E91E63', '#FF4081'], // Hồng đậm - Hồng nhạt
      ['#9C27B0', '#BA68C8'], // Tím đậm - Tím nhạt
      ['#00BCD4', '#4DD0E1'], // Xanh ngọc đậm - Xanh ngọc nhạt
      ['#FFC107', '#FFEB3B'], // Cam vàng - Vàng
      ['#795548', '#A1887F'], // Nâu đậm - Nâu nhạt
      ['#607D8B', '#90A4AE'], // Xám xanh đậm - Xám xanh nhạt
      ['#FF5722', '#FF8A65']  // Cam đỏ - Cam hồng
    ];

    const newSnakes = Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: `${index + 1}`,
      position: 0,
      lane: (index * (70 / count)) + 15, // Tăng khoảng cách giữa các rắn
      color: colorPairs[index % colorPairs.length][0],
      secondaryColor: colorPairs[index % colorPairs.length][1],
      isMoving: false,
      currentSpeed: 1 + Math.random() * 0.8 // Tốc độ ban đầu từ 1-1.5
    }))
    setSnakes(newSnakes)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const count = parseInt(snakeCount)
    if (count > 0) {
      generateSnakes(count)
      setWinners([])
    }
  }

  const startRace = () => {
    setIsRacing(true)
    setWinners([])
    
    setSnakes(prevSnakes => prevSnakes.map(snake => ({
      ...snake,
      position: 0,
      isMoving: true,
      currentSpeed: 1 + Math.random() * 0.8
    })))

    raceIntervalRef.current = setInterval(() => {
      setSnakes(prevSnakes => {
        const newSnakes = prevSnakes.map(snake => {
          if (!snake.isMoving && !winners.includes(snake)) return snake;

          const speedChange = Math.random() * 1.4 - 0.4;
          var newSpeed = Math.max(0.3, Math.min(2, snake.currentSpeed + speedChange));
          var newPosition = snake.position + Math.random() * 0.8

          // Kiểm tra winner
          if (newPosition >= 71 && winners.length === 0) {
            setWinners([snake])
            
            // Dừng các snake khác
            prevSnakes.forEach(s => {
              if (s.id !== snake.id) {
                s.isMoving = false
                s.currentSpeed = 0
              }
            })

            // Winner tiếp tục chạy nhanh hơn
            return {
              ...snake,
              position: newPosition,
              isMoving: true,
              currentSpeed: newSpeed * 2  // Tăng tốc độ lên gấp đôi
            }
          }

          // Nếu là winner, tiếp tục chạy
          if (winners.length > 0 && winners[0].id === snake.id) {
            return {
              ...snake,
              position: Math.min(100, newPosition),
              currentSpeed: newSpeed * 2
            }
          }

          return {
            ...snake,
            position: Math.min(100, newPosition),
            currentSpeed: newSpeed
          }
        })

        // Chỉ dừng khi winner đến vạch đích
        const winnerSnake = newSnakes.find(s => winners[0]?.id === s.id)
        if (winnerSnake && winnerSnake.position >= 100) {
          clearInterval(raceIntervalRef.current)
        }

        return newSnakes
      })
    }, 50)  // Giảm interval xuống để mượt hơn
  }

  const handleReset = () => {
    // Clear interval khi reset
    if (raceIntervalRef.current) {
      clearInterval(raceIntervalRef.current)
      raceIntervalRef.current = null
    }
    
    setSnakes(prevSnakes => prevSnakes.map(snake => ({
      ...snake,
      position: 0,
      isMoving: false,
      currentSpeed: 0
    })))
    setIsRacing(false)
    setWinners([])
  }
  

 
  const handleShuffle = () => {
    if (raceIntervalRef.current) {
      clearInterval(raceIntervalRef.current)
    }
    
    setSnakes(prevSnakes => {
      // Log trạng thái ban đầu
      console.log('Before shuffle:', prevSnakes.map(s => s.id).join(','));
      
      // Tạo bản sao của mảng
      const shuffledSnakes = [...prevSnakes];
      
      // Shuffle mảng
      for (let i = shuffledSnakes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Hoán đổi các phần tử
        const temp = {...shuffledSnakes[i]};
        shuffledSnakes[i] = {...shuffledSnakes[j]};
        shuffledSnakes[j] = temp;
        
        // Cập nhật lane cho vị trí mới
        shuffledSnakes[i].lane = (i * (70 / shuffledSnakes.length)) + 15;
        shuffledSnakes[j].lane = (j * (70 / shuffledSnakes.length)) + 15;
      }
      
      // Reset các giá trị khác
      shuffledSnakes.forEach(snake => {
        snake.position = 0;
        snake.isMoving = false;
        snake.currentSpeed = 0;
      });
  
      // Log kết quả shuffle
      console.log('After shuffle:', shuffledSnakes.map(s => s.id).join(','));
      
      return shuffledSnakes;
    });
    
    setIsRacing(false);
    setWinners([]);
  }

  return (
    <div className="app">
      <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: '10px',
    margin: '10px 0'
  }}>
    <img 
      src="/assets/logo.png" 
      alt="Racing Logo" 
      style={{
        width: '150px',
        height: 'auto',
        objectFit: 'contain'
      }}
    />
    <h1 style={{fontSize: '24px', fontWeight: 'bold', color: '#000'}}>WATA Racing 🏁</h1>
  </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <form onSubmit={handleSubmit} className="snake-form">
    <input
      type="number"
      value={snakeCount}
      onChange={(e) => setSnakeCount(e.target.value)}
      placeholder="Enter number of snakes"
      min="1"
      max="99"
      disabled={isRacing}
      style={{
        fontSize: '24px',
        padding: '12px 20px',
        width: '200px',
        borderRadius: '8px',
        border: '2px solid #ccc',
        margin: '10px'
      }}
    />
    <button type="submit" disabled={isRacing}>Generate Snakes</button>
  </form>

  <button 
    type="button"
    onClick={handleReset}
    disabled={!isRacing}
    className="race-button"
    style={{
      margin: '10px'
    }}
  >
    Reset
  </button>

  <button 
    type="button"
    onClick={handleShuffle}
    disabled={isRacing}
    className="race-button"
  >
    Shuffle
  </button>
</div>
      
      <div className="race-track" style={{ backgroundImage: `url("/assets/tet-racing-track.svg")`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'}}>
        {snakes.map(snake => (
          <div 
            key={snake.id}
            className={`snake ${snake.isMoving ? 'crawling' : ''}`}
            style={{ 
              left: `${snake.position}%`,
              top: `${snake.lane}%`,
              animationPlayState: snake.isMoving ? 'running' : 'paused'
            }}
          >
            <div className="snake-body"
              style={{ 
                '--snake-color': snake.color,
                '--snake-secondary-color': snake.secondaryColor
              }}
            >
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`snake-segment segment-${i}`} />
              ))}
              <div className="snake-hat"></div>
              <span className="snake-number">{snake.name}</span>
              <div className="snake-head">
                <div className="snake-eyes left"></div>
                <div className="snake-eyes right"></div>
                <div className="snake-mouth"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {snakes.length > 0 && (
        <button 
          onClick={startRace}
          disabled={isRacing || winner}
          className="race-button"
        >
          {isRacing ? 'Race in progress...' : 'Start Race!'}
        </button>
      )}

      {winners.length > 0 && (
        <div className="winners">
          <h2>Winner: Snake {winners[0].name}! 🏆</h2>
        </div>
      )}

      {winner && (
        <div className="winner-announcement" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}>
          <h2>Winner: Snake {winner}! 🏆</h2>
        </div>
      )}
    </div>
  )
}

export default App
