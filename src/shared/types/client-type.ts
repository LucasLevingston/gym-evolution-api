export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  imageUrl?: string
  totalSpent: number
  tasks: Task[]
  isActive: boolean
  latestPlanName?: string
}

export interface Task {
  id: string
  type: 'TRAINING' | 'DIET' | 'FEEDBACK' | 'CONSULTATION' | 'RETURN'
  title: string
  description: string
  clientName: string
  clientId: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  purchaseId: string
  featureId: string
  linkToResolve?: string
  dueDate?: string | null
}
