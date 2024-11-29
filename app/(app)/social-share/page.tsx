'use client'
import React, { useEffect, useRef, useState } from 'react'
import { CldImage } from 'next-cloudinary';

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

const SocialSharePage = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
useEffect(() => {
  if(uploadedImage){
    setIsTransforming(true)
  }
},[selectedFormat,uploadedImage])

const handleFileUpload= async (event :React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if(!file) return ;
  setIsUploading(true)
  const formData = new FormData();
  formData.append("file",file)

  try {
    const response = await fetch("/api/image-upload",{
      method:"POST",
      body:formData
    })

    if(!response.ok) throw new Error("Failed to upload image")

      const data = await response.json()
      setUploadedImage(data.publicId)
      

  } catch (error) {
    console.log(error)
    alert("Failed to upload image")
  }finally{
    setIsUploading(false)
  }

}

const handleDownload = () => {
  if(!imageRef.current) return;

  fetch(imageRef.current.src)
  .then((response) => response.blob())
  .then((blob) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href=url;
    link.download ="image.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
  })
}

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-[#17153B] rounded-lg shadow-lg">
  <h1 className="text-4xl font-extrabold mb-8 text-center text-[#C8ACD6]">
    Social Media Image Creator
  </h1>

  <div className="card bg-[#2E236C] border border-[#433D8B] rounded-lg shadow-md">
    <div className="card-body p-6">
      <h2 className="card-title text-2xl font-semibold mb-4 text-[#C8ACD6]">
        Upload an Image
      </h2>

      <div className="form-control mb-6">
        <label className="label mb-2">
          <span className="label-text text-[#C8ACD6]">Choose an image file:</span>
        </label>
        <input
          type="file"
          onChange={handleFileUpload}
          className="file-input file-input-bordered w-full bg-[#433D8B] text-[#C8ACD6] border-[#C8ACD6]"
        />
      </div>

      {isUploading && (
        <div className="mt-4">
          <progress className="progress w-full bg-[#433D8B]"></progress>
          <p className="text-sm text-[#C8ACD6] text-center mt-2">
            Uploading your image, please wait...
          </p>
        </div>
      )}

      {uploadedImage && (
        <div className="mt-8">
          <h2 className="card-title text-2xl font-semibold mb-4 text-[#C8ACD6]">
            Select Social Media Format
          </h2>
          <div className="form-control">
            <select
              className="select select-bordered w-full bg-[#433D8B] text-[#C8ACD6] border-[#C8ACD6]"
              value={selectedFormat}
              onChange={(e) =>
                setSelectedFormat(e.target.value as SocialFormat)
              }
            >
              {Object.keys(socialFormats).map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-8 relative bg-[#2E236C] border border-[#433D8B] rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4 text-[#C8ACD6]">
              Preview:
            </h3>
            <div className="flex justify-center items-center">
              {isTransforming && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#17153B] bg-opacity-70 z-10 rounded-lg">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              )}
              <CldImage
                width={socialFormats[selectedFormat].width}
                height={socialFormats[selectedFormat].height}
                src={uploadedImage}
                sizes="100vw"
                alt="Transformed image"
                crop="fill"
                aspectRatio={socialFormats[selectedFormat].aspectRatio}
                gravity="auto"
                ref={imageRef}
                onLoad={() => setIsTransforming(false)}
                className="rounded-md border border-[#C8ACD6]"
              />
            </div>
          </div>

          <div className="card-actions justify-end mt-6">
            <button
              className="btn bg-[#433D8B] text-[#C8ACD6] border-[#C8ACD6] hover:bg-[#2E236C] focus:ring focus:ring-[#C8ACD6]/40"
              onClick={handleDownload}
            >
              Download for {selectedFormat}
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
</div>



  )
}

export default SocialSharePage
