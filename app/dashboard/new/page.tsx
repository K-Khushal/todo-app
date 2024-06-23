import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import Link from "next/link";
import prisma from "@/app/lib/db";
import SubmitButton from "@/app/components/submit-button";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from "next/navigation";

export default async function NewNote() {

    const {getUser} = getKindeServerSession();
    const user = await getUser();

    async function handleSubmit(formData: FormData) {
        "use server";

        if (!user) {
            throw new Error('User not found');
        }

        await prisma.note.create({
            data: {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                userId: user?.id as string,
            },
        });

        redirect('/dashboard');
    }

    return (
        <Card>
            <form action={handleSubmit}>
                <CardHeader>
                    <CardTitle>New Note</CardTitle>
                    <CardDescription>
                        Right here you can now create your new notes
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-5">
                    <div className="gap-y-2 flex flex-col">
                        <Label>Title</Label>
                        <Input
                            required
                            type="text"
                            name="title"
                            placeholder="Title for your note"
                        />
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <Label>Description</Label>
                        <Textarea
                            name="description"
                            placeholder="Describe your note as you want"
                            required
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button asChild variant="destructive">
                        <Link href="/dashboard">Cancel</Link>
                    </Button>
                    <SubmitButton/>
                </CardFooter>
            </form>
        </Card>
    )
}