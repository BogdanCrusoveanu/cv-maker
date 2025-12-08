import React from "react";

interface CvPreviewProps {
  template?: string;
}

export const CvPreview: React.FC<CvPreviewProps> = ({
  template = "modern",
}) => {
  const getPreview = () => {
    switch (template) {
      case "modern":
        return (
          <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
            <div className="h-2 w-full bg-red-500"></div>
            <div className="flex flex-1 p-2 gap-2">
              <div className="w-1/3 flex flex-col gap-1">
                <div className="h-8 w-8 bg-gray-200 rounded-full mb-1"></div>
                <div className="h-1 w-full bg-gray-200 rounded"></div>
                <div className="h-1 w-3/4 bg-gray-200 rounded"></div>
                <div className="mt-2 h-1 w-full bg-gray-100 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
              </div>
              <div className="w-2/3 flex flex-col gap-1">
                <div className="h-2 w-1/2 bg-gray-800 rounded mb-1"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
                <div className="h-1 w-3/4 bg-gray-100 rounded"></div>
                <div className="mt-2 h-1.5 w-1/3 bg-gray-300 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        );
      case "classic":
        return (
          <div className="w-full h-full bg-white flex flex-col p-2 relative overflow-hidden">
            <div className="flex flex-col items-center mb-2 border-b border-purple-200 pb-1">
              <div className="h-2 w-1/2 bg-purple-600 rounded mb-1"></div>
              <div className="h-1 w-1/3 bg-gray-400 rounded"></div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-1.5 w-1/4 bg-purple-100 rounded"></div>
              <div className="h-1 w-full bg-gray-100 rounded"></div>
              <div className="h-1 w-full bg-gray-100 rounded"></div>
              <div className="mt-1 h-1.5 w-1/4 bg-purple-100 rounded"></div>
              <div className="h-1 w-full bg-gray-100 rounded"></div>
              <div className="h-1 w-3/4 bg-gray-100 rounded"></div>
            </div>
          </div>
        );
      case "minimal":
        return (
          <div className="w-full h-full bg-white flex flex-col p-3 relative overflow-hidden">
            <div className="h-3 w-1/2 bg-yellow-500 mb-2"></div>
            <div className="flex gap-2">
              <div className="w-2/3 flex flex-col gap-1">
                <div className="h-1 w-full bg-gray-100 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
                <div className="h-1 w-3/4 bg-gray-100 rounded"></div>
                <div className="mt-2 h-1.5 w-1/3 bg-gray-800 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        );
      case "noir":
        return (
          <div className="w-full h-full bg-white flex relative overflow-hidden">
            <div className="w-1/3 bg-gray-900 h-full p-2 flex flex-col gap-2">
              <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
              <div className="h-1 w-full bg-gray-700 rounded"></div>
              <div className="h-1 w-3/4 bg-gray-700 rounded"></div>
              <div className="mt-2 h-0.5 w-full bg-gray-700 rounded"></div>
              <div className="h-0.5 w-full bg-gray-700 rounded"></div>
            </div>
            <div className="w-2/3 p-2 flex flex-col gap-1">
              <div className="h-3 w-3/4 bg-gray-900 mb-2"></div>
              <div className="h-1 w-full bg-gray-200 rounded"></div>
              <div className="h-1 w-full bg-gray-200 rounded"></div>
              <div className="h-1 w-3/4 bg-gray-200 rounded"></div>
              <div className="mt-2 h-1.5 w-1/3 bg-gray-400 rounded"></div>
              <div className="h-1 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        );
      case "azure":
        return (
          <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
            <div className="h-8 w-full bg-blue-600 mb-2 flex items-center px-2">
              <div className="h-2 w-1/2 bg-white/50 rounded"></div>
            </div>
            <div className="flex-1 px-2 flex flex-col gap-1">
              <div className="h-1.5 w-1/3 bg-blue-100 rounded"></div>
              <div className="h-1 w-full bg-gray-100 rounded"></div>
              <div className="h-1 w-full bg-gray-100 rounded"></div>
              <div className="mt-2 h-1.5 w-1/3 bg-blue-100 rounded"></div>
              <div className="h-1 w-full bg-gray-100 rounded"></div>
            </div>
          </div>
        );
      case "slate":
        return (
          <div className="w-full h-full bg-white flex relative overflow-hidden">
            <div className="w-1/4 bg-slate-200 h-full p-1 flex flex-col gap-1">
              <div className="h-4 w-4 bg-slate-400 rounded-full mx-auto mb-1"></div>
              <div className="h-0.5 w-full bg-slate-300 rounded"></div>
              <div className="h-0.5 w-full bg-slate-300 rounded"></div>
            </div>
            <div className="w-3/4 p-2 flex flex-col gap-1">
              <div className="h-2 w-1/2 bg-slate-700 rounded mb-1"></div>
              <div className="h-1 w-full bg-gray-100 rounded"></div>
              <div className="h-1 w-full bg-gray-100 rounded"></div>
              <div className="mt-1 h-1.5 w-1/3 bg-slate-200 rounded"></div>
              <div className="h-1 w-full bg-gray-100 rounded"></div>
            </div>
          </div>
        );
      case "citrus":
        return (
          <div className="w-full h-full bg-white flex flex-col relative overflow-hidden p-2">
            <div className="flex justify-between items-start mb-2">
              <div className="h-3 w-1/2 bg-yellow-400 rounded"></div>
              <div className="h-6 w-6 bg-yellow-100 rounded-full"></div>
            </div>
            <div className="h-1 w-full bg-yellow-50 rounded mb-2"></div>
            <div className="flex flex-col gap-1">
              <div className="h-1 w-full bg-gray-100 rounded"></div>
              <div className="h-1 w-3/4 bg-gray-100 rounded"></div>
              <div className="mt-1 h-1.5 w-1/4 bg-yellow-100 rounded"></div>
              <div className="h-1 w-full bg-gray-100 rounded"></div>
            </div>
          </div>
        );
      case "midnight":
        return (
          <div className="w-full h-full bg-slate-900 flex flex-col p-2 relative overflow-hidden">
            <div className="h-2 w-1/2 bg-indigo-400 rounded mb-2"></div>
            <div className="h-0.5 w-full bg-slate-700 rounded mb-2"></div>
            <div className="flex flex-col gap-1">
              <div className="h-1 w-full bg-slate-800 rounded"></div>
              <div className="h-1 w-full bg-slate-800 rounded"></div>
              <div className="h-1 w-3/4 bg-slate-800 rounded"></div>
              <div className="mt-2 h-1.5 w-1/3 bg-indigo-900 rounded"></div>
              <div className="h-1 w-full bg-slate-800 rounded"></div>
            </div>
          </div>
        );
      case "aurora":
        return (
          <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
            <div className="h-4 w-full bg-teal-700 mb-1 flex flex-col justify-center px-1">
              <div className="h-1 w-1/3 bg-white/50 rounded"></div>
            </div>
            <div className="flex flex-1 p-1 gap-1">
              <div className="w-2/3 flex flex-col gap-1">
                <div className="h-1 w-1/4 bg-teal-100 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
                <div className="mt-1 h-1 w-1/4 bg-teal-100 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
              </div>
              <div className="w-1/3 flex flex-col gap-1">
                <div className="h-1 w-full bg-gray-100 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        );
      case "academic":
        return (
          <div className="w-full h-full bg-white flex flex-col relative overflow-hidden p-2">
            <div className="flex flex-col items-center mb-1 border-b border-black pb-1">
              <div className="h-1.5 w-1/2 bg-gray-800 rounded mb-0.5"></div>
              <div className="h-0.5 w-1/3 bg-gray-400 rounded"></div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-0.5 w-full bg-gray-300 rounded mb-0.5"></div>
              <div className="h-1 w-full bg-gray-100 rounded"></div>
              <div className="h-1 w-full bg-gray-100 rounded"></div>
              <div className="mt-1 h-0.5 w-full bg-gray-300 rounded mb-0.5"></div>
              <div className="h-1 w-full bg-gray-100 rounded"></div>
            </div>
          </div>
        );
      case "polygonal":
        return (
          <div className="w-full h-full bg-slate-50 flex relative overflow-hidden">
            {/* Blobs */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-100 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-100 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="w-1/3 bg-slate-900 h-full p-1 flex flex-col gap-1 z-10">
              <div className="h-4 w-4 bg-slate-700 rounded-full mx-auto mb-1"></div>
              <div className="h-0.5 w-full bg-slate-600 rounded"></div>
              <div className="h-0.5 w-full bg-slate-600 rounded"></div>
            </div>
            <div className="w-2/3 p-2 flex flex-col gap-1 z-10">
              <div className="h-2 w-3/4 bg-slate-800 rounded mb-1"></div>
              <div className="h-1 w-full bg-gray-200 rounded"></div>
              <div className="h-1 w-full bg-gray-200 rounded"></div>
              <div className="mt-1 h-1 w-1/3 bg-indigo-200 rounded"></div>
              <div className="h-1 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        );
      case "verde":
        return (
          <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
            <div className="h-8 w-full bg-emerald-600 mb-1 flex flex-col items-center justify-center p-1">
              <div className="h-3 w-3 bg-emerald-400 rounded-full mb-0.5"></div>
              <div className="h-1 w-1/2 bg-emerald-200 rounded"></div>
            </div>
            <div className="flex p-1 gap-1">
              <div className="w-2/3 flex flex-col gap-1">
                <div className="h-1 w-1/3 bg-emerald-100 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
              </div>
              <div className="w-1/3 flex flex-col gap-1">
                <div className="h-1 w-full bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        );
      case "orbit":
        return (
          <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
            {/* Curve attempt */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-blue-900 rounded-b-[100%] shadow-sm"></div>

            <div className="relative z-10 flex justify-between items-start p-2 mt-1">
              <div className="h-2 w-1/2 bg-white/20 rounded"></div>
              <div className="h-5 w-5 bg-gray-200 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex p-2 gap-1 mt-1">
              <div className="w-1/3 flex flex-col gap-1">
                <div className="h-0.5 w-full bg-blue-100 rounded"></div>
                <div className="h-0.5 w-full bg-blue-100 rounded"></div>
              </div>
              <div className="w-2/3 flex flex-col gap-1">
                <div className="h-1 w-1/3 bg-orange-200 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        );
      default:
        // Default to modern if unknown
        return (
          <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
            <div className="h-2 w-full bg-gray-200"></div>
            <div className="flex flex-1 p-2 gap-2">
              <div className="w-1/3 flex flex-col gap-1">
                <div className="h-1 w-full bg-gray-100 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
              </div>
              <div className="w-2/3 flex flex-col gap-1">
                <div className="h-2 w-1/2 bg-gray-300 rounded mb-1"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
                <div className="h-1 w-full bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full shadow-sm overflow-hidden border border-gray-100">
      {getPreview()}
    </div>
  );
};
