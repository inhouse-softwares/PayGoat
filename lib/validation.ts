/**
 * Validation Schemas using Zod
 * Centralized validation for API inputs
 */

import { z } from "zod";

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export const PasswordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

// ============================================================================
// PAYMENT INSTANCE SCHEMAS
// ============================================================================

export const BankEntitySchema = z.object({
  name: z.string().min(1).max(100).trim(),
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be exactly 10 digits"),
  bankCode: z.string().min(1, "Bank code is required"),
  businessName: z.string().min(1).max(200).trim(),
  percentage: z.number().min(0).max(100, "Percentage must be between 0 and 100"),
});

export const PaymentTypeSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  description: z.string().max(500).optional(),
  amount: z.number().positive("Amount must be positive"),
  splitCode: z.string().optional(),
  splitEntities: z.array(BankEntitySchema).optional(),
});

export const FormFieldSchema = z.object({
  label: z.string().min(1).max(50).trim(),
  type: z.enum(["text", "email", "tel", "number", "date"]),
  required: z.boolean().default(false),
});

export const CreateInstanceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).trim(),
  summary: z.string().min(1, "Summary is required").max(500).trim(),
  idclPercent: z.number().min(0).max(100).default(0),
  entities: z.array(BankEntitySchema).optional().default([]),
  formFields: z.array(FormFieldSchema).optional().default([]),
  paymentTypes: z.array(PaymentTypeSchema).min(1, "At least one payment type is required"),
});

export const UpdateInstanceSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  summary: z.string().min(1).max(500).trim().optional(),
  formFields: z.array(FormFieldSchema).optional(),
  paymentTypes: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1).max(100).trim(),
        description: z.string().max(500).optional(),
        amount: z.number().positive("Amount must be positive"),
      })
    )
    .optional(),
});

// ============================================================================
// PAYMENT COLLECTION SCHEMAS
// ============================================================================

export const PersonDataSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().optional().or(z.literal("")),
}).catchall(z.string().max(500)); // Allow additional fields (custom form fields)

export const PaymentMetadataSchema = z.object({
  persons: z.array(PersonDataSchema).optional(),
  payer_name: z.string().max(200).optional(),
  instance_id: z.string().optional(),
  payment_type: z.string().max(100).optional(),
  quantity: z.number().int().positive().optional(),
});

export const CreateCollectionSchema = z.object({
  instanceId: z.string().min(1),
  instanceName: z.string().min(1).max(200),
  splitCode: z.string().min(1),
  paymentTypeId: z.string().optional(),
  paymentType: z.string().max(100).optional(),
  payer: z.string().min(1).max(200),
  amount: z.number().positive("Amount must be positive"),
  quantity: z.number().int().positive().default(1),
  idclAmount: z.number().min(0),
  motAmount: z.number().min(0),
  metadata: PaymentMetadataSchema.default({}),
  collectedAt: z.string(), // ISO date string
});

// ============================================================================
// PAYSTACK SCHEMAS
// ============================================================================

export const PaystackInitializeSchema = z.object({
  email: z.string().email("Invalid email address"),
  amount: z.number().int().positive("Amount must be a positive integer (in kobo)"),
  reference: z.string().min(1, "Reference is required"),
  split_code: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const PaystackResolveSchema = z.object({
  account_number: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
  bank_code: z.string().min(1, "Bank code is required"),
});

// ============================================================================
// PAGINATION SCHEMA
// ============================================================================

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

// ============================================================================
// TYPE INFERENCE
// ============================================================================

export type LoginInput = z.infer<typeof LoginSchema>;
export type PasswordChangeInput = z.infer<typeof PasswordChangeSchema>;
export type CreateInstanceInput = z.infer<typeof CreateInstanceSchema>;
export type UpdateInstanceInput = z.infer<typeof UpdateInstanceSchema>;
export type CreateCollectionInput = z.infer<typeof CreateCollectionSchema>;
export type PaystackInitializeInput = z.infer<typeof PaystackInitializeSchema>;
export type PaystackResolveInput = z.infer<typeof PaystackResolveSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
