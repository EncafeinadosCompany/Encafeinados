import React, { useId } from "react";
import SafeNumericDisplay from "./safe_numeric_display.atom";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  progress?: number;
}

const LoadingSpinner = ({
  message,
  className,
  size = "lg",
  progress,
}: LoadingSpinnerProps) => {
  const cn = (base: string, additionalClass?: string): string => {
    return [base, additionalClass].filter(Boolean).join(" ");
  };

  const uniqueId = useId();
  const loadingGradientId = `loadingGradient-${uniqueId}`;
  const accentGradientId = `accentGradient-${uniqueId}`;
  const highlightGradientId = `highlightGradient-${uniqueId}`;

  const sizeMap = {
    sm: { height: 40, width: 40, textSize: "text-xs", msgMargin: "mt-1" },
    md: { height: 80, width: 80, textSize: "text-sm", msgMargin: "mt-2" },
    lg: { height: 120, width: 120, textSize: "text-base", msgMargin: "mt-3" },
  };

  const { height, width, textSize, msgMargin } = sizeMap[size];

  const [loadingProgress, setLoadingProgress] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    if (progress !== undefined) {
      setLoadingProgress(progress);
      setIsComplete(progress >= 100);
      return;
    }
    const totalLoadTime = 3000;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const calculatedProgress = Math.min(
        100,
        (elapsedTime / totalLoadTime) * 100
      );

      setLoadingProgress(calculatedProgress);

      if (calculatedProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setIsComplete(true);
      }
    };

    requestAnimationFrame(updateProgress);

    return () => {
      setIsComplete(false);
    };
  }, [progress]);

  const primaryColor = "#8B4513";
  const accentColor = "#C87137";
  const highlightColor = "#D2B48C";
  const emptyColor = "#F5E6D3"; 
  return (
    <div
      className={cn("flex flex-col items-center justify-center", className)}
      role="status"
    >
      <div className="relative" style={{ width, height }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.0"
          width="100%"
          height="100%"
          viewBox="0 0 864.000000 864.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient
              id={loadingGradientId}
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: primaryColor, stopOpacity: 1 }}
              />
              <stop
                offset={`${loadingProgress}%`}
                style={{ stopColor: primaryColor, stopOpacity: 1 }}
              />
              <stop
                offset={`${loadingProgress + 0.1}%`}
                style={{ stopColor: emptyColor, stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: emptyColor, stopOpacity: 1 }}
              />
            </linearGradient>

            <linearGradient
              id={accentGradientId}
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: accentColor, stopOpacity: 1 }}
              />
              <stop
                offset={`${loadingProgress}%`}
                style={{ stopColor: accentColor, stopOpacity: 1 }}
              />
              <stop
                offset={`${loadingProgress + 0.1}%`}
                style={{ stopColor: emptyColor, stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: emptyColor, stopOpacity: 1 }}
              />
            </linearGradient>

            <linearGradient
              id={highlightGradientId}
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: highlightColor, stopOpacity: 1 }}
              />
              <stop
                offset={`${loadingProgress}%`}
                style={{ stopColor: highlightColor, stopOpacity: 1 }}
              />
              <stop
                offset={`${loadingProgress + 0.1}%`}
                style={{ stopColor: emptyColor, stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: emptyColor, stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>

          <g
            transform="translate(0.000000,864.000000) scale(0.100000,-0.100000)"
            fill={`url(#${loadingGradientId})`}
          >
            <path d="M5348 6979 c-3 -8 6 -34 19 -59 21 -38 24 -56 21 -114 -4 -64 -6 -70 -40 -102 -56 -51 -96 -57 -328 -53 -464 9 -587 0 -734 -53 -102 -36 -313 -146 -382 -199 -36 -27 -70 -47 -75 -44 -11 7 -213 -44 -314 -78 -135 -47 -504 -219 -631 -295 -65 -38 -144 -82 -214 -118 -113 -58 -247 -153 -307 -217 -78 -83 -102 -145 -111 -282 -6 -82 -10 -99 -22 -96 -8 3 -73 7 -143 9 -335 11 -581 -95 -702 -302 -107 -182 -78 -443 67 -601 67 -73 150 -125 314 -196 35 -15 42 -23 49 -55 20 -107 99 -174 204 -174 82 1 171 58 201 129 11 28 16 31 59 31 64 0 227 26 277 44 42 14 64 8 64 -19 0 -6 -51 -31 -112 -54 -449 -172 -603 -252 -668 -346 -82 -120 -119 -398 -87 -668 1 -13 -16 -27 -63 -50 -60 -30 -65 -35 -68 -68 -4 -47 44 -220 65 -237 9 -6 27 -12 40 -12 26 0 25 10 27 -295 1 -145 3 -164 23 -202 40 -74 122 -111 222 -99 52 6 55 5 96 -33 71 -65 157 -76 233 -29 17 11 39 29 47 41 11 16 24 20 58 19 56 -3 94 11 135 51 33 32 57 93 46 120 -4 11 3 17 26 22 37 8 86 47 106 86 51 99 32 259 -39 337 -19 20 -21 33 -18 92 8 175 -116 269 -282 212 -40 -13 -60 -16 -62 -8 -2 6 -17 57 -34 113 -22 72 -36 103 -49 106 -9 2 -46 -7 -81 -20 -36 -13 -68 -20 -72 -16 -4 5 -5 72 -2 150 l6 142 59 41 c123 87 436 217 604 251 l61 12 104 -104 c123 -123 234 -209 343 -264 l79 -40 213 -3 c183 -3 215 -6 227 -20 27 -32 144 -227 239 -397 52 -93 105 -186 116 -205 12 -19 22 -40 22 -46 0 -12 -85 -39 -320 -103 -307 -84 -456 -147 -483 -203 -19 -42 -41 -151 -67 -343 -11 -82 -28 -199 -37 -260 -11 -69 -17 -175 -17 -285 -1 -162 1 -180 24 -244 14 -39 41 -87 62 -111 63 -72 72 -73 418 -71 265 2 312 5 360 21 90 30 92 35 98 178 6 158 -8 244 -53 317 -39 64 -95 120 -145 146 -44 22 -131 22 -183 0 -29 -13 -38 -14 -42 -4 -20 59 -27 124 -30 274 l-4 175 43 18 c129 56 497 161 563 161 29 0 37 -9 123 -142 50 -79 131 -204 180 -278 49 -74 162 -252 252 -395 90 -143 190 -295 223 -339 33 -43 74 -102 90 -132 64 -112 123 -148 245 -147 85 1 123 13 163 51 43 41 63 87 112 258 64 225 82 260 214 398 128 136 161 180 201 275 53 123 80 260 81 396 0 197 -40 281 -171 351 -27 14 -57 18 -125 19 -80 0 -96 -3 -145 -29 -30 -16 -84 -58 -120 -95 -111 -113 -135 -157 -255 -465 -33 -83 -45 -103 -78 -127 -82 -59 -169 -45 -258 44 -57 57 -343 482 -334 496 3 6 10 11 16 11 23 0 196 93 218 117 36 42 26 138 -29 268 -55 130 -142 303 -219 435 -33 58 -61 108 -61 112 0 3 30 13 68 22 84 19 202 55 312 94 192 69 591 256 632 297 13 12 58 94 101 182 43 87 81 165 86 173 14 27 144 111 266 171 143 70 594 251 606 243 5 -3 21 -30 35 -60 14 -31 33 -58 41 -61 14 -6 195 67 233 94 25 18 25 51 0 83 -28 36 -25 40 23 40 99 0 240 55 309 121 22 21 54 41 72 45 53 11 150 59 189 94 74 64 103 165 69 232 l-20 37 24 48 c34 70 33 160 -2 202 -14 17 -33 31 -42 31 -40 1 -45 16 -20 56 78 124 122 264 116 363 -4 57 -8 67 -36 92 -40 36 -96 39 -161 7 -59 -28 -193 -163 -251 -253 l-45 -69 -8 59 c-32 249 -130 445 -234 471 -43 11 -94 -22 -123 -81 -44 -88 -36 -298 17 -449 17 -51 17 -66 -4 -66 -34 0 -118 -47 -160 -89 -23 -24 -55 -68 -70 -99 -25 -50 -28 -68 -27 -147 0 -68 6 -103 22 -145 12 -30 22 -58 22 -62 0 -4 -27 -21 -60 -38 -33 -17 -69 -39 -80 -50 -19 -19 -19 -22 -4 -60 9 -23 15 -42 13 -43 -4 -3 -144 -62 -229 -97 -30 -13 -113 -47 -184 -77 -71 -29 -132 -51 -134 -48 -3 2 7 78 21 167 35 217 47 351 47 532 0 175 -16 472 -32 566 -5 36 -12 81 -15 100 -9 56 -136 176 -242 228 -48 25 -98 42 -117 42 -39 0 -40 5 -20 76 8 27 20 86 27 131 11 75 11 89 -9 168 -29 117 -66 169 -156 215 -53 27 -98 35 -136 38 -51 3 -69 1 -72 -9z" />

            <path
              d="M4495 4503 c-35 -7 -69 -39 -62 -57 6 -15 15 -16 61 -11 50 7 57 5 80 -18 33 -33 35 -97 6 -144 -20 -33 -37 -41 -104 -45 -50 -4 -71 -32 -41 -54 25 -20 104 -12 148 14 77 44 109 189 58 261 -35 48 -84 67 -146 54z"
              fill={`url(#${accentGradientId})`}
            />

            <path
              d="M5401 6514 c-28 -76 -92 -127 -234 -184 -108 -43 -188 -59 -347 -70 -140 -10 -288 -38 -343 -66 -88 -46 -178 -156 -218 -269 -29 -83 -32 -261 -4 -233 3 3 9 39 14 79 11 92 32 147 88 226 96 137 155 161 519 207 135 18 199 37 329 100 122 60 177 104 209 168 29 58 32 78 13 78 -7 0 -19 -16 -26 -36z"
              fill={`url(#${accentGradientId})`}
            />
          </g>

          <g className="coffee-steam">
            <path
              d="M430,100 Q450,50 470,100"
              fill="none"
              stroke={loadingProgress > 70 ? "#E8E8E8" : "transparent"}
              strokeWidth="4"
              strokeLinecap="round"
              opacity={loadingProgress > 70 ? "0.9" : "0"}
            >
              <animate
                attributeName="d"
                dur="2s"
                values="M430,100 Q450,50 470,100;
                               M430,100 Q450,20 470,100;
                               M430,100 Q450,50 470,100"
                repeatCount={isComplete ? "0" : "indefinite"}
              />
            </path>
            <path
              d="M400,100 Q420,30 440,100"
              fill="none"
              stroke={loadingProgress > 80 ? "#E8E8E8" : "transparent"}
              strokeWidth="4"
              strokeLinecap="round"
              opacity={loadingProgress > 80 ? "0.8" : "0"}
            >
              <animate
                attributeName="d"
                dur="2.2s"
                values="M400,100 Q420,30 440,100;
                               M400,100 Q420,10 440,100;
                               M400,100 Q420,30 440,100"
                repeatCount={isComplete ? "0" : "indefinite"}
              />
            </path>
            <path
              d="M460,100 Q480,40 500,100"
              fill="none"
              stroke={loadingProgress > 90 ? "#E8E8E8" : "transparent"}
              strokeWidth="4"
              strokeLinecap="round"
              opacity={loadingProgress > 90 ? "0.7" : "0"}
            >
              <animate
                attributeName="d"
                dur="1.8s"
                values="M460,100 Q480,40 500,100;
                               M460,100 Q480,15 500,100;
                               M460,100 Q480,40 500,100"
                repeatCount={isComplete ? "0" : "indefinite"}
              />
            </path>
          </g>
        </svg>

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[110%] overflow-hidden rounded-full h-1.5 bg-[#F5E6D3]/50 shadow-sm">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${loadingProgress}%`,
              background: `linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%)`,
              boxShadow: `0 0 8px ${primaryColor}80`
            }}
          />
        </div>
      </div>

      {message && (
        <p className={`${textSize} text-amber-800 font-medium ${msgMargin}`}>
          {message}
        </p>
      )}

      <span className="sr-only" aria-live="polite">
        {isComplete
          ? "Carga completa"
          : <SafeNumericDisplay 
              value={Math.round(loadingProgress)} 
              prefix="Cargando, " 
              suffix="% completado" 
              defaultValue="Cargando..." 
            />
        }
      </span>
    </div>
  );
};

export default LoadingSpinner;