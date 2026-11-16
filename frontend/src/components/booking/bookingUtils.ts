export function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function dateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function formatPrice(price: string | number): string {
  const num = Number(price)
  if (Number.isNaN(num)) return `${price}€`
  return Number.isInteger(num) ? `${num}€` : `${num.toFixed(0)}€`
}

export function formatSlotTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Paris',
    })
  } catch {
    return iso.slice(11, 16)
  }
}
