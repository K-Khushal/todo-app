import SidebarNavigation from "@/app/components/sidebar-navigation";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from "next/navigation";
import prisma from "@/app/lib/db";


async function getUserData({id, firstName, lastName, email, profilePicture}: {
    id: string,
    firstName: string | undefined | null,
    lastName: string | undefined | null,
    email: string,
    profilePicture: string | undefined | null
}) {
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            stripeCustomerId: true,
        }
    });

    if (!user) {
        const name = `${firstName ?? ""} ${lastName ?? ""}`;
        await prisma.user.create({
            data: {
                id: id,
                email: email,
                name: name,
            }
        });
    }
}


export default async function Layout({children}: { children: React.ReactNode }) {

    const {isAuthenticated, getUser} = getKindeServerSession();

    if (!(await isAuthenticated())) {
        redirect("/");
    }

    const user = await getUser();

    await getUserData({
        id: user?.id as string,
        firstName: user?.given_name as string,
        lastName: user?.family_name as string,
        email: user?.email as string,
        profilePicture: user?.picture as string,
    })

    return (
        <div className="flex flex-col space-y-6 mt-10">
            <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
                <aside className="hidden w-[200px] flex-col md:flex">
                    <SidebarNavigation/>
                </aside>
                <main>{children}</main>
            </div>
        </div>
    )
}