import React from 'react'
import AuthDialog from './authDialog'
import { auth } from '@/auth'
import AuthDropdown from './authDropdown'
import Link from 'next/link'

export default async function Header() {
    const session = await auth()

    return (
        <div className='w-full h-16 border-b-[1px] sticky top-0 flex items-center justify-between px-4'>
            <Link href="/" className='text-2xl font-bold select-none'>
                LangLess
            </Link>
            <div>
                {
                    session?.user ? (
                        <AuthDropdown session={session} />
                    ) : <AuthDialog />
                }
            </div>
        </div>
    )
}
