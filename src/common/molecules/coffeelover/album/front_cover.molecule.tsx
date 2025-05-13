interface FrontCoverProps {
    data?: any;
    goNext: () => void;
}

export const FrontCover = ({ data, goNext }: FrontCoverProps) => {
    return (  
    <>
      
                            {/* Modern abstract pattern overlay */}
                            <div className="absolute inset-0 opacity-[0.03]"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23432818' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/svg%3E")`,
                                }}
                            ></div>

                            {/* Modern spine accent */}
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#8C7361]/0 via-[#8C7361]/30 to-[#8C7361]/0"></div>

                            {/* Content container with improved spacing */}
                            <div className="w-full h-full flex flex-col items-center justify-center px-8 py-12 relative z-10">
                                {/* Modern minimalist coffee illustration */}
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-8 transform hover:scale-105 transition-transform duration-500">
                                    <div className="absolute inset-0 bg-[#B2A090]/10 rounded-full transform -translate-y-2"></div>
                                    <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Cup base with subtle gradient */}
                                        <path
                                            d="M70 40H30c-3.3 0-6 2.7-6 6v10c0 13.8 11.2 25 25 25s25-11.2 25-25V46c0-3.3-2.7-6-6-6z"
                                            fill="url(#paint0_linear)"
                                            stroke="#7D5A50"
                                            strokeWidth="1.5"
                                        />
                                        <path d="M30 50h40" stroke="#7D5A50" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" />
                                        <path d="M38 40v-5c0-1.1.9-2 2-2h20c1.1 0 2 .9 2 2v5" stroke="#7D5A50" strokeWidth="1.5" />
                                        <path d="M75 50c3.9 0 7 3.1 7 7s-3.1 7-7 7" stroke="#7D5A50" strokeWidth="1.5" />

                                        {/* Steam lines with animation */}
                                        <path className="origin-bottom animate-[rise_3s_ease-in-out_infinite]" d="M43 25s-2-5 0-10" stroke="#7D5A50" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                                        <path className="origin-bottom animate-[rise_3.5s_ease-in-out_0.5s_infinite]" d="M50 25s-2-8 0-15" stroke="#7D5A50" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
                                        <path className="origin-bottom animate-[rise_2.5s_ease-in-out_1s_infinite]" d="M57 25s2-6 0-12" stroke="#7D5A50" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

                                        {/* Gradient definition */}
                                        <defs>
                                            <linearGradient id="paint0_linear" x1="49" y1="40" x2="49" y2="81" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#FDFBF8" />
                                                <stop offset="1" stopColor="#F0E9E2" />
                                            </linearGradient>
                                        </defs>
                                    </svg>

                                    {/* Subtle shadow effect */}
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#7D5A50]/10 rounded-full blur-sm"></div>
                                </div>

                                {/* Modern typography - Title with animated underline effect */}
                                <div className="group relative mb-2">
                                    <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#4A3728] tracking-wide relative z-10">
                                        {data?.albumTitle || 'Álbum de Café'}
                                    </h1>
                                    <div className="absolute -bottom-1 left-0 right-0 h-[3px] w-0 group-hover:w-full bg-gradient-to-r from-[#8C7361]/20 via-[#8C7361]/40 to-[#8C7361]/20 rounded-full transition-all duration-500 ease-in-out"></div>
                                </div>

                                {/* Subtitle with improved typography */}
                                <p className="text-[#7D5A50] text-sm sm:text-base font-light max-w-xs text-center leading-relaxed mt-2">
                                    Un recorrido por el mundo del café de especialidad
                                </p>

                                {/* Modern separator with animated coffee bean */}
                                <div className="flex items-center my-6 w-32 opacity-80 hover:opacity-100 transition-opacity duration-300">
                                    <div className="h-px bg-gradient-to-r from-transparent via-[#7D5A50]/40 to-transparent flex-grow"></div>
                                    <div className="relative mx-2 group">
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#7D5A50] transform rotate-0 group-hover:rotate-12 transition-transform duration-500">
                                            <path d="M12 22c-3 0-5.5-1.5-5.5-3.5 0-1 .6-2 1.6-2.6 1-.7 2.3-1.2 3.7-1.4h.4c-.3.3-.5.7-.5 1.1 0 .9.7 1.6 1.6 1.6s1.6-.7 1.6-1.6c0-.4-.1-.8-.4-1 1.6.2 3 .8 4 1.6.8.6 1.3 1.4 1.3 2.3 0 2-2.5 3.5-5.5 3.5zM12 4c3 0 5.5 1.5 5.5 3.5S15 11 12 11 6.5 9.5 6.5 7.5 9 4 12 4z" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <div className="h-px bg-gradient-to-r from-[#7D5A50]/40 via-[#7D5A50]/40 to-transparent flex-grow"></div>
                                </div>

                                {/* Modern explore button */}
                                <button
                                    onClick={goNext}
                                    className="mt-6 px-7 py-3 bg-[#8C7361]/10 text-[#4A3728] text-sm font-medium rounded-md
            hover:bg-[#8C7361]/15 transition-all duration-300 group flex items-center border-b border-[#7D5A50]/10
            hover:shadow-sm focus:outline-none focus:ring focus:ring-[#8C7361]/20"
                                    aria-label="Comenzar exploración"
                                >
                                    <span>Explorar</span>
                                    <svg
                                        className="ml-2 w-4 h-4 transition-all duration-500 transform group-hover:translate-x-1"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M9 6L15 12L9 18"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>

                                {/* Bottom decorative element - modern geometric pattern */}
                                <div className="absolute bottom-12 opacity-10 w-40 transform hover:scale-105 transition-transform duration-500">
                                    <svg viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                                        <path d="M40 15h40M20 7.5h80M20 22.5h80" stroke="#4A3728" strokeWidth="0.5" strokeDasharray="1 3" />
                                        <circle cx="40" cy="15" r="3" fill="none" stroke="#4A3728" strokeWidth="0.5" />
                                        <circle cx="80" cy="15" r="3" fill="none" stroke="#4A3728" strokeWidth="0.5" />
                                        <circle cx="60" cy="15" r="5" fill="none" stroke="#4A3728" strokeWidth="0.5" />
                                    </svg>
                                </div>

                                {/* Modern edition badge */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                    <div className="px-4 py-1.5 border-t border-b border-[#7D5A50]/5">
                                        <p className="text-[#7D5A50]/40 text-[10px] tracking-[0.2em]">PRIMERA EDICIÓN</p>
                                    </div>
                                </div>
                            </div>


                        </>
    )

}