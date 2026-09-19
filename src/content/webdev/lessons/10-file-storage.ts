import type { Lesson } from '@/types';

export const fileStorageLesson: Lesson = {
  id: 'file-storage',
  slug: 'file-storage',
  title: 'File Storage',
  description:
    'Handle file uploads securely — local storage vs cloud storage (S3), image processing, CDN integration, security considerations, and production-ready upload implementation.',
  category: 'Backend Systems',
  order: 10,
  difficulty: 'intermediate',
  estimatedTime: 25,
  content: `File uploads are common in web applications — profile photos, document uploads, product images, user-generated content. Implementing them correctly requires understanding storage, security, and delivery.

---

## Local Storage vs Cloud Storage

**Local storage:** Files are saved on the same server running your application.

\`\`\`
/var/www/uploads/
  avatars/
    user-123-1234567890.jpg
    user-456-1234567891.png
  documents/
    doc-789-1234567892.pdf
\`\`\`

**Problems with local storage in production:**
- When you deploy a new version, the new server container does not have the old uploads
- If you have multiple servers (horizontal scaling), files only exist on one server
- If the server crashes, files are lost
- No automatic CDN — every request hits your app server

**Cloud storage (AWS S3, Cloudflare R2, Google Cloud Storage):**
- Files are stored independently of your servers
- Accessible from any server in your cluster
- Persists across deployments
- Integrates with CDNs automatically
- Cheap (S3: ~$0.023/GB/month)

**Rule:** Use local storage for development. Use S3 (or equivalent) for production.

---

## File Upload Flow

There are two main upload patterns:

**Pattern 1: Upload through your server**
\`\`\`
Browser → POST /api/upload (multipart form) → Your Server → AWS S3
\`\`\`

Simple, gives full control, but your server bandwidth is consumed by every upload.

**Pattern 2: Presigned URLs (direct upload)**
\`\`\`
Browser → GET /api/upload-url → Your Server generates presigned URL
                                                    ↓
Browser → PUT {presignedUrl} (file goes directly to S3)
                    ↓
Browser → POST /api/confirm-upload (save URL to DB)
\`\`\`

Better for large files — your server never receives the actual file bytes.

---

## Implementation: Upload Through Server

\`\`\`typescript
// Using multer for multipart form parsing
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';  // image processing
import path from 'path';
import crypto from 'crypto';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Configure multer to store in memory (not disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Only allow images
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
      return;
    }
    cb(null, true);
  },
});

// Upload handler
async function uploadAvatar(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // 1. Process image: resize and convert to WebP
  const processedImage = await sharp(req.file.buffer)
    .resize(400, 400, { fit: 'cover', position: 'center' })
    .webp({ quality: 85 })
    .toBuffer();

  // 2. Generate unique filename (never trust client filename)
  const filename = \`avatars/\${req.user.id}-\${crypto.randomUUID()}.webp\`;

  // 3. Upload to S3
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: filename,
    Body: processedImage,
    ContentType: 'image/webp',
    CacheControl: 'max-age=31536000', // 1 year cache (content-addressed)
  }));

  // 4. Construct the URL
  const url = \`https://\${process.env.CDN_DOMAIN}/\${filename}\`;

  // 5. Save URL to database
  await usersRepository.updateAvatar(req.user.id, url);

  // 6. Delete old avatar from S3 (if exists)
  if (req.user.avatarUrl) {
    const oldKey = req.user.avatarUrl.split('.com/')[1];
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: oldKey,
    })).catch(console.error); // non-critical, don't fail the request
  }

  res.json({ url });
}

// Route
router.post('/upload/avatar',
  authenticate,
  upload.single('avatar'),
  uploadAvatar
);
\`\`\`

---

## Presigned URLs (Direct Upload)

\`\`\`typescript
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';

// Step 1: Generate presigned URL
async function getUploadUrl(req: Request, res: Response) {
  const { filename, contentType } = req.body;

  // Validate content type server-side
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(contentType)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }

  // Generate the key (never trust client-provided filename directly)
  const extension = contentType.split('/')[1];
  const key = \`uploads/\${req.user.id}/\${crypto.randomUUID()}.\${extension}\`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    ContentType: contentType,
    ContentLengthRange: [1, 5 * 1024 * 1024], // 1 byte to 5MB
  });

  // URL expires in 5 minutes
  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  res.json({ presignedUrl, key });
}

// Step 2: Client uploads directly to S3
// In React:
async function uploadFile(file: File) {
  // Get presigned URL from your server
  const { presignedUrl, key } = await fetch('/api/upload-url', {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
    headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
  }).then(r => r.json());

  // Upload directly to S3
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  // Tell your server the upload is complete
  await fetch('/api/confirm-upload', {
    method: 'POST',
    body: JSON.stringify({ key }),
    headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
  });
}

// Step 3: Confirm upload and save to database
async function confirmUpload(req: Request, res: Response) {
  const { key } = req.body;

  // Validate the key belongs to this user
  if (!key.startsWith(\`uploads/\${req.user.id}/\`)) {
    return res.status(403).json({ error: 'Invalid key' });
  }

  const url = \`https://\${process.env.CDN_DOMAIN}/\${key}\`;
  await usersRepository.updateAvatar(req.user.id, url);

  res.json({ url });
}
\`\`\`

---

## Image Processing

Always process images server-side before storage:

\`\`\`typescript
import sharp from 'sharp';

// Profile avatar
const avatar = await sharp(inputBuffer)
  .resize(400, 400, { fit: 'cover' })  // square crop
  .webp({ quality: 85 })
  .toBuffer();

// Product image (multiple sizes)
const [thumbnail, medium, large] = await Promise.all([
  sharp(inputBuffer).resize(200, 200).webp({ quality: 80 }).toBuffer(),
  sharp(inputBuffer).resize(600, 600).webp({ quality: 85 }).toBuffer(),
  sharp(inputBuffer).resize(1200, 1200).webp({ quality: 90 }).toBuffer(),
]);

// Document (no image processing — just validate and store)
// For PDFs: validate mime type, check file magic bytes

// Strip EXIF data (contains GPS location, device info — privacy concern)
const safeImage = await sharp(inputBuffer)
  .rotate()  // auto-rotate based on EXIF orientation
  .withMetadata(false)  // strip all metadata
  .webp()
  .toBuffer();
\`\`\`

---

## Security Considerations

### 1. Validate File Type (Do Not Trust the Extension)

\`\`\`typescript
import { fileTypeFromBuffer } from 'file-type';

async function validateFileType(buffer: Buffer, allowedTypes: string[]) {
  // file-type reads the actual file signature (magic bytes), not the extension
  const type = await fileTypeFromBuffer(buffer);

  if (!type || !allowedTypes.includes(type.mime)) {
    throw new ValidationError(\`Invalid file type. Allowed: \${allowedTypes.join(', ')}\`);
  }

  return type;
}

// Example: rename image.jpg to malware.jpg.exe — the extension is wrong
// but fileTypeFromBuffer reads the actual file bytes and returns 'image/jpeg'
// This prevents someone uploading a PHP script named as image.jpg
\`\`\`

### 2. Limit File Size

\`\`\`typescript
// In multer config:
limits: { fileSize: 5 * 1024 * 1024 } // 5MB

// Check before processing:
if (file.size > 5 * 1024 * 1024) {
  throw new ValidationError('File too large. Maximum 5MB.');
}
\`\`\`

### 3. Never Store User Files in a Public Bucket with Predictable Names

\`\`\`typescript
// BAD: predictable, enumerable
const key = \`avatars/user-\${userId}.jpg\`;

// GOOD: UUID makes it unpredictable
const key = \`avatars/\${userId}/\${crypto.randomUUID()}.webp\`;
\`\`\`

### 4. Serve Files Through CDN, Not Directly from S3

\`\`\`
S3 URL:   https://bucket.s3.amazonaws.com/avatars/abc.webp
          (origin only — slow for users far from your S3 region)

CDN URL:  https://cdn.yourapp.com/avatars/abc.webp
          (served from edge closest to user)
\`\`\`

Set up CloudFront (AWS CDN) in front of your S3 bucket. The bucket can be private — CloudFront serves the files.

---

## CDN Integration

\`\`\`typescript
// Environment configuration
const config = {
  // Files are stored in S3
  s3: {
    bucket: process.env.S3_BUCKET,
    region: process.env.AWS_REGION,
  },
  // Files are served from CDN
  cdn: {
    domain: process.env.CDN_DOMAIN,  // cdn.yourapp.com
  },
};

// Always construct URLs using CDN domain
function buildFileUrl(key: string): string {
  return \`https://\${config.cdn.domain}/\${key}\`;
}

// In database, store only the key (not the full URL)
// This lets you change CDN provider without updating every row
// Store: 'avatars/user-123/abc.webp'
// Serve: 'https://cdn.yourapp.com/avatars/user-123/abc.webp'
\`\`\`

---

## Upload Progress (React)

\`\`\`typescript
function FileUpload({ onUploadComplete }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    // Get presigned URL
    const { presignedUrl, key } = await getUploadUrl(file);

    // Upload with XMLHttpRequest for progress tracking
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
      xhr.addEventListener('load', () => resolve());
      xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });

    // Confirm
    const { url } = await confirmUpload(key);
    setUploading(false);
    onUploadComplete(url);
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && (
        <div>
          <div style={{ width: \`\${progress}%\`, background: 'blue', height: 4 }} />
          <span>{progress}%</span>
        </div>
      )}
    </div>
  );
}
\`\`\``,
  codeExamples: [
    {
      title: 'Complete Upload Route with Error Handling',
      code: `// upload.router.ts
import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '@/middleware/authenticate';
import { uploadController } from './upload.controller';

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return cb(Object.assign(new Error('Invalid file type'), { status: 400 }));
    }
    cb(null, true);
  },
});

const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB for docs
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(Object.assign(new Error('Only PDF files allowed'), { status: 400 }));
    }
    cb(null, true);
  },
});

const router = Router();

router.post('/avatar', authenticate, imageUpload.single('avatar'), uploadController.uploadAvatar);
router.post('/document', authenticate, documentUpload.single('document'), uploadController.uploadDocument);
router.post('/presigned-url', authenticate, uploadController.getPresignedUrl);
router.post('/confirm', authenticate, uploadController.confirmUpload);
router.delete('/:key', authenticate, uploadController.deleteFile);

export { router as uploadRouter };`,
      explanation:
        'Different multer configurations for different file types. Authentication on all routes. The controller handles S3 interaction and database updates.',
    },
  ],
  commonMistakes: [
    'Storing uploaded files on the application server — lost on redeployment, broken with multiple servers',
    'Trusting the file extension to determine type — use file-type library to check actual file bytes',
    'Not limiting file size — users can upload gigabyte files and crash your server',
    'Not processing images before storage — raw photos can be 10MB; resize to what you need',
    'Not stripping EXIF data — photos contain GPS coordinates, device info, and other private metadata',
    'Using predictable filenames — makes files enumerable (user-1.jpg, user-2.jpg)',
    'Serving files directly from S3 origin — bypasses CDN, slow for distant users',
  ],
  interviewQuestions: [
    {
      question: 'What is a presigned URL and why would you use it?',
      answer:
        'A presigned URL is a temporary URL with embedded credentials that allows a client to upload a file directly to S3 without going through your server. Your server generates the URL (which includes a signature valid for a short time), the client uploads the file directly to S3, then notifies your server that the upload is complete. Benefits: your server\'s bandwidth is not consumed by file uploads, and uploads are faster because they go directly to S3.',
      difficulty: 'intermediate',
    },
    {
      question: 'What security checks should you perform on file uploads?',
      answer:
        'Validate file type using magic bytes (not the extension) — a PHP script can be renamed to image.jpg. Limit file size to prevent resource exhaustion. Never use user-provided filenames (use UUID). Store with unpredictable paths to prevent enumeration. Strip EXIF metadata (GPS location) from images. Serve through CDN, not directly through your app server. For non-image files, consider antivirus scanning.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'implement-upload-service',
      title: 'Implement a File Upload Service',
      description:
        'Write the uploadService with two methods: uploadImage (takes a Buffer and userId, processes with sharp, uploads to S3, returns the CDN URL) and deleteFile (takes a key, deletes from S3).',
      starterCode: `// upload.service.ts
import sharp from 'sharp';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const uploadService = {
  async uploadImage(buffer: Buffer, userId: string, folder: string): Promise<string> {
    // TODO:
    // 1. Process with sharp (resize to max 1200px, convert to webp)
    // 2. Generate unique key: {folder}/{userId}/{uuid}.webp
    // 3. Upload to S3
    // 4. Return CDN URL
  },

  async deleteFile(key: string): Promise<void> {
    // TODO: delete from S3
  },
};`,
      solution: `// upload.service.ts
import sharp from 'sharp';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const uploadService = {
  async uploadImage(buffer: Buffer, userId: string, folder: string): Promise<string> {
    // 1. Process image
    const processed = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .withMetadata(false)  // strip EXIF
      .webp({ quality: 85 })
      .toBuffer();

    // 2. Generate unique key
    const key = \`\${folder}/\${userId}/\${crypto.randomUUID()}.webp\`;

    // 3. Upload to S3
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: processed,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    }));

    // 4. Return CDN URL
    return \`https://\${process.env.CDN_DOMAIN}/\${key}\`;
  },

  async deleteFile(key: string): Promise<void> {
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
    }));
  },
};`,
      hints: [
        'sharp().resize() with fit: "inside" preserves aspect ratio and does not upscale',
        'withMetadata(false) strips all EXIF data for privacy',
        'CacheControl: immutable means browsers will never re-fetch this URL — safe because we use UUIDs',
      ],
    },
  ],
  keyTakeaways: [
    'Never store uploaded files on the application server in production — use S3 or equivalent cloud storage',
    'Presigned URLs let clients upload directly to S3, saving your server bandwidth for large files',
    'Always process images (resize, convert to WebP, strip EXIF) before storage',
    'Validate file type using file magic bytes, not the extension — extensions can be spoofed',
    'Use UUID-based filenames to prevent enumeration and overwriting',
    'Serve files through a CDN, not directly from S3 origin — significantly faster globally',
    'Store only the S3 key in the database, not the full URL — lets you change CDN without data migration',
  ],
  nextLesson: 'api-design',
  prevLesson: 'authentication-systems',
};
