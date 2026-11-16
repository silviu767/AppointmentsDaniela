export const DAYS_RO = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică']

export const STATUS_LABELS: Record<string, string> = {
  pending: 'În așteptare',
  confirmed: 'Confirmată',
  completed: 'Finalizată',
  cancelled_by_admin: 'Anulată (Admin)',
  cancelled_by_client: 'Anulată (Client)',
  no_show: 'Neprezentare',
}

export function formatDateTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Paris',
    })
  } catch {
    return iso
  }
}

export function isSameDayParis(iso: string): boolean {
  try {
    const d = new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' })
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' })
    return d === today
  } catch {
    return false
  }
}
