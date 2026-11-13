import type {Review} from  "../types"

interface Props {reviews: Review[]}

export default function ReviewSection({reviews}: Props) {
    return(
        <section id="recenzii" className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="font-serif text-3xl mb-8">Recenzii</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                    <div key={review.review_id} className="bg-white p-6 rounded-2xl border border-[#E7E0D6]">
                    <div className="text-[#B07267] text-lg tracking-widest mb-2">
                        {"★".repeat(review.rating)}
                    </div>
                    <p className="text-stone-700 text-sm italic mb-4">"{review.comment}"</p>
                        {review.photos.length > 0 && ( 
                            <div className="flex gap-2 mt-3">
                            {review.photos.map((photo) => (
                        <img
                        key={photo.photo_id}
                        src={`http://localhost:8000${photo.image_url}`}
                        alt="poza recenzie"
                        className="w-20 h-20 object-cover rounded-xl border border-[#E7E0D6]"
                        />
                         ))}
                    </div>
                        )}
                        </div>
                ))}
                </div>
                </section>
    )}
