"use client"

import { CopyCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function CopyLinkMenuItem({jobUrl}: {jobUrl: string}) {

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(jobUrl)
            toast.success("URL copied to clipboard")
        } catch (e) {
            console.log(e)
            toast.error("Failed to copy Url")
        }
    }
    
    return (
        <DropdownMenuItem onSelect={handleCopy}>
            <CopyCheckIcon className="size-4" />
            Copy Job Url
        </DropdownMenuItem>
    )
}