import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useValidateVisit } from "@/api/queries/stores/branchesQueries"

const ValidateVisitPage = () => {
  const { data: status, isLoading, isError } = useValidateVisit()
  const [searchParams] = useSearchParams()
  const shopId = searchParams.get('shop_id')
  const [message, setMessage] = useState('')

  useEffect(() => {


  }, [shopId])

  if(isLoading) return "Cargando..."
  if(isError) return "Error al cargar la tienda"
  if(!status) return "No hay tienda registrada"
  if(status === "success") return "Visita registrada con éxito"

  return null
}

export default ValidateVisitPage