export interface IMedicalRecord {
  _id: string
  userId: string
  patientName: string
  relationship: string
  doctorName?: string
  doctorSpecialty?: string
  clinicLocation?: string
  visitDate?: string
  prescriptionDate?: string
  category?: string
  medicinesOrNotes?: string
  imageRef?: {
    url?: string
    thumbnail?: string
    dimensions?: { width?: number; height?: number }
  }
  createdAt: string
  updatedAt: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export async function fetchWithAuth(
  endpoint: string,
  token: string | null,
  options: RequestInit = {}
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.error?.message || 'API request failed.')
  }

  return data
}
