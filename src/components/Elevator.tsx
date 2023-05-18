import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

interface ElevatorProps {
  id: number
  currentFloor: number
  targetFloors: number[]
  direction: -1 | 0 | 1
  onArrive: (floor: number) => void
  onMove: (id: number, floor: number, direction: -1 | 0 | 1) => void
}

const ElevatorContainer = styled.div`
  padding: 0 10px;
  border: 1px solid black;
  margin: 10px;
  position: relative;
  height: calc(100% - 20px);
`

const Elevator: React.FC<ElevatorProps> = ({
  id,
  currentFloor,
  targetFloors,
  onArrive,
  onMove,
}) => {
  const [floor, setFloor] = useState(currentFloor)

  useEffect(() => {
    if (targetFloors.length > 0) {
      const nextFloor = targetFloors[0]
      if (floor !== nextFloor) {
        const intervalId = setInterval(() => {
          setFloor((prevFloor) => {
            const newFloor =
              prevFloor < nextFloor ? prevFloor + 1 : prevFloor - 1
            const newDirection = newFloor < nextFloor ? 1 : -1
            onMove(id, newFloor, newDirection)
            return newFloor
          })
        }, 500)
        return () => clearInterval(intervalId)
      } else {
        onArrive(nextFloor)
      }
    }
  }, [floor, onArrive, targetFloors, onMove, id])

  return (
    <ElevatorContainer>
      Elevator {id} is on floor {floor}
    </ElevatorContainer>
  )
}

export default Elevator
