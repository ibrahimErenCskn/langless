import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Session } from 'next-auth'
import { signOut } from '@/auth'
import Link from 'next/link'

interface AuthDropdownProps {
    session: Session
}


export default function AuthDropdown({ session }: AuthDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='focus:outline-none'>
                <Avatar>
                    <AvatarImage src={session.user?.image ? session.user.image : ""} />
                    <AvatarFallback className='text-customPrimary'>{session.user?.name?.replace(' ', '').slice(0, 2)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 bg-customPrimary text-white select-none'>
                <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                    <DropdownMenuItem>Profil</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
                <DropdownMenuItem>
                    <form
                        action={async () => {
                            "use server"
                            await signOut()
                        }}
                    >
                        <button type="submit">Çıkış Yap</button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}
