import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import {useState, useEffect} from "react"
import ServicesSection from "./components/ServicesSection"
import { getServices } from "./api/client"
import type {Service} from "./types"
import GallerySection from "./components/GallerySection"
import ReviewSection from "./components/ReviewSection"
import { getPhotos} from "./api/client"
import { getApprovedReviews } from "./api/client"
import type { Photo, Review } from "./types"
import Footer from "./components/Footer"

function App(){
  const [services, setServices] = useState<Service[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  useEffect(() => {
    getServices().then((data) => setServices(data))
    getPhotos().then((data) => setPhotos(data))
    getApprovedReviews().then((data) => setReviews(data))
  }, [])
    return (
      <div className = "min-h-screen bg-[#FAF8F5] text-[#1C1917]">
        <Navbar />
        <Hero />
        <ServicesSection services={services} />
        <GallerySection photos={photos} />
        <ReviewSection reviews={reviews} />
        <Footer />
      </div>
    )
}
export default App