import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Phone, IdCard, CheckCircle, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/common/ui/dialog';
import { Button } from '@/common/ui/button';
import { Input } from '@/common/ui/input';
import { Label } from '@/common/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/ui/select';
import { Branch } from '@/api/types/branches/branches.types';
import { useCreateBranchAdminMutation } from '@/api/mutations/admin_stores/admin_stores.mutation';
import { CreateBranchAdminData } from '@/api/types/admin_stores/admin_stores.type';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BranchAdminSchema, transformToBranchAdminPayload } from '@/common/utils/schemas/branch/admin/register_branch_admin.schema';
import type { BranchAdminFormData } from '@/common/utils/schemas/branch/admin/register_branch_admin.schema';

interface AssignBranchAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch | null;
}

export const AssignBranchAdminModal: React.FC<AssignBranchAdminModalProps> = ({
  isOpen,
  onClose,
  branch
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const createBranchAdminMutation = useCreateBranchAdminMutation();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid },
    reset,
    setValue
  } = useForm<BranchAdminFormData>({
    resolver: zodResolver(BranchAdminSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      full_name: '',
      type_document: 'CC',
      number_document: '',
      phone_number: '',
      branch_id: branch?.id || 0
    }
  });

  React.useEffect(() => {
    if (branch?.id) {
      setValue('branch_id', branch.id);
    }
  }, [branch, setValue]);

  const onSubmit = async (data: BranchAdminFormData) => {
    if (!branch) return;

    try {
      const payload = transformToBranchAdminPayload(data);
      await createBranchAdminMutation.mutateAsync(payload);
      setShowSuccess(true);
      reset();

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating branch admin:', error);
    }
  };

  const handleClose = () => {
    if (!createBranchAdminMutation.isPending) {
      onClose();
      setShowSuccess(false);
      reset();
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-[#FBF7F4] border border-[#E6D7C3] shadow-xl rounded-2xl max-w-md">
          <div className="text-center p-8 bg-[#FBF7F4] rounded-2xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto w-20 h-20 bg-gradient-to-r from-[#DB8935] to-[#C87000] rounded-full flex items-center justify-center mb-6 shadow-lg"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-[#5F4B32] mb-3">
                ¡Administrador Asignado!
              </h3>
              <p className="text-[#A67C52] leading-relaxed">
                Se ha creado exitosamente el administrador para la sucursal <br />
                <strong className="text-[#DB8935]">{branch?.name}</strong>
              </p>
              <div className="mt-6 pt-4 border-t border-[#E6D7C3]">
                <p className="text-sm text-[#A67C52]/80">
                  El administrador recibirá sus credenciales de acceso
                </p>
              </div>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#FBF7F4] border border-[#E6D7C3] shadow-xl rounded-2xl max-w-4xl max-h-[95vh] overflow-hidden p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#DB8935] to-[#C87000] p-6 rounded-t-xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-white">
                  Asignar Administrador de Sucursal
                </DialogTitle>
                <p className="text-[#FFF3E5] mt-1">
                  Sucursal: <span className="font-medium text-white">{branch?.name}</span>
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 flex-grow overflow-y-auto" style={{ maxHeight: 'calc(95vh - 180px)' }}>
            <div className="p-6 border-r border-[#E6D7C3]/50">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-[#F5E4D2] rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[#DB8935]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#5F4B32]">
                    Información de Cuenta
                  </h3>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-[#6F4E37]">
                      Correo Electrónico *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A67C52]" />
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        className={`pl-10 bg-white/70 border-[#E6D7C3]/50 focus:border-[#DB8935] focus:ring-[#DB8935]/30 rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="admin@cafeteria.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-[#6F4E37]">
                      PIN (4 dígitos) *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A67C52]" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register('password', {
                          onChange: (e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                            e.target.value = value;
                          }
                        })}
                        className={`pl-10 pr-12 bg-white/70 border-[#E6D7C3]/50 focus:border-[#DB8935] focus:ring-[#DB8935]/30 rounded-lg  tracking-widest ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="1234"
                        inputMode="numeric"
                        maxLength={4}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A67C52] hover:text-[#DB8935] transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password ? (
                      <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                    ) : (
                      <p className="text-xs text-[#A67C52]/70">Exactamente 4 números</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 bg-[#FFF9F2] rounded-lg p-4 border border-[#FFECD9]">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-[#DB8935]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </div>
                    <p className="text-xs text-[#A67C52]">
                      Al crear un administrador, esta persona podrá gestionar la información de esta sucursal, 
                      incluyendo horarios y fotos.
                    </p>
                  </div>
                </div>

                <div className="bg-[#F5E4D2]/30 rounded-lg p-4 border border-[#F5E4D2]">
                  <h4 className="text-sm font-medium text-[#5F4B32] mb-2">Permisos del administrador</h4>
                  <ul className="text-xs text-[#A67C52] space-y-1.5 list-disc pl-4">
                    <li>Gestionar información básica de la sucursal</li>
                    <li>Administrar horarios de atención</li>
                    <li>Gestionar fotos</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-[#F5E4D2] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#DB8935]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#5F4B32]">
                    Información Personal
                  </h3>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm font-medium text-[#6F4E37]">
                      Nombre Completo *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A67C52]" />
                      <Input
                        id="full_name"
                        {...register('full_name')}
                        className={`pl-10 bg-white/70 border-[#E6D7C3]/50 focus:border-[#DB8935] focus:ring-[#DB8935]/30 rounded-lg ${errors.full_name ? 'border-red-500' : ''}`}
                        placeholder="Juan Pérez González"
                      />
                    </div>
                    {errors.full_name && (
                      <p className="text-xs text-red-500 mt-1">{errors.full_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type_document" className="text-sm font-medium text-[#6F4E37]">
                      Tipo de Documento *
                    </Label>
                    <Select 
                      defaultValue="CC"
                      onValueChange={(value) => setValue('type_document', value)}
                    >
                      <SelectTrigger className={`bg-white/70 border-[#E6D7C3]/50 focus:border-[#DB8935] focus:ring-[#DB8935]/30 rounded-lg text-[#5F4B32] ${errors.type_document ? 'border-red-500' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-[#E6D7C3] shadow-lg">
                        <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                        <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                        <SelectItem value="PA">Pasaporte</SelectItem>
                        <SelectItem value="NIT">NIT</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type_document && (
                      <p className="text-xs text-red-500 mt-1">{errors.type_document.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number_document" className="text-sm font-medium text-[#6F4E37]">
                      Número de Documento *
                    </Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A67C52]" />
                      <Input
                        id="number_document"
                        {...register('number_document', {
                          onChange: (e) => {
                            // Permite dígitos y guiones, elimina otros caracteres
                            const value = e.target.value.replace(/[^\d-]/g, '');
                            e.target.value = value;
                          }
                        })}
                        className={`pl-10 bg-white/70 border-[#E6D7C3]/50 focus:border-[#DB8935] focus:ring-[#DB8935]/30 rounded-lg ${errors.number_document ? 'border-red-500' : ''}`}
                        placeholder="123456789-0"
                      />
                    </div>
                    {errors.number_document && (
                      <p className="text-xs text-red-500 mt-1">{errors.number_document.message}</p>
                    )}
                    <p className="text-xs text-[#A67C52]/70">
                      {`Para NIT puedes incluir el dígito de verificación con guion (Ej: 900123456-7)`}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="text-sm font-medium text-[#6F4E37]">
                      Número de Teléfono *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A67C52]" />
                      <Input
                        id="phone_number"
                        {...register('phone_number', {
                          onChange: (e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            e.target.value = value;
                          }
                        })}
                        className={`pl-10 bg-white/70 border-[#E6D7C3]/50 focus:border-[#DB8935] focus:ring-[#DB8935]/30 rounded-lg ${errors.phone_number ? 'border-red-500' : ''}`}
                        placeholder="3001234567"
                      />
                    </div>
                    {errors.phone_number && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone_number.message}</p>
                    )}
                  </div>
                </div>

                <div className="bg-[#FFF9F2] rounded-lg p-4 border border-[#FFECD9] mt-6">
                  <h4 className="text-sm font-medium text-[#5F4B32] mb-2">Notas importantes</h4>
                  <ul className="text-xs text-[#A67C52] space-y-1.5">
                    <li className="flex items-start">
                      <span className="text-[#DB8935] mr-2">•</span> 
                      <span>Asegurate que la información proporcionada sea correcta antes de enviar la solicitud.</span>
                    </li>
                   
                    <li className="flex items-start">
                      <span className="text-[#DB8935] mr-2">•</span> 
                      <span>El administrador recibirá un correo con su información.</span>
                    </li>   
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 p-3 border-t border-[#E6D7C3] bg-[#FFF9F2] rounded-b-xl">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createBranchAdminMutation.isPending}
              className="flex-1 border-[#E6D7C3] text-[#A67C52] hover:bg-[#F5E4D2]/30"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isValid || createBranchAdminMutation.isPending}
              className="flex-1 bg-gradient-to-r from-[#DB8935] to-[#C87000] hover:from-[#C87000] hover:to-[#A65C00] text-white shadow-lg"
            >
              {createBranchAdminMutation.isPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Crear Administrador
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
