import { prisma } from "@/lib/prisma";

const getCurrentUser = async ({ id }: { id: string }) => {
    try {
        if (!id) {
            return null;
        }
        const user = await prisma.user.findUnique({
            where: { id: id },
        });
        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        return null;
    }
};

export default getCurrentUser;