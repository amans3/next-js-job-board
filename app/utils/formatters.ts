const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
})

export function formatCurrency(amount: number) {
    return CURRENCY_FORMATTER.format(amount)
}

const NUMBER_FORMATTER = new Intl.NumberFormat(undefined, {
    unitDisplay: "short"
})

export function formatNumber(number: number) {
    return NUMBER_FORMATTER.format(number)
}