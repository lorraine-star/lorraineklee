/** Format an ISO date string (YYYY-MM-DD) as e.g. "January 5, 2026". */
export function formatDate(value: string | null): string {
	return value
		? new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		: '';
}
