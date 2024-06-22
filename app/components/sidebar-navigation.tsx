"use client";

import Link from "next/link";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import {navItems} from "@/app/components/user-navigation";


export default function SidebarNavigation() {

    const path = usePathname();

    return (
        <nav className="grid items-start gap-2">
            {navItems.map((item, index) => (
                <Link href={item.href} key={index}>
                    <span className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        path === item.href && "bg-accent text-accent-foreground"
                    )}>
                        <item.icon className="mr-2 h-4 w-4 text-primary"/>
                        <span>{item.name}</span>
                    </span>
                </Link>
            ))}
        </nav>
    )
}