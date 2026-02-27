"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

interface ExportButtonProps {
  data: any[] // We will pass the Monthly Aggregate data here
}

export function ExportButton({ data }: ExportButtonProps) {
  
  const handleExport = () => {
    // 1. Format data for Excel (Clean up the object structure)
    const worksheetData = data.map(item => ({
      Month: item.month,
      Year: item.year,
      "Total Income": item.totalIncome,
      "Primary Expenses (Needs)": item.totalPrimary,
      "Secondary Expenses (Wants)": item.totalSecondary,
      "Total Expenses": item.totalPrimary + item.totalSecondary,
      "Net Profit": item.totalProfit
    }))

    // 2. Create a new Workbook and Worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(worksheetData)

    // 3. Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Summary")

    // 4. Write and Download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    
    saveAs(blob, `Financial_Report_${new Date().getFullYear()}.xlsx`)
  }

  return (
    <Button 
      onClick={handleExport}
      variant="outline" 
      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
    >
      <Download className="mr-2 h-4 w-4" /> Export Excel
    </Button>
  )
}