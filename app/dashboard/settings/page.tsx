import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent, SelectGroup,
    SelectItem, SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input"
import {Label} from "@radix-ui/react-menu";
import prisma from "@/app/lib/db";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import SubmitButton from "@/app/components/submit-button";

async function getUserData(userId: string) {
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            name: true,
            email: true,
            colorScheme: true,
        },
    })

    return data;
}

export default async function Settings() {

    const {getUser} = getKindeServerSession();

    const user = await getUser();

    const userData = await getUserData(user?.id as string);

    async function saveSettings(formData: FormData) {
        "use server";
        await prisma.user.update({
            where: {
                id: user?.id as string,
            },
            data: {
                name: formData.get("name") as string | undefined,
                colorScheme: formData.get("colorScheme") as string | undefined,
            },
        });
    }

    return (
        <div className="grid items-start gap-8">
            <div className="flex items-center justify-between px-2">
                <div className="grid gap-1">
                    <h1 className="text-3xl md:text-4xl">Settings</h1>
                    <p className="text-lg text-muted-foreground">Your Profile settings</p>
                </div>
            </div>
            <Card>
                <form action={saveSettings}>
                    <CardHeader>
                        <CardTitle>General Data</CardTitle>
                        <CardDescription>
                            Please provide general information about yourself. Please dont forget to save
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label>Your Name</Label>
                                <Input
                                    name="name"
                                    type="text"
                                    id="name"
                                    placeholder="Your Name"
                                    defaultValue={userData?.name as string | undefined}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Your Email</Label>
                                <Input
                                    name="email"
                                    type="email"
                                    id="email"
                                    placeholder="Your Email"
                                    disabled
                                    defaultValue={userData?.email as string}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Color Scheme</Label>
                                <Select name="colorScheme" defaultValue={userData?.colorScheme as string}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a color"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="theme-green">Green</SelectItem>
                                        <SelectItem value="theme-blue">Blue</SelectItem>
                                        <SelectItem value="theme-violet">Violet</SelectItem>
                                        <SelectItem value="theme-yellow">Yellow</SelectItem>
                                        <SelectItem value="theme-orange">Orange</SelectItem>
                                        <SelectItem value="theme-red">Red</SelectItem>
                                        <SelectItem value="theme-rose">Rose</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton/>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}