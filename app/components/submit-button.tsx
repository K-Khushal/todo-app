"use client";

import {useFormStatus} from "react-dom";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {Trash} from "lucide-react";

export default function SubmitButton() {
    const {pending} = useFormStatus();
    return (
        <>
            {
                pending ? (
                    <Button disabled className="w-fit">
                        <Loader2 className="mr-2 w-4 h-4 animate-spin"/>
                        Please wait...
                    </Button>
                ) : (
                    <Button type="submit" className="w-fit">Save now</Button>
                )
            }
        </>
    );
}

export function DeleteButton() {
    const {pending} = useFormStatus();

    return (
        <>
            {pending ? (
                <Button variant={"destructive"} size="icon" disabled>
                    <Loader2 className="h-4 w-4 animate-spin"/>
                </Button>
            ) : (
                <Button variant={"destructive"} size="icon" type="submit">
                    <Trash className="h-4 w-4"/>
                </Button>
            )}
        </>
    );
}