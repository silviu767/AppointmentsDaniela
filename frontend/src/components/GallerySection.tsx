import type {Photo} from "../types"

interface Props {photos:Photo[]}
export default function GallerySection({photos}: Props) {
    return(
        <section id="galerie" className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="font-serif text-3xl mb-8  ">Galerie</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                    <img 
                    key={photo.photo_id}
                    src={`http://localhost:8000${photo.image_url}`}
                    alt="Lucrare Salon Daniela"
                    className="w-full h-64 object-cover rounded-2xl border border-[#E7E0D6]"
                    />

                ))}
            </div>
        </section>
    )
}