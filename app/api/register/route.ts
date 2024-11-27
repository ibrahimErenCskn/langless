import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

const POST = async (req: Request, res: Response) => {
    const { email, password, name } = await req.json()
    if (!email || !name || !password) {
        return Response.json([{ message: 'Mail Veya Kullanıcı Adı Boş Olamaz' }], { status: 400 });
    }
    try {
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }] },
        });

        if (existingUser) {
            return Response.json([{ message: 'Mail daha önce kullanılmış' }], { status: 409 });
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });
        return Response.json([{ message: 'Kullanıcı oluşturuldu', user: newUser }], { status: 201 });
    } catch (error) {
        console.error('Error registering user:', error);
        return Response.json([{ message: 'Sunucu hatası' }], { status: 500 });
    }
}

export { POST }