export default function Hero() {
    return(
        <section className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
                <span className="text-xs uppercase tracking-widest text-[#B07267] font-semibold">
                    Nice Côte d'Azur 
                    </span>
                    <h1 className="font-serif text-4xl md:text-6xl leading-tight mt-3 mb-4">
                        Frumusețea în mâinile tale
                    </h1>
                    <p className="text-stone-600 text-base md:text-lg mb-8">
                        Manichiură profesională și îngrijire delicată în inima Nisei.
                    </p>
                    <a href="#programare" className="inline-block bg-[#B07267] text-white px-7 py-3.5 rounded-full font-medium hover:opacity-90">
                        Programeaza-te
                    </a>
            </div>
            <div className="bg-[#F3EDE6] rounded-3xl p-8 md:p-12 border border-[#E7E0D6] text-center">
                <p className="font-serif text-2xl italic text-stone-700">
                    Eleganța începe cu detalii îngrijite la perfecție.
                </p>
            </div>
        </section>
    )}