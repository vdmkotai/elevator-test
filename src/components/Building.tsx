import React, { useState } from 'react'
import styled from 'styled-components'

import Elevator from './Elevator'
import { ElevatorType } from '../types'

interface BuildingProps {
  floors: number
  elevators: number
}

const BuildingContainer = styled.div`
  display: flex;
  flex-direction: column-reverse; // floor 0 is at the bottom
  gap: 10px;
  min-width: 700px;
`

const Floor = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid black;
  padding: 10px;
`

const Building: React.FC<BuildingProps> = ({ floors, elevators }) => {
  const [elevatorStates, setElevatorStates] = useState<Array<ElevatorType>>(
    new Array(elevators).fill(0).map((_, i) => ({
      id: i,
      currentFloor: 0,
      targetFloors: [],
      direction: 0,
    }))
  )

  const callElevator = (floor: number) => {
    setElevatorStates((prevElevatorStates) => {
      // First, find the closest idle elevator
      let minDistance = Infinity
      let minDistanceElevatorId: number | null = null

      for (const elevator of prevElevatorStates) {
        if (elevator.targetFloors.length === 0) {
          const distance = Math.abs(elevator.currentFloor - floor)
          if (distance < minDistance) {
            minDistance = distance
            minDistanceElevatorId = elevator.id
          }
        }
      }

      // If no idle elevators are found, find the closest elevator moving in the correct direction
      if (minDistanceElevatorId === null) {
        for (const elevator of prevElevatorStates) {
          const distance = Math.abs(elevator.currentFloor - floor)
          const correctDirection =
            (elevator.direction === 1 && elevator.currentFloor <= floor) ||
            (elevator.direction === -1 && elevator.currentFloor >= floor)
          if (correctDirection && distance < minDistance) {
            minDistance = distance
            minDistanceElevatorId = elevator.id
          }
        }
      }

      return prevElevatorStates.map((elevator) =>
        elevator.id === minDistanceElevatorId
          ? {
              ...elevator,
              targetFloors: [...elevator.targetFloors, floor].sort(
                (a, b) => a - b
              ),
            }
          : elevator
      )
    })
  }

  const onElevatorMove = (id: number, floor: number, direction: -1 | 0 | 1) => {
    setElevatorStates((prevElevatorStates) =>
      prevElevatorStates.map((elevator) =>
        elevator.id === id
          ? { ...elevator, currentFloor: floor, direction }
          : elevator
      )
    )
  }

  const onElevatorArrive = (id: number, floor: number) => {
    // Remove this floor from the elevator's target list.
    setElevatorStates((elevatorStates) =>
      elevatorStates.map((elevator) => {
        if (elevator.id === id) {
          const updatedTargetFloors = elevator.targetFloors.filter(
            (f) => f !== floor
          )
          let direction: -1 | 0 | 1 = 0
          if (updatedTargetFloors.length > 0) {
            direction = updatedTargetFloors[0] > floor ? 1 : -1
          }
          return {
            ...elevator,
            targetFloors: updatedTargetFloors,
            direction,
          }
        } else {
          return elevator
        }
      })
    )
  }

  return (
    <BuildingContainer>
      {new Array(floors).fill(0).map((_, i) => (
        <Floor key={i}>
          <button onClick={() => callElevator(i)}>
            Call elevator to floor {i}
          </button>
          {elevatorStates
            .filter((elevator) => elevator.currentFloor === i)
            .map((elevator) => (
              <Elevator
                key={elevator.id}
                id={elevator.id}
                currentFloor={elevator.currentFloor}
                targetFloors={elevator.targetFloors}
                direction={elevator.direction}
                onArrive={(floor) => onElevatorArrive(elevator.id, floor)}
                onMove={(id, floor, direction) =>
                  onElevatorMove(id, floor, direction)
                }
              />
            ))}
        </Floor>
      ))}
    </BuildingContainer>
  )
}

export default Building
