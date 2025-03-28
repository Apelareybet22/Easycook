import React from "react"


interface IngredienteTableProps {
  ingredientesHtml: string
}
 
const IngredientsTable: React.FC<IngredienteTableProps> = ({ ingredientesHtml }) => {
  return (
    <div
      className="prose max-w-full overflow-auto p-4 bg-white shadow rounded"
      dangerouslySetInnerHTML={{ __html: ingredientesHtml }}
    />
  )
}
export default IngredientsTable;