import type { Service } from "../types"

interface Props{
    services: Service[]
}

export default function ServicesSection({services}: Props){
    return(
        <section id="servicii" className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="font-serif text-3xl mb-8">
                Serviciile noastre
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div key={service.service_id} className="bg-white p-6 rounded-2xl border border-[#E7E0D6] flex flex-col justify-between">
                        <div>
                            <h3 className="font-serif text-xl">{service.name}</h3>
                            <p className="text-sm text-stone-500 mt-1">{service.description}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-[#F3EDE6] flex items-center justify-between">
                            <span className="text-xs text-stone-500">{service.duration_minutes} min</span>
                            <span className="font-semibold text-[#B07267]">{service.price} €</span>
                        </div>
                        </div>
                ))}
            </div>
        </section>
    )
}