export interface MoodStateRequest {
  name: string,
  description: string,
  value: number,
  image: string,
  color: string
}

export interface MoodStateResponse {
  id: string,
  name: string,
  description: string,
  image: string,
  color: string,
  value: number,
  isActive: boolean
}
