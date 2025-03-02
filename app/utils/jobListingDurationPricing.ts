interface iAppProps {
    days: number
    price: number
    description: string 
}

export const jobListingDurationPricing: iAppProps[] = [
    {
        days: 30,
        price: 99,
        description: "Standard Listing"
    },
    {
        days: 60,
        price: 179,
        description: "Extended Visibility"
    },
    {
        days: 90,
        price: 249,
        description: "Maximum Exposure"
    }
]