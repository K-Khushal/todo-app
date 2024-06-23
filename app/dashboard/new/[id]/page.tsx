import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import SubmitButton from "@/app/components/submit-button";
import prisma from "@/app/lib/db";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";


async function getNoteById(id: string, userId: string) {
    const note = await prisma.note.findUnique({
        where: {
            id: id,
            userId: userId,
        },
        select: {
            id: true,
            title: true,
            description: true,
        }
    });

    return note;
}

export default async function NotePage({params: {id}}: { params: { id: string } }) {
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    const data = await getNoteById(id as string, user?.id as string);

    async function handleSubmit(formData: FormData) {
        "use server";

        if (!user) {
            throw new Error('User not found');
        }

        await prisma.note.update({
            where: {
                id: data?.id as string,
                userId: user?.id as string,
            },
            data: {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
            },
        });

        revalidatePath('/dashboard');

        redirect('/dashboard');
    }

    return (
        <div>
            <Card>
                <form action={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Edit Note</CardTitle>
                        <CardDescription>
                            Right here you can now edit your notes
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
                                defaultValue={data?.title}
                            />
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <Label>Description</Label>
                            <Textarea
                                name="description"
                                placeholder="Describe your note as you want"
                                required
                                defaultValue={data?.description}
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
        </div>
    )
}