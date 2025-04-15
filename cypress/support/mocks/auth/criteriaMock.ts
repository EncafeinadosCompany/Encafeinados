
import { criteriaResponseData} from '../../../../src/api/types/criteriaTypes';

export const mockCriteria:criteriaResponseData[] = [
    {
        id: 1,
        name: "¿Tiene wifi?",
        description: "Indica si cuenta con red wifi.",
        requires_image: true,
        active: true
    },
    {
        id: 2,
        name: "¿Tiene terraza?",
        description: "Espacio al aire libre.",
        requires_image: false,
        active:true
    },
    {
        id: 3,
        name: "¿Otro criterio?",
        description: "Si aplica, especifique.",
        requires_image: false,
        active:true
    }
]
