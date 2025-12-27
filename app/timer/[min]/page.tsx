import { Timer } from '@/components/timer/timer'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    min: string
  }>
}

export async function generateMetadata({ params }: PageProps) {
  const { min } = await params
  const minutes = parseInt(min)

  if (isNaN(minutes) || minutes < 1 || minutes > 60) {
    return {
      title: 'Invalid Time Limit',
    }
  }

  return {
    title: `Timer (${minutes} min) - DeepRacer Board`,
    description: `DeepRacer lap time timer with ${minutes} minute limit`,
  }
}

export default async function TimerWithLimitPage({ params }: PageProps) {
  const { min } = await params
  const minutes = parseInt(min)

  if (isNaN(minutes) || minutes < 1 || minutes > 60) {
    notFound()
  }

  return <Timer limitMinutes={minutes} />
}
