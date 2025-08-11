import { SimpleProgressBar } from './progress_indicator';

interface FormHeaderProps {
    getGreeting: () => string; 
    getStepTitle: () => string;
    getStepDescription: () => string;
    getStepIcon: () => React.ReactNode;
    totalSteps?: number;
    steps?: number;
    color?: string ;
    colorProccessBar?: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
    getGreeting,
    getStepDescription,
    getStepTitle,
    getStepIcon,
    totalSteps = 0,
    steps = 0,
    colorProccessBar,
    color
}) => {
    return (
        <div className={`relative bg-gradient-to-r ${color? color : 'from-amber-50 to-orange-50 '} p-3 md:p-4 lg:p-5 overflow-hidden`}>
            {/* Decoraciones de fondo */}
            <div className="absolute -top-10 right-10 w-24 h-24 rounded-full bg-amber-100 opacity-40 blur-2xl hidden sm:block"></div>
            <div className="absolute bottom-3 right-10 w-10 h-10 rounded-full bg-rose-100 opacity-50 hidden sm:block"></div>

            <div className="relative flex flex-row justify-between items-center gap-4 ">
                {/* Contenido del header */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xlg md:text-xl">👋</span>
                        <h3 className="text-amber-700 font-medium text-sm md:text-base">
                            {getGreeting()}!
                        </h3>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                        {getStepTitle()}
                    </h1>
                    <p className="text-xs md:text-sm text-gray-600 mt-0.5 max-w-md">
                        {getStepDescription()}
                    </p>
                </div>

                {/* Ilustración */}
                <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-16 h-16 md:w-16 md:h-16 bg-white rounded-xl shadow-sm">
                        {getStepIcon()}
                    </div>
                </div>
            </div>

            {/* Indicador de progreso */}
            <div className="mt-2 md:mt-3">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700">Progreso del registro</p>
                    <p className="text-sm text-gray-500">{steps + 1} de {totalSteps}</p>
                </div>
                < SimpleProgressBar
                    color={colorProccessBar}
                    currentStep={steps + 1}
                    totalSteps={totalSteps}
                ></SimpleProgressBar>
            </div>
        </div>
    );
};