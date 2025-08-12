import { SimpleProgressBar } from "../../atoms/forms/progress_indicator";

interface FormHeaderProps {
  getGreeting: () => string;
  getStepTitle: string;
  getStepDescription: string;
  getStepIcon: React.ReactNode;
  totalSteps?: number;
  steps?: number;
  color?: string;
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
  color,
}) => {
  return (
    <div
      className={`relative bg-gradient-to-r ${
        color ? color : "from-orange-50 to-purple-50"
      } p-3 md:p-4 lg:p-5 overflow-hidden`}
    >
      {/* Abstract shapes - background decorations */}
      <div className="absolute -top-10 right-10 w-40 h-40 rounded-full bg-amber-100 opacity-40 blur-2xl"></div>
      <div className="absolute top-5 left-5 w-10 h-10 rounded-full bg-green-200 opacity-60"></div>
      <div className="absolute bottom-5 right-20 w-16 h-16 rounded-full bg-rose-100 opacity-50"></div>

      <div className="relative flex flex-row justify-between items-center gap-4 ">
        {/* Contenido del header */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">👋</span>
            <h3 className="text-indigo-700 font-medium">{getGreeting()}!</h3>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {getStepTitle}
          </h1>
          <p className="text-xs md:text-[16px] text-gray-600 mt-2 max-w-md">
            {getStepDescription}
          </p>
        </div>

        {/* Ilustración */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-16 h-16 md:w-16 md:h-16 bg-white rounded-xl shadow-sm">
            {getStepIcon}
          </div>
        </div>
      </div>

      {/* Indicador de progreso */}
      <div className="mt-2 md:mt-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-gray-700">
            Progreso del registro
          </p>
          <p className="text-sm text-gray-500">
            {steps + 1} de {totalSteps}
          </p>
        </div>
        <SimpleProgressBar
          color={colorProccessBar}
          currentStep={steps + 1}
          totalSteps={totalSteps}
        ></SimpleProgressBar>
      </div>
    </div>
  );
};
