import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import AppError from "../core/errors/AppError.js";
import { ErrorCodes } from "../core/errors/errorCodes.js";

// ---------------- Allowed file types ----------------
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_DOCUMENT_TYPES = [...ALLOWED_IMAGE_TYPES, "application/pdf"];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ---------------- Storage factory — folder ke hisaab se dynamic ----------------
const createCloudinaryStorage = (folder, allowedTypes) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `hospital-management/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
      resource_type: "auto", // images aur PDFs dono handle karega
    },
  });
};

// ---------------- File filter — allowed types hi accept karo ----------------
const createFileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
        400,
        ErrorCodes.VALIDATION_ERROR
      ),
      false
    );
  }
};

// ---------------- Reusable factory — kahin bhi call karke customize kar sakte ho ----------------
export const createUploader = (folder, { allowedTypes = ALLOWED_DOCUMENT_TYPES, maxSize = MAX_FILE_SIZE } = {}) => {
  return multer({
    storage: createCloudinaryStorage(folder, allowedTypes),
    fileFilter: createFileFilter(allowedTypes),
    limits: { fileSize: maxSize },
  });
};

// ---------------- Pre-configured uploaders — common use cases ke liye ready-made ----------------
export const uploadProfilePhoto = createUploader("profile-photos", {
  allowedTypes: ALLOWED_IMAGE_TYPES,
  maxSize: 2 * 1024 * 1024, // 2MB — profile photos chhoti honi chahiye
}).single("photo");

export const uploadLabReport = createUploader("lab-reports").single("reportFile");

export const uploadRadiologyImages = createUploader("radiology-images").array("images", 5); // max 5 images ek saath

export const uploadInsuranceDocuments = createUploader("insurance-documents").array("documents", 5);

export const uploadHospitalLogo = createUploader("hospital-logo", {
  allowedTypes: ALLOWED_IMAGE_TYPES,
  maxSize: 1 * 1024 * 1024,
}).single("logo");

// ---------------- Multer errors ko AppError mein convert karna ----------------
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new AppError("File size too large", 400, ErrorCodes.VALIDATION_ERROR));
    }
    return next(new AppError(err.message, 400, ErrorCodes.VALIDATION_ERROR));
  }
  next(err);
};