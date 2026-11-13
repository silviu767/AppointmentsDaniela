export interface Service {
    service_id: number
    name: string
    description: string | null
    duration_minutes: number
    price: string 
    image_url: string | null 
}

export interface Photo {
    photo_id: number
    appointment_id: number | null
    kind: string
    image_url: string 
    created_at: string
}

export interface Review {
    review_id: number
    appointment_id: number
    rating: number
    comment: string | null
    status: string
    created_at: string
    photos: Photo[]
}
