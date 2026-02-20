export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export function formatSalary(salary: string | null): string {
    if (!salary) return 'Competitive'
    return salary
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
}

export function truncate(text: string, length: number): string {
    if (text.length <= length) return text
    return text.slice(0, length) + '...'
}

export const jobCategories = [
    'Technology',
    'Engineering',
    'Marketing',
    'Sales',
    'Finance',
    'Human Resources',
    'Operations',
    'Design',
    'Healthcare',
    'Education',
    'Construction',
    'Hospitality',
]

export const countries = [
    'Egypt',
    'Saudi Arabia',
    'United Arab Emirates',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
    'Jordan',
    'Lebanon',
    'Morocco',
]

export const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Remote',
    'Internship',
]
