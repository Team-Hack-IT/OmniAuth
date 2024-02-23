import {z} from 'zod';



export const IndividualOnboardingSchema = z.object({
    firstName: z.string().min(2, { message: "First name should be at least 2 characters" })
    .max(30, { message: "First Name should not exceed 30 characters" }),
    lastName: z.string().min(2, { message: "Last name should be at least 2 characters" })
    .max(30, { message: "Last name should not exceed 30 characters" }),
    email: z.string().email({ message: "Invalid email" }),
    country: z.string().min(3, { message: "Country is required" }),
    location: z.string().min(3,{ message: "Location is required" }),
    channel: z.string().min(3, { message: "Channel is required" }),
    phone: z.string().min(3, { message: "Phone is required" }),

})

export const PhoneSchema = z.object({
    phone: z.string().min(3, { message: "Phone is required" })

})

export const BusinessOnboardingSchema = z.object({
    businessName: z.string().min(2, { message: "Business name should be at least 2 characters" })
    .max(30, { message: "Business Name should not exceed 30 characters" }),
    email: z.string().email({ message: "Invalid email" }),
    organizationCountry: z.string().min(3, { message: "Country is required" }),
    organizationSector: z.string().min(3, { message: "Sector is required" }),
    channel: z.string().min(3, { message: "Channel is required" }),
    phone: z.string().min(3, { message: "Phone is required" }),
})