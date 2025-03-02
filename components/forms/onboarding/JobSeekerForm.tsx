import { createJobSeeker } from "@/app/actions"
import { jobSeekerSchema } from "@/app/utils/zodSchema"
import { UploadDropzone } from "@/components/custom/UploadThingReexported"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { XIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import PdfImage from "../../../public/pdf.png"
import { useForm } from "react-hook-form"
import { z } from "zod"

export function JobSeekerForm() {
     const [pending, setPending] = useState(false);
    const form = useForm<z.infer<typeof jobSeekerSchema>>({
        resolver:zodResolver(jobSeekerSchema),
        defaultValues: {
            name: "",
            about: "",
            resume: ""
        }
    })

    async function onSubmit(values:z.infer<typeof jobSeekerSchema>) {
        try {
              setPending(true);
              await createJobSeeker(values);
            } catch (error) {
              if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
                console.log("Something went wrong");
              }
            } finally {
              setPending(false);
            }
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                
                />
                <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>About</FormLabel>
                            <FormControl>
                                <Textarea className="resize-none min-h-20" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                
                />
                 <FormField
            control={form.control}
            name="resume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume (PDF)</FormLabel>
                <FormControl>
                  {field.value ? (
                    <div className="relative w-full">
                      <Image
                        src={PdfImage}
                        alt="Resume"
                        width={75}
                        height={75}
                        className="rounded-lg"
                      />
                      <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2" onClick={() => field.onChange("")}>
                        <XIcon className="size-2" />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="resumeUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].url);
                      }}
                      onUploadError={() => {
                        console.log("Something went wrong");
                      }}
                      className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border:primary"
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Submitting.." : "Continue"}
          </Button>

            </form>
        </Form>
    )
}