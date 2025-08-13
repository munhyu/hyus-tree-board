const compressAndResizeImage = (
  file: File,
  maxWidth: number = 200,
  maxHeight: number = 200,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // 1. 파일을 데이터 URL로 읽기
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error("Failed to read file"));
        return;
      }

      const img = new Image();
      img.src = event.target.result as string;

      img.onload = () => {
        // 2. 캔버스 생성 및 이미지 크기 조절 계산
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // 비율을 유지하며 최대 너비/높이에 맞게 크기 조절
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // 3. 캔버스에 이미지 그리기
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // 4. 캔버스 내용을 새로운 파일(Blob)로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Blob을 다시 File 객체로 변환하여 반환
              const newFile = new File([blob], file.name, {
                type: blob.type,
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              reject(new Error("Canvas to Blob conversion failed."));
            }
          },
          "image/jpeg", // JPEG 형식으로 변환 (파일 크기 효율적)
          quality // 압축 품질 설정
        );
      };

      img.onerror = (error) => {
        reject(new Error("Image loading failed"));
      };
    };

    reader.onerror = (error) => {
      reject(new Error("File reading failed"));
    };
  });
};

export default compressAndResizeImage;
