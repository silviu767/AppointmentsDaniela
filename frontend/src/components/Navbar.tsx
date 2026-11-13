import { useState } from "react";
import {Menu, X} from "lucide-react"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return(
        <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#E7E0D6]">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <a href="#" className="font-serif text-2xl text-[#1C1917] tracking-wide">
                    Salon Daniela
                </a>
                {/*Meniu vizibil pe Desktop (ascuns pe telefon cu 'hidden md:flex) */}
                <nav className = "hidden md:flex items-center gap-8 text0sm text-[#1C1917]">
                    <a href="#servicii" className = "hover:text-[#B07267]">Servicii</a>
                    <a href="#galerie" className = "hover:text-[#B07267]">Galerie</a>
                    <a href="#recenzii" className = "hover:text-[#B07267]">Recenzii</a>
                    <a href="#programare" className = "bg-[#B07267] text-white px-5 py-2 rounded-full font-medium hover:opacity-90">
                        Programeaza-te
                    </a>
                </nav>
                {/* Button Burger = visibil doar pe telefon ('md:hidden) */}
                <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-[#1C1917]"> {isOpen ? < X size ={24} /> :< Menu size={24} />}</button>
            </div>
            {isOpen && (
            <div className="md:hidden bg-[#faf8f5] border-b border-[#E7E0D6] px-4 py-4 flex flex-col gap-3 text-sm text-[#1C1917]">
                <a href="#servicii" onClick={() => setIsOpen(false)} className="py-1">Servicii</a>
                <a href="#galerie" onClick={() => setIsOpen(false)} className="py-1">Galerie</a>
                <a href="#recenzii" onClick={() => setIsOpen(false)} className="py-1">Recenzii</a>
                <a href="#programare" onClick={() => setIsOpen(false)} className="bg-[#B07267] text-white text-center py-2.5 rounded-full font-medium mt-1">Programeaza-te</a>
                
            </div>
            )}
        </header>
    )
}