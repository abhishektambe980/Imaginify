"use client";

import { useToast } from "@/components/ui/use-toast"
import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget } from "next-cloudinary"
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useEffect, useState } from "react";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
}

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type
}: MediaUploaderProps) => {
  const { toast } = useToast();
  const [cloudinaryConfig, setCloudinaryConfig] = useState<{
    cloudName: string;
    uploadPreset: string;
  } | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/cloudinary/config');
        const config = await response.json();
        setCloudinaryConfig(config);
      } catch (error) {
        console.error('Error fetching Cloudinary config:', error);
      }
    };

    fetchConfig();
  }, []);

  const onUploadSuccessHandler = (result: any) => {
    const imageData = {
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url,
      transformationType: type,
      title: result?.info?.original_filename || 'Untitled',
    };

    setImage((prevState: any) => ({
      ...prevState,
      ...imageData
    }));

    onValueChange(result?.info?.public_id);

    toast({
      title: 'Image uploaded successfully',
      description: '1 credit was deducted from your account',
      duration: 5000,
      className: 'success-toast' 
    });
  }

  const onUploadErrorHandler = (error: any) => {
    console.error("Upload error:", error);
    console.log("Cloudinary config:", cloudinaryConfig);
    
    toast({
      title: 'Something went wrong while uploading',
      description: error?.message || 'Please try again',
      duration: 5000,
      className: 'error-toast' 
    })
  }

  if (!cloudinaryConfig) {
    return <div>Loading...</div>;
  }

  return (
    <CldUploadWidget
      uploadPreset={cloudinaryConfig.uploadPreset}
      options={{
        multiple: false,
        resourceType: "image",
        maxFiles: 1,
        sources: ["local", "url", "camera"],
        clientAllowedFormats: ["png", "jpeg", "jpg"]
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3 className="h3-bold text-dark-600">
            Original
          </h3>

          {publicId ? (
            <>
              <div className="cursor-pointer overflow-hidden rounded-[10px]">
                <CldImage
                  width={getImageSize(type, image, "width")}
                  height={getImageSize(type, image, "height")}
                  src={publicId}
                  alt="image"
                  sizes={"(max-width: 767px) 100vw, 50vw"}
                  placeholder={dataUrl as PlaceholderValue}
                  className="media-uploader_cldImage"
                />
              </div>
            </>
          ) : (
            <div className="media-uploader_content" onClick={() => open()}>
              <div className="media-uploader_cta">
                <Image
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={24}
                  height={24}
                />
                <p className="p-14-medium">Click here to upload image</p>
              </div>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  )
}

export default MediaUploader