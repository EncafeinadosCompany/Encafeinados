interface BackCoverProps {
   goPrev: () => void; 
}

export const BackCover = ({goPrev}: BackCoverProps) => {
    return (
        <>
            {/* Coffee bean pattern overlay */}
            <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgMTBjLTMuNSAwLTYuNSAzLTYuNSA2LjVzMyA2LjUgNi41IDYuNSA2LjUtMyA2LjUtNi41UzIzLjUgMTAgMjAgMTB6bTAgMzBjLTMuNSAwLTYuNS0zLTYuNS02LjVzMy02LjUgNi41LTYuNSA2LjUgMyA2LjUgNi41UzIzLjUgNDAgMjAgNDB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')]"></div>

            {/* Spine details */}
            <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#BEA99B]/0 via-[#BEA99B]/20 to-[#BEA99B]/0"></div>

            {/* Content container */}
            <div className="flex flex-col items-center h-full justify-center p-6 text-center max-w-xs mx-auto relative z-10">
                {/* Subtle coffee farm illustration */}
                <div className="w-16 h-16 mb-6 opacity-30">
                    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                        <path d="M20 70h60M25 70V50l10-15h30l10 15v20M35 50h30M40 40v10M60 40v10" stroke="#D2C1B0" strokeWidth="1.5" />
                        <path d="M50 26v14m-7-7h14" stroke="#D2C1B0" strokeWidth="1" />
                        <path d="M15 70c1.5-10 3.5-15 7-20s9-7.5 20-10m43 30c-1.5-10-3.5-15-7-20s-9-7.5-20-10" stroke="#D2C1B0" strokeWidth="0.5" strokeDasharray="1 2" />
                    </svg>
                </div>

                {/* Thank you message */}
                <p className="text-[#D2C1B0] text-lg sm:text-xl font-light mb-6 leading-relaxed">
                    Gracias por acompañarnos en este recorrido por el mundo del café de especialidad
                </p>

                {/* Coffee process illustration */}
                <div className="flex space-x-6 mb-8 opacity-70">
                    <div className="w-14 h-14">
                        <svg viewBox="0 0 50 50" className="w-full h-full text-[#BEA99B]">
                            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2" />
                            <path d="M20 20c2.5 1.5 5 2 10 0m-10 10c2.5-1.5 5-2 10 0" stroke="currentColor" strokeWidth="1" />
                            <path d="M25 15v20" stroke="currentColor" strokeWidth="0.5" />
                        </svg>
                        <p className="text-[8px] text-[#BEA99B] mt-1 tracking-wider">CULTIVADO</p>
                    </div>
                    <div className="w-14 h-14">
                        <svg viewBox="0 0 50 50" className="w-full h-full text-[#BEA99B]">
                            <rect x="15" y="15" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
                            <path d="M20 20l10 10m0-10L20 30" stroke="currentColor" strokeWidth="1" />
                        </svg>
                        <p className="text-[8px] text-[#BEA99B] mt-1 tracking-wider">PROCESADO</p>
                    </div>
                    <div className="w-14 h-14">
                        <svg viewBox="0 0 50 50" className="w-full h-full text-[#BEA99B]">
                            <path d="M30 30c2.5-2.5 5-7.5 0-15s-10-5-10 0 2.5 10 0 15-10 5-5 0" stroke="currentColor" strokeWidth="1" fill="none" />
                        </svg>
                        <p className="text-[8px] text-[#BEA99B] mt-1 tracking-wider">SERVIDO</p>
                    </div>
                </div>

                {/* Signature line */}
                <div className="w-full max-w-[180px] h-px bg-[#BEA99B]/30 my-6"></div>

                {/* Company name */}
                <p className="font-serif text-[#BEA99B] text-2xl tracking-wide relative">
                    ENCAFEINADOS
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D2C1B0]/10"></span>
                </p>

                {/* Back button */}
                <button
                    onClick={goPrev}
                    className="mt-10 px-5 py-2 border border-[#BEA99B]/20 text-[#BEA99B] text-sm rounded-sm 
hover:bg-[#BEA99B]/10 transition-colors flex items-center"
                >
                    <svg className="mr-1.5 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Volver
                </button>

                {/* Footer text */}
                <p className="absolute bottom-4 text-[10px] text-[#BEA99B]/30 tracking-wider">HECHO CON PASIÓN</p>
            </div>

        </>
    )

}