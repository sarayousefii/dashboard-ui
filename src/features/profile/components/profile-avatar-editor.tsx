
'use client';

import {
    ImagePlus,
    Loader2,
    Trash2,
    UserRound,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
    useRef,
    useState,
    type ChangeEvent,
} from 'react';

import { Button } from '@/components/ui/button';

import { MAX_AVATAR_DATA_URL_LENGTH } from '@/shared/lib/avatar';

interface ProfileAvatarEditorProps {
  value: string | null;
  displayName: string;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

const MAX_SOURCE_FILE_SIZE = 5 * 1024 * 1024;

const IMAGE_DIMENSIONS = [512, 384, 256, 192];
const IMAGE_QUALITIES = [0.82, 0.72, 0.62, 0.52];

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

function canvasToWebp(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== 'image/webp') {
          reject(new Error('IMAGE_PROCESSING_FAILED'));
          return;
        }

        resolve(blob);
      },
      'image/webp',
      quality,
    );
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('IMAGE_PROCESSING_FAILED'));
      }
    };

    reader.onerror = () => {
      reject(new Error('IMAGE_PROCESSING_FAILED'));
    };

    reader.readAsDataURL(blob);
  });
}

async function compressAvatar(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);

  try {
    const originalMaxDimension = Math.max(
      bitmap.width,
      bitmap.height,
    );

    for (const dimension of IMAGE_DIMENSIONS) {
      const scale = Math.min(
        1,
        dimension / originalMaxDimension,
      );

      const width = Math.max(
        1,
        Math.round(bitmap.width * scale),
      );

      const height = Math.max(
        1,
        Math.round(bitmap.height * scale),
      );

      const canvas = document.createElement('canvas');

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('IMAGE_PROCESSING_FAILED');
      }

      context.drawImage(
        bitmap,
        0,
        0,
        width,
        height,
      );

      for (const quality of IMAGE_QUALITIES) {
        const blob = await canvasToWebp(canvas, quality);
        const dataUrl = await blobToDataUrl(blob);

        if (dataUrl.length <= MAX_AVATAR_DATA_URL_LENGTH) {
          return dataUrl;
        }
      }
    }

    throw new Error('IMAGE_TOO_LARGE');
  } finally {
    bitmap.close();
  }
}

export function ProfileAvatarEditor({
  value,
  displayName,
  onChange,
  disabled = false,
}: ProfileAvatarEditorProps) {
  const t = useTranslations('profile.avatar');

  const inputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(t('invalidFormat'));
      event.target.value = '';
      return;
    }

    if (file.size > MAX_SOURCE_FILE_SIZE) {
      setError(t('fileTooLarge'));
      event.target.value = '';
      return;
    }

    setIsProcessing(true);

    try {
      const compressedImage = await compressAvatar(file);
      onChange(compressedImage);
    } catch (processingError) {
      const isTooLarge =
        processingError instanceof Error &&
        processingError.message === 'IMAGE_TOO_LARGE';

      setError(
        isTooLarge
          ? t('imageTooLarge')
          : t('processingFailed'),
      );
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  return (
    <div className="flex min-w-0 flex-col items-center gap-5 sm:flex-row sm:items-center">
      <div className="relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 text-primary shadow-sm ring-4 ring-primary/5 sm:size-32">
        {value ? (
          <Image
            src={value}
            alt={displayName}
            width={128}
            height={128}
            unoptimized
            className="size-full object-cover"
          />
        ) : (
          <span className="text-2xl font-bold">
            {initials || <UserRound className="size-10" />}
          </span>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/75">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-3 text-center sm:text-start">
        <div className="space-y-1">
          <p className="text-sm font-semibold">
            {t('title')}
          </p>

          <p className="text-xs leading-5 text-muted-foreground">
            {t('description')}
          </p>

          <p className="text-[11px] leading-5 text-muted-foreground">
            {t('requirements')}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleFileChange}
          disabled={disabled || isProcessing}
        />

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || isProcessing}
          >
            <ImagePlus className="size-4" />
            {value ? t('change') : t('choose')}
          </Button>

          {value && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                onChange(null);
                setError(null);
              }}
              disabled={disabled || isProcessing}
            >
              <Trash2 className="size-4" />
              {t('remove')}
            </Button>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="text-xs leading-5 text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
