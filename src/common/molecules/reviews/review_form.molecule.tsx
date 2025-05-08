import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageCircle, Coffee, Send, Image as ImageIcon } from "lucide-react";

import { Button } from "@/common/ui/button";
import { Textarea } from "@/common/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/common/ui/form";
import StarsRating from "@/common/atoms/reviews/stars_rating.atom";
import ReviewImageUpload from "@/common/molecules/reviews/review_image_upload.molecule";

const reviewSchema = z.object({
  rating: z.number().min(1, "Por favor, selecciona una calificación"),
  comment: z.string().min(10, "El comentario debe tener al menos 10 caracteres"),
  imageUrls: z.array(z.string()).optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  branchId: number;
  branchName?: string;
  onSubmit: (data: ReviewFormValues) => void;
  isLoading: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  branchId,
  branchName,
  onSubmit,
  isLoading
}) => {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      imageUrls: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-amber-50/50 rounded-lg border border-amber-100 p-3 mb-4">
          <div className="flex items-center">
            <Coffee className="w-4 h-4 text-amber-600 mr-2" />
            <h3 className="text-sm font-medium text-amber-800">
              {branchName || "Cafetería"}
            </h3>
          </div>
          <p className="text-xs text-amber-700/70 mt-1">
            Comparte tu experiencia y gana 5 CoffeeCoins adicionales
          </p>
        </div>

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm flex items-center">
                <span>¿Cómo calificarías tu experiencia?</span>
                {field.value > 0 && (
                  <span className="ml-2 text-xs text-amber-600 font-medium">
                    {field.value === 5 ? "¡Excelente!" : 
                     field.value === 4 ? "Muy bueno" :
                     field.value === 3 ? "Bueno" :
                     field.value === 2 ? "Regular" : "Malo"}
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <StarsRating 
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-sm">
                <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                Comparte tu opinión
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="¿Qué te pareció el café? ¿El ambiente? ¿La atención?"
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrls"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-sm">
                <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                Fotos (opcional)
              </FormLabel>
              <FormControl>
                <ReviewImageUpload 
                  imageUrls={field.value || []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium shadow-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <>Enviando<span className="ml-1 animate-pulse">...</span></>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar reseña y ganar 5 CoffeeCoins
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;