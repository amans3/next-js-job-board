export function formatRelativeTime(date: Date) {
    const now = new Date()

    const differenceInDays = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))

    if(differenceInDays === 0) {
        return `Posted Today`
    } else if (differenceInDays === 1) {
        return `Posted 1 day ago`
    } else {
        return `Posted ${differenceInDays} days ago`
    } 

}