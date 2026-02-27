"use client"

import { useState } from "react"
import { addTransaction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { PlusCircle, CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function TransactionForm() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isLoading, setIsLoading] = useState(false)

  // We use a standard onSubmit handler to control the loading state perfectly
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault() // Stop default reload
    if (!date) return

    setIsLoading(true) // 1. Start Spinner

    try {
      const formData = new FormData(event.currentTarget)
      formData.append('date', date.toISOString())
      
      await addTransaction(formData) // 2. Wait for Server Action
      
      setOpen(false) // 3. Close Modal on Success
      setDate(new Date()) // Reset Date
    } catch (error) {
      console.error("Failed", error)
    } finally {
      setIsLoading(false) // 4. Stop Spinner
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 backdrop-blur-sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-950/90 border-white/10 backdrop-blur-xl text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        
        {/* Changed from action={} to onSubmit={} for better control */}
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          
          <div className="grid gap-2">
            <label>Amount (₹)</label>
            <Input name="amount" type="number" step="0.01" required className="bg-white/5 border-white/10 text-white" placeholder="0.00" />
          </div>

          <div className="grid gap-2">
            <label>Title</label>
            <Input name="title" required className="bg-white/5 border-white/10 text-white" placeholder="e.g. Grocery" />
          </div>

          <div className="grid gap-2">
            <label>Type</label>
            <Select name="type" required defaultValue="PRIMARY">
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="PRIMARY">Primary Expense (Needs)</SelectItem>
                <SelectItem value="SECONDARY">Secondary Expense (Wants)</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label>Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-950 border-white/10 text-white">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="bg-slate-950 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold mt-4 transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> 
                Saving...
              </span>
            ) : (
              "Save Transaction"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}