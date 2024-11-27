import { prisma } from "@/lib/prisma";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

type CloudinaryUploadResult = UploadApiResponse;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const POST = async (req: Request, res: Response) => {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const id = formData.get('id') as string;

        if (!file || !id) {
            return Response.json([{ message: 'Dosya ve ya id boş olamaz' }], { status: 400 });
        }
        const buffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);

        const uploadResult: CloudinaryUploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: `profile/images/${id}` },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result as CloudinaryUploadResult);
                }
            );
            uploadStream.end(fileBuffer);
        });
        if (uploadResult) {
            await prisma.user.update({
                where: { id: id },
                data: {
                    image: uploadResult.secure_url,
                },
            })
        }
        return Response.json([{ message: 'Dosya yüklendi', image: uploadResult.secure_url }], { status: 200 });
    } catch (error) {
        console.error('Hata:', error);
        return Response.json([{ message: 'Sunucu hatası' }], { status: 500 });
    }
}


export { POST }