
import { Button } from "@/common/ui/button"
import {  CardFooter } from "@/common/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/common/ui/select"



interface Props {
    currentPage: number
    totalPages: number
    itemsPerPage: number
    filteredBranches:number
    indexOfFirstItem:number
    indexOfLastItem:number
    setItemsPerPage: React.Dispatch<React.SetStateAction<number>>
    setCurrentPage: React.Dispatch<React.SetStateAction<number>> 
}

export const CardFooterBranches =  ({ indexOfFirstItem, indexOfLastItem, filteredBranches, currentPage, totalPages, setCurrentPage, setItemsPerPage, itemsPerPage}: Props) => {
    return (
        <CardFooter className="border-t border-gray-100 py-3 px-5 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBranches || 0)} de {filteredBranches || 0}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 border-gray-200"
          >
            <span className="sr-only">Página anterior</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>

          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 border-gray-200"
          >
            <span className="sr-only">Página siguiente</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>

          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-16 h-8 text-xs border-gray-200">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="9">9</SelectItem>
              <SelectItem value="12">12</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardFooter>
    )
}