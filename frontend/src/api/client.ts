import type { Service, Photo, Review } from "../types"

export const API_BASE_URL = "http://localhost:8000/api"
  
export async function getServices(): Promise<Service[]> {
    const response = await fetch(`${API_BASE_URL}/services`)
    if (!response.ok) {
        throw new Error("Nu am putut incarca serviciile")
    }
    return response.json()
}
    
export async function getPhotos(): Promise<Photo[]> {
    const response = await fetch(`${API_BASE_URL}/photos`)
    if (!response.ok) {
        throw new Error("Nu am putut incarca inca pozele")
    }
    return response.json()
}

export async function getApprovedReviews(): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/reviews`)
    if (!response.ok){
        throw new Error("Nu am putut incarcainca recenziile")
    }
    return response.json()
    
}
