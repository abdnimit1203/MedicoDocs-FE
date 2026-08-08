export type DocumentType = 'visit' | 'prescription' | 'test_report'

export interface ITestResultItem {
  parameter: string
  value: string
  unit?: string
  referenceRange?: string
  flag?: 'NORMAL' | 'HIGH' | 'LOW' | 'ABNORMAL' | string
}

export interface IMedicineItem {
  name: string
  strength?: string
  frequency?: string
  duration?: string
  instructions?: string
}

export interface IMedicalRecord {
  _id: string
  userId: string
  patientName: string
  relationship: string
  documentType?: DocumentType
  doctorName?: string
  doctorSpecialty?: string
  clinicLocation?: string
  visitDate?: string
  prescriptionDate?: string
  effectiveDate?: string
  category?: string
  // Clinical diagnosis/notes/advice text only. Structured medicines live in `medicines` below.
  medicinesOrNotes?: string
  imageRef?: {
    url?: string
    thumbnail?: string
    dimensions?: { width?: number; height?: number }
  }
  medicines?: IMedicineItem[]

  // Extended Test Report fields (testsOrdered/followUpDate are legacy, pre-'visit'-retirement only)
  testName?: string
  labName?: string
  testsOrdered?: string
  followUpDate?: string
  testResults?: ITestResultItem[]

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
    const errorMsg = data?.error?.message || 'API request failed.'
    const error = new Error(errorMsg) as Error & { status?: number }
    error.status = response.status
    throw error
  }

  return data
}
