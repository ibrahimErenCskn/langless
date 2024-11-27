"use client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { z } from 'zod';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react"
import { useState } from "react"

const LoginSchema = z.object({
    email: z.string().email("Mail Geçersiz"),
    password: z
        .string()
        .min(4, "Şifreniz 3-20 karakter arasında olmalıdır")
        .max(20, "Şifreniz 3-20 karakter arasında olmalıdır"),
});
const RegisterSchema = z.object({
    name: z.string().min(3, "Kullanıcı adı 3 karakterden fazla olmalıdır"),
    email: z.string().email("Mail geçersiz"),
    password: z
        .string()
        .min(4, "Şifreniz 3-20 karakter arasında olmalıdır")
        .max(20, "Şifreniz 3-20 karakter arasında olmalıdır"),
})

type RegisterSchemaType = z.infer<typeof RegisterSchema>;
type LoginSchemaType = z.infer<typeof LoginSchema>;
export default function AuthDialog() {
    const [tab, setTab] = useState("sign-in");
    console.log(tab)
    const { toast } = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset: resetLogin
    } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) });
    const {
        register: registerRegister,
        handleSubmit: handleSubmitRegister,
        formState: { errors: errorsRegister },
        reset: resetRegister
    } = useForm<RegisterSchemaType>({ resolver: zodResolver(RegisterSchema) });
    const onSubmitRegister: SubmitHandler<RegisterSchemaType> = async (data) => {
        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                name: data.name
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        const jsonRes = await res.json()
        if (res.ok) {
            setTab("sign-in")
            toast({
                title: "Kayıt Olundu",
                duration: 1500
            })
        } else {
            toast({
                variant: "destructive",
                title: "Kayıt Olunamadı",
                description: jsonRes[0].message,
                duration: 1500
            })
            resetRegister()
        }
    }

    const onSubmitLogin: SubmitHandler<LoginSchemaType> = async (data) => {
        const res = await signIn("credentials", { email: data.email, password: data.password, redirect: false });
        if (res?.error) {
            toast({
                variant: "destructive",
                title: "Giriş Yapılamadı",
                description: "Lütfen bilgilerinizi kontrol ediniz",
                duration: 1500
            })
        } else {
            toast({
                title: "Giriş Yapıldı",
                duration: 1500
            })
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'secondary'}>Giriş Yap</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#1C1C1C] border-[#1C1C1C]">
                <DialogHeader className="flex items-center justify-center">
                    <DialogTitle>LangLess</DialogTitle>
                </DialogHeader>
                <Tabs value={tab} onValueChange={setTab} defaultValue="sign-in" className="w-full">
                    <TabsList className="w-full flex gap-8 bg-[#1C1C1C] border-[#1C1C1C]">
                        <TabsTrigger value="sign-in" className="text-white w-full hover:border-[1px]">Giriş Yap</TabsTrigger>
                        <TabsTrigger value="sign-up" className="text-white w-full hover:border-[1px]">Kayıt Ol</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sign-in">
                        <div className="flex flex-col gap-4">
                            <form onSubmit={handleSubmit(onSubmitLogin)} className="flex flex-col gap-4">
                                <Input className="bg-[#1C1C1C] border-white/30" type="text" placeholder="Mail" {...register("email")} />
                                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                                <Input className="bg-[#1C1C1C] border-white/30" type="password" placeholder="Şifre" {...register("password")} />
                                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                                <Button variant={'secondary'} type="submit" disabled={errors.email || errors.password ? true : false}>Giriş Yap</Button>
                            </form>
                            <span className="text-center">Ve ya</span>
                            <div className="flex items-center justify-center border-2 rounded-md border-white/30 py-2 cursor-pointer hover:bg-white/10" onClick={() => signIn("google")}>
                                Google İle Giriş Yap
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="sign-up">
                        <div className="flex flex-col gap-4">
                            <form action="" className="flex flex-col gap-4" onSubmit={handleSubmitRegister(onSubmitRegister)}>
                                <Input className="bg-[#1C1C1C] border-white/30" type="text" placeholder="Kullanıcı Adı" {...registerRegister("name")} />
                                {errorsRegister.name && <span className="text-red-500 text-sm">{errorsRegister.name.message}</span>}
                                <Input className="bg-[#1C1C1C] border-white/30" type="text" placeholder="Mail" {...registerRegister("email")} />
                                {errorsRegister.email && <span className="text-red-500 text-sm">{errorsRegister.email.message}</span>}
                                <Input className="bg-[#1C1C1C] border-white/30" type="password" placeholder="Şifre" {...registerRegister("password")} />
                                {errorsRegister.password && <span className="text-red-500 text-sm">{errorsRegister.password.message}</span>}
                                <Button variant={'secondary'} type="submit" disabled={errorsRegister.name || errorsRegister.email || errorsRegister.password ? true : false}>Kayıt Ol</Button>
                            </form>
                            <span className="text-center">Ve ya</span>
                            <div className="flex items-center justify-center border-2 rounded-md border-white/30 py-2 cursor-pointer hover:bg-white/10" onClick={() => signIn("google")}>
                                Google İle Giriş Yap
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog >
    )
}
