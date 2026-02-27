'use server'

import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client" // <--- 1. Import this

export async function addTransaction(formData: FormData) {
  // 1. Get the real authenticated user
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    throw new Error("Unauthorized: You must be logged in.")
  }

  // 2. Parse Form Data
  const amount = parseFloat(formData.get("amount") as string)
  const type = formData.get("type") as "PRIMARY" | "SECONDARY" | "INCOME"
  const title = formData.get("title") as string
  const dateStr = formData.get("date") as string 
  
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const email = user.emailAddresses[0].emailAddress

  // 3. Database Transaction (Secure & Optimized)
  // FIX: Explicitly type 'tx' as Prisma.TransactionClient
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    
    // A. Ensure User exists in OUR database (Syncing Clerk ID with Prisma)
    await tx.user.upsert({
      where: { id: userId }, 
      update: {},
      create: { 
        id: userId, 
        email: email, 
        name: user.firstName 
      }
    })

    // B. Save Daily Transaction
    await tx.transaction.create({
      data: {
        userId: userId, 
        amount,
        type,
        title,
        date: date,
      }
    })

    // C. Update Monthly Summary
    const existingMonth = await tx.monthlyAggregate.findUnique({
      where: {
        userId_month_year: { userId, month, year }
      }
    })

    const updates: any = {
       totalPrimary: existingMonth?.totalPrimary || 0,
       totalSecondary: existingMonth?.totalSecondary || 0,
       totalIncome: existingMonth?.totalIncome || 0,
    }

    if (type === 'PRIMARY') updates.totalPrimary += amount
    else if (type === 'SECONDARY') updates.totalSecondary += amount
    else if (type === 'INCOME') updates.totalIncome += amount

    updates.totalProfit = updates.totalIncome - (updates.totalPrimary + updates.totalSecondary)

    await tx.monthlyAggregate.upsert({
      where: { userId_month_year: { userId, month, year } },
      update: updates,
      create: { userId, month, year, ...updates }
    })
  })

  revalidatePath("/")
}

export async function getDashboardData() {
  const { userId } = await auth()
  if (!userId) return { monthlyStats: null, recentTransactions: [], yearlyTrends: [] }

  const today = new Date()
  
  const monthlyStats = await prisma.monthlyAggregate.findUnique({
    where: {
      userId_month_year: {
        userId: userId,
        month: today.getMonth() + 1,
        year: today.getFullYear()
      }
    }
  })

  const recentTransactions = await prisma.transaction.findMany({
    where: { userId: userId },
    orderBy: { date: 'desc' },
    take: 10
  })

  const yearlyTrends = await prisma.monthlyAggregate.findMany({
    where: { userId: userId, year: today.getFullYear() },
    orderBy: { month: 'asc' }
  })

  return { monthlyStats, recentTransactions, yearlyTrends }
}