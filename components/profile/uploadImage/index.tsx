"use client";

import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';

export default function UploadImage() {
    const { toast } = useToast();
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const { data: session, update } = useSession();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Görsel önizleme için
        }
    };

    const handleUpload = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append("file", image);
        formData.append("id", session?.user.id as string);

        const response = await fetch("/api/upload-profile-images", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            //Burda session'i güncellemesi yapılıyor ancak dbden çekilerek yapılıyor bunu auyh.jsde düzeltebilirsin.
            await update({ ...session, image: data[0].image });
            toast({
                title: "Bilgi",
                description: data[0].message,
                duration: 1500
            })
        } else {
            toast({
                title: "Hata",
                description: "Resim yükleme hatası",
                variant: "destructive",
                duration: 1500
            })
        }
    };
    return (
        <div className='flex items-center justify-center'>
            <div>
                <div className=''>
                    <Label htmlFor="image">Profile Resmi</Label>
                    <Input id="image" type="file" onChange={handleImageChange} accept="image/*" className='bg-red-500 text-white' />
                </div>
                <Button variant={"secondary"} onClick={handleUpload}>Değişiklikleri Kaydet</Button>
            </div>
        </div>
    )
}
