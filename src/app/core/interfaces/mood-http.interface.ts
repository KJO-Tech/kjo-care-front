export interface MoodStateRequest {
  name: string,
  description: string,
  image: string,
  color: string
}

export interface MoodStateResponse {
  id: string,
  name: string,
  description: string,
  image: string,
  color: string,
  isActive: boolean
}
