import { z } from 'zod';

export const paymentStatusEnum = z.enum([
  'PENDING',
  'COMPLETED',
]);

export const purchaseStatusEnum = z.enum([
  'WAITINGPAYMENT',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
]);

export const createPurchaseSchema = z.object({
  buyerId: z.string().uuid('Invalid buyer ID format'),
  planId: z.string(),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.string().optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export const updatePurchaseSchema = z.object({
  status: purchaseStatusEnum.optional(),
  paymentStatus: paymentStatusEnum.optional(),
  paymentMethod: z.string().optional(),
  paymentId: z.string().optional(),
  cancelReason: z.string().optional(),
  cancelComment: z.string().optional(),
  cancelledAt: z.date().optional(),
});

export const purchaseParamsSchema = z.object({
  id: z.string().uuid('Invalid purchase ID format'),
});

export const userIdParamsSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

export const purchaseQuerySchema = z.object({
  buyerId: z.string().uuid('Invalid buyer ID format').optional(),
  professionalId: z.string().uuid('Invalid professional ID format').optional(),
  status: purchaseStatusEnum.optional(),
  paymentStatus: paymentStatusEnum.optional(),
  limit: z.coerce.number().positive().optional(),
  offset: z.coerce.number().nonnegative().optional(),
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;
export type UpdatePurchaseInput = z.infer<typeof updatePurchaseSchema>;
export type PurchaseParams = z.infer<typeof purchaseParamsSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type PurchaseQuery = z.infer<typeof purchaseQuerySchema>;
