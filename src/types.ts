export type ElevatorType = {
  id: number;
  currentFloor: number;
  targetFloors: number[];
  direction: -1 | 0 | 1;  // -1 for down, 0 for idle, 1 for up
};
