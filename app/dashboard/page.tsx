import {Button} from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/app/lib/db";
import {Edit, File, Trash} from "lucide-react";
import {Card} from "@/components/ui/card";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {DeleteButton} from "@/app/components/submit-button";
import {revalidatePath} from "next/cache";

async function getNotes(userId: string) {
    const notes = await prisma.note.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return notes;
}

export default async function Dashboard() {
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    const notes = await getNotes(user?.id as string);

    async function handleDelete(formData: FormData) {
        "use server";
        await prisma.note.delete({
            where: {
                id: formData.get('noteId') as string,
            },
        });

        revalidatePath('/dashboard');
    }

    return (
        <div className="grid items-start gap-y-8">
            <div className="flex items-center justify-between px-2">
                <div className="grid gap-1">
                    <h1 className="text-3xl md:text-4xl">Your Notes</h1>
                    <p className="text-lg text-muted-foreground">
                        Here you can see and create new notes
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/new">Create a new Note</Link>
                </Button>
            </div>
            {
                (notes.length == 0) ? (
                    <div
                        className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                            <File className="w-10 h-10 text-primary"/>
                        </div>
                        <h2 className="mt-6 text-xl font-semibold">
                            You dont have any notes created
                        </h2>
                        <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
                            You currently dont have any notes. please create some so that you
                            can see them right here.
                        </p>
                        <Button asChild>
                            <Link href="/dashboard/new">Create a new Note</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-y-4">
                        {notes.map((note, index) => (
                            <Card key={note.id} className="flex items-center justify-between p-4">
                                <div>
                                    <h2 className="font-semibold text-xl text-primary">
                                        {note.title}
                                    </h2>
                                    <p>
                                        {new Intl.DateTimeFormat("en-US", {
                                            dateStyle: "full",
                                        }).format(new Date(note.createdAt))}
                                    </p>
                                </div>
                                <div className="flex gap-x-4">
                                    <Link href={`/dashboard/new/${note.id}`}>
                                        <Button variant="outline" size="icon">
                                            <Edit className="w-4 h-4"/>
                                        </Button>
                                    </Link>
                                    <form action={handleDelete}>
                                        <input type="hidden" name="noteId" value={note.id}/>
                                        <DeleteButton/>
                                    </form>
                                </div>
                            </Card>
                        ))}
                    </div>
                )
            }
        </div>
    );
}