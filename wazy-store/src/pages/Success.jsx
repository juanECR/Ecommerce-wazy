import { useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';

export const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        
        {/* Icono de Éxito con efecto Premium */}
        <div className="flex justify-center">
          <div className="rounded-full bg-green-50 p-4 text-green-500 animate-bounce">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
        </div>

        {/* Mensajes Principales */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-gray-950">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Tu orden ha sido registrada con éxito en el sistema de <span className="font-semibold text-gray-900">Wazy Corp</span>.
          </p>
        </div>

        {/* Bloque Informativo Crítico (Requisito del Backend) */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3 text-left">
          <div className="text-[#2563eb] mt-0.5 flex-shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Comprobante en camino</h3>
            <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
              Hemos enviado automáticamente un documento PDF con el resumen detallado de tu orden y los pasos de pago a tu correo electrónico.
            </p>
          </div>
        </div>

        {/* Acciones de Navegación */}
        <div className="pt-4">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-gray-950 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-gray-800 transition-colors active:scale-[0.98]"
          >
            Seguir comprando
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};