import React from 'react'
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './redux/slides/counterSlide'

 function App() {
  const count = useSelector(state => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <Button type="primary">Primary Button</Button>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}

export default App