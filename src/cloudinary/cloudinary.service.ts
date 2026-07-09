import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CloudinaryService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME', 'placeholder'),
      api_key: this.config.get('CLOUDINARY_API_KEY', 'placeholder'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET', 'placeholder'),
      secure: true,
    });
  }

  async uploadImage(
    file: { buffer: Buffer; mimetype: string },
    folder?: string,
  ): Promise<UploadApiResponse> {
    const uploadFolder =
      folder ?? this.config.get('CLOUDINARY_FOLDER') ?? 'dhcenter';

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: uploadFolder, resource_type: 'image' },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error('Upload failed'));
            return;
          }
          resolve(uploadResult);
        },
      );
      stream.end(file.buffer);
    });

    await this.prisma.mediaAsset.create({
      data: {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        folder: uploadFolder,
      },
    });

    return result;
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
    await this.prisma.mediaAsset.deleteMany({ where: { publicId } });
  }
}
