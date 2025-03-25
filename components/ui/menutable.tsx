// components/MenuTable.tsx
import React from "react"

interface MenuTableProps {
  htmlTable: string
}

const MenuTable: React.FC<MenuTableProps> = ({ htmlTable }) => {
  return (
    <div
      className="prose max-w-full overflow-auto p-4 bg-white shadow rounded"
      dangerouslySetInnerHTML={{ __html: htmlTable }}
    />
  )
}

export default MenuTable
