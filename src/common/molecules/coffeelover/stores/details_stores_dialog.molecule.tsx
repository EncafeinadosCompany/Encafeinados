import { Badge } from "@/common/ui/badge";
import { Dialog, DialogContent, DialogFooter } from "@/common/ui/dialog";
import { useState } from "react";
import { MapPin, Mail, X, Coffee, MessageSquare, Heart, Star } from "@/common/ui/icons";
import { GoToButton } from "@/common/atoms/map/GoToButton";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ReviewsWidget } from "@/common/widgets/coffeelover/reviews/reviews_widget";
import { Textarea } from "@/common/ui/textarea";
import { Button } from "@/common/ui/button";
import { useBranchesID } from "@/api/queries/branches/branch.query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, MessageCircleDashedIcon, MoveLeftIcon } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/common/ui/form";
import { useCreateRecommendationMutation } from "@/api/mutations/recommendation/recommendation.mutation";
import { useForm } from "react-hook-form";
import { recommendationSchema, RecommendationSchemaType } from "@/common/utils/schemas/recommendation/recommendation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBranchAttributes } from "@/api/queries/attributes/attributes.query";

export default function StoreDetailsCard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("branch")

  if (!id) {
    return null;
  }
 
  const { data: details, isLoading, isError } = useBranchesID(Number(id));
  const {data:attributes, isLoading: isLoading_attributes, isError: isError_attributes} =  useBranchAttributes(id);
  const verifit = localStorage.getItem("isVerified");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [recommendOpen, setRecommendOpen] = useState(false);

  const recommendationMutation = useCreateRecommendationMutation();


  const form = useForm<RecommendationSchemaType>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      message: "",
    },
  });


  const handleRecommend = (values: RecommendationSchemaType) => {
    console.log(values);
    if (!details) return;

    recommendationMutation.mutate({
      branch_id: details.branch.id,
      message: values.message
    }, {
      onSuccess: () => {
        form.reset();
        setRecommendOpen(false);
      }
    });
  };

  if (!details) return null;


  if (isLoading) {
    return (
      <div className="w-full max-h-[91vh] flex items-center justify-center bg-[#FBF7F4] rounded-xl">
        <div className="text-center p-6">
          <Coffee className="h-12 w-12 text-[#DB8935] mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-medium text-[#5F4B32] mb-2">Cargando información</h2>
          <p className="text-[#8B5A2B]/70">Obteniendo detalles de la tienda...</p>
        </div>
      </div>
    );
  }



  if (isError || !details || !details.branch) {
    return (
      <div className="w-full h-[91vh] flex items-center justify-center bg-[#FBF7F4] rounded-xl">
        <div className="text-center p-6">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-[#5F4B32] mb-2">Ocurrió un error</h2>
          <p className="text-[#8B5A2B]/70 mb-4">
            "No se pudo cargar la información de la tienda"
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-[#DB8935] hover:bg-[#C07830] text-white"
          >
            <MoveLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }


  if (isLoading_attributes) {
    return (
     <p>cargando atributos</p> 
    ) 
  }

  if (isError_attributes || !attributes) {
    return (
     <p>error al cargar atributos</p> 
    ) 
  }


  if (isError_attributes) {
    return (
     <p>cargando atributos</p>
    ) 
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      {/* Changed from fixed positioning to a regular card */}
      <div className="w-full max-w-full h-[91vh] xl:h-[90vh] md:max-w-3xl lg:max-w-4xl xl:max-w-7xl 
        bg-[#FBF7F4] shadow-xl rounded-xl md:rounded-2xl  mx-auto
        overflow-hidden flex flex-col relative animate-in fade-in duration-300">

        <div className="relative w-full h-56 md:min-h-72  overflow-hidden flex-shrink-0">
          <div
            className={`absolute inset-0 bg-[#8B5A2B]/20 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 ${imageLoaded ? "opacity-0" : "opacity-100"
              }`}
          >
            <Coffee className="h-10 w-10 text-[#8B5A2B] animate-pulse" />
          </div>
          <img
            src={details.branch.store.store_logo || "/placeholder.svg"}
            alt={details.branch.name}
            onLoad={() => setImageLoaded(true)}
            className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/70 to-transparent"></div>
          <button
            className="absolute top-4 left-4 bg-white/90 hover:bg-amber-100 transition-colors p-2 rounded-full flex items-center gap-1 shadow-md"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 text-amber-800" />
            <span className="text-amber-800 font-medium text-xs">Volver</span>
          </button>


          <div className="absolute top-4 right-4">
            {
              verifit === "true" && (
                <button
                  onClick={() => setRecommendOpen(true)}

                  className="bg-white/80 border border-[#DB8935] text-[#DB8935] rounded-full 
                  font-medium hover:bg-[#DB8935]/5 transition-all duration-300 transform hover:scale-105 
                  shadow-md hover:shadow-lg flex items-center justify-center gap-2 py-2 px-4 h-[38px]"
                >
                  <Star className="h-4 w-4" />
                  <span className="text-sm">Recomendar</span>
                </button>
              )
            }
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">

            <div className="flex items-center gap-2 mb-2">
              <div className="bg-amber-500/90 px-2 py-1 rounded-md flex items-center">
                <Star className="h-4 w-4 text-white mr-1" />
                <span className="text-white font-medium text-sm">{details.branch.average_rating}</span>
              </div>
              <span className="text-white/90 text-sm">Calificaciones</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
              {details.branch.name}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Disfruta de una nueva experiencia de tomar café.
            </p>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6 space-y-5">
            <div className="space-y-4">
              <h3 className="font-medium text-[#5F4B32] text-base sm:text-lg flex items-center gap-2 border-b border-[#E6D7C3] pb-2">
                <Coffee className="h-5 w-5 text-[#8B5A2B]" />
                <span>Información de la tienda</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Address */}
                <div className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#DB8935]/10 transition-transform duration-300 group-hover:scale-150" />
                  <div className="relative flex items-start gap-4">
                    <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                      <MapPin className="h-5 w-5 text-[#DB8935]" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="block font-medium text-[#5F4B32]">
                        Dirección
                      </span>
                      <p className="text-sm text-gray-600/90 leading-relaxed">
                        {details.branch.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#DB8935]/10 transition-transform duration-300 group-hover:scale-150" />
                  <div className="relative flex items-start gap-4">
                    <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                      <Mail className="h-5 w-5 text-[#DB8935]" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="block font-medium text-[#5F4B32]">
                        Email
                      </span>
                      <p className="text-sm text-gray-600/90 leading-relaxed break-all">
                        {details.branch.store.store_email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-[#5F4B32]">
                Especialidades
              </h4>
              <div className="flex flex-wrap gap-2">
                {
                  attributes.attributes.map((attribute) => (
                    <Badge key={attribute.attributeId} className="bg-[#F5E4D2] text-[#8B5A2B] hover:bg-[#EAD7C1]">
                      {attribute.value?attribute.value :attribute.attributeName}
                    </Badge>
                  ))
                }
               
              </div>
            </div>
            <div className="space-y-3">
             <div className="w-full flex space-x-2">
             <MessageCircleDashedIcon className="h-5"/>
              <h4 className="text-sm font-medium text-[#5F4B32]">
                Redes sociales
              </h4>
             </div>
              <div className="flex flex-wrap gap-2">
                {details.branch.social_branches.length > 0 ? (
                  details.branch.social_branches.map((social) => (

                    <a href={social.value} target="_blank" rel="noopener noreferrer">
                      <Badge className="bg-[#F5E4D2] text-[#8B5A2B] hover:bg-[#EAD7C1]">
                        {social.description}
                      </Badge>
                    </a>
                  )
                  )
                ) : (
                  <span>No tiene redes sociales registradas</span>
                )}
              </div>
            </div>

            <div>
              <button
                onClick={() => setReviewsOpen(true)}
                className="bg-white border border-[#DB8935] text-[#DB8935] rounded-full 
                font-medium hover:bg-[#DB8935]/5 transition-all duration-300 transform hover:scale-105 
                shadow-md hover:shadow-lg flex items-center justify-center gap-2 py-2.5 px-4 h-[42px]"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Ver reseñas</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-[#E6D7C3]/50 mt-auto flex-shrink-0 
          flex flex-col sm:flex-row gap-3 sm:gap-4 bg-[#FBF7F4]">

          <div className="flex-1 xl:max-w-2xl mx-auto">
            <GoToButton
              text={`a ${details.branch.name}`}
              branchId={details.branch.id}
              mapRoute="private"
            />
          </div>
        </div>
      </div>

      {/* Keep the dialogs for reviews and recommendations */}
      <Dialog open={reviewsOpen} onOpenChange={setReviewsOpen}>
        <DialogContent className="w-[95vw] sm:w-[85vw] md:w-[65vw] lg:w-[55vw] xl:w-[50vw] 
          max-h-[85vh] bg-[#FBF7F4] shadow-xl border-none rounded-2xl p-0 overflow-hidden flex flex-col">
          <DialogTitle className="sr-only">Reseñas de {details.branch.name}</DialogTitle>

          <div className="p-4 sm:p-6 border-b border-[#E6D7C3]/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#DB8935]/10 p-1.5 rounded-full">
                  <MessageSquare className="h-5 w-5 text-[#DB8935]" />
                </div>
                <h2 className="font-medium text-[#5F4B32] text-lg truncate">
                  Reseñas de{" "}
                  <span className="font-semibold">{details.branch.name}</span>
                </h2>
              </div>
              {/* <button
                onClick={() => setReviewsOpen(false)}
                className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full 
                  hover:bg-white transition-all duration-300 text-[#5F4B32] hover:text-[#8B5A2B]"
              >
                <X className="h-5 w-5" />
              </button> */}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar p-4 sm:p-6">
            <ReviewsWidget branchId={details.branch.id} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={recommendOpen}
        onOpenChange={(open) => {
          if (!open) form.reset();
          setRecommendOpen(open);
        }}
      >
        <DialogContent className="w-[95vw] sm:w-[85vw] md:w-[65vw] lg:w-[55vw] xl:w-[50vw] 
          max-h-[85vh] bg-[#FBF7F4] shadow-xl border-none rounded-2xl p-0 overflow-hidden flex flex-col">
          <DialogTitle className="sr-only">Recomendar {details?.branch.name}</DialogTitle>

          <div className="p-6 sm:p-6 border-b border-[#E6D7C3]/50 flex-shrink-0">
            <div className="flex items-center mt-3 justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#DB8935]/10 p-1.5 rounded-full">
                  <Heart className="h-5 w-5 text-[#DB8935]" />
                </div>
                <h2 className="font-medium text-[#5F4B32] text-lg truncate">
                  Recomendar{" "}
                  <span className="font-semibold">{details?.branch.name}</span>
                </h2>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRecommend)} className="flex flex-col flex-1">
              <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar p-4 sm:p-6">
                <div className="space-y-4">
                  <p className="text-[#5F4B32]">
                    Comparte tu experiencia y ayuda a otros a descubrir este lugar.
                  </p>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="¿Qué te gustó de este lugar?"
                            className="min-h-[120px] border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="flex justify-end text-xs text-gray-500">
                          {field.value.length}/150
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter className="px-4 sm:px-6 py-4 border-t border-[#E6D7C3]/50 mt-auto flex-shrink-0 bg-[#FBF7F4]">
                <Button
                  type="submit"
                  className="bg-[#DB8935] hover:bg-[#C07830] text-white w-full"
                  disabled={!form.formState.isValid || recommendationMutation.isPending}
                >
                  {recommendationMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar recomendación"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};