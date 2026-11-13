import {Camera, Phone, MapPin} from "lucide-react"

export default function Footer() {
    return(
        <footer className="max-w-6xl mx-auto px-4 py-12 mt-8 border-t border-[#E7E0D6]">
            <div className="bg-[#F3EDE6] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                <div>
                    <h3 className="font-serif text-2xl mb-1">Contact</h3>
                    <p className="text-stone-600 text-sm flex items-center gap-1.5">
                        <MapPin size={16} className="text-[#B07267]"/>
                        Vă așteptăm în Nice, Côte d'Azur!
                    </p>
                </div>
                <a
                href="#programare"
                className="bg-[#2A3B32] text-white px-6 py-3 rounded-full text-sm font-medium hover:opacity-90">
                    Contactează-ne
                </a>
            </div>
            <div className="flex items-center justify-between text-stone-600 text-sm ">
                <span className="font-serif text-xl text-[#1C1917]"> Salon Daniela </span>
                <div className="flex items-center gap-4">
                    <a href="http://instagram.com" target="_blank"
                    className="hover:text-[#B07267]">
                        <Camera size={20} />
                    </a>
                    <a href="tel:+33600000000" className="hover:text-[#B07267]"><Phone size={20} />
                    </a>
                </div>
            </div>
        
        </footer>
    )
}