import mongoose from "mongoose";
import InsuranceClaim from "./insuranceClaim.model.js";
import InsurancePolicy from "./insurancePolicy.model.js";
import Patient from "../patients/patient.model.js";
import Invoice from "../billing/invoice.model.js";
import Payment from "../payments/payment.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

export const createInsuranceClaim = async (data, currentUser, requestMeta) => {
  const { patientId, policyId, invoiceId, claimAmount, documents } = data;

  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }

  const policy = await InsurancePolicy.findById(policyId);
  if (!policy) {
    throw new AppError("Insurance policy not found", 404, ErrorCodes.NOT_FOUND);
  }
  if (String(policy.patientId) !== String(patientId)) {
    throw new AppError("Policy does not belong to this patient", 400, ErrorCodes.VALIDATION_ERROR);
  }
  if (policy.status !== "active") {
    throw new AppError("Insurance policy is not active", 400, ErrorCodes.VALIDATION_ERROR);
  }
  if (new Date() > policy.validUntil) {
    throw new AppError("Insurance policy has expired", 400, ErrorCodes.VALIDATION_ERROR);
  }
  if (claimAmount > policy.coverageAmount) {
    throw new AppError("Claim amount exceeds policy coverage limit", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) {
    throw new AppError("Invoice not found", 404, ErrorCodes.NOT_FOUND);
  }
  if (String(invoice.patientId) !== String(patientId)) {
    throw new AppError("Invoice does not belong to this patient", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const claim = await InsuranceClaim.create({
    patientId,
    policyId,
    invoiceId,
    claimAmount,
    documents: documents || [],
  });

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "insurance",
    resourceId: claim._id,
    newValue: claim.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return claim;
};

export const getAllClaims = async (query) => {
  const { status, patientId, page = 1, limit = 20 } = query;

  const filter = {};
  if (status) filter.status = status;
  if (patientId) filter.patientId = patientId;

  const skip = (Number(page) - 1) * Number(limit);

  const [claims, total] = await Promise.all([
    InsuranceClaim.find(filter)
      .populate("patientId", "name patientId")
      .populate("policyId", "providerName policyNumber")
      .populate("invoiceId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    InsuranceClaim.countDocuments(filter),
  ]);

  return {
    claims,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getClaimById = async (id) => {
  const claim = await InsuranceClaim.findById(id)
    .populate("patientId", "name patientId")
    .populate("policyId", "providerName policyNumber coverageAmount")
    .populate("invoiceId");

  if (!claim) {
    throw new AppError("Insurance claim not found", 404, ErrorCodes.NOT_FOUND);
  }
  return claim;
};

const ALLOWED_TRANSITIONS = {
  submitted: ["under-review", "rejected"],
  "under-review": ["approved", "rejected"],
  approved: ["settled"],
  rejected: [],
  settled: [],
};

export const updateClaimStatus = async (id, data, currentUser, requestMeta) => {
  const { status, approvedAmount, rejectionReason } = data;

  const claim = await InsuranceClaim.findById(id);
  if (!claim) {
    throw new AppError("Insurance claim not found", 404, ErrorCodes.NOT_FOUND);
  }

  const allowedNext = ALLOWED_TRANSITIONS[claim.status] || [];
  if (!allowedNext.includes(status)) {
    throw new AppError(
      `Cannot change claim status from "${claim.status}" to "${status}"`,
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  if (status === "approved" && approvedAmount === undefined) {
    throw new AppError("approvedAmount is required when approving a claim", 400, ErrorCodes.VALIDATION_ERROR);
  }
  if (status === "rejected" && !rejectionReason) {
    throw new AppError("rejectionReason is required when rejecting a claim", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const oldValue = claim.toObject();

  if (status !== "settled") {
    claim.status = status;
    if (approvedAmount !== undefined) claim.approvedAmount = approvedAmount;
    if (rejectionReason !== undefined) claim.rejectionReason = rejectionReason;
    await claim.save();

    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "insurance",
      resourceId: claim._id,
      oldValue,
      newValue: claim.toObject(),
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
    });

    return claim;
  }

  const settleAmount = claim.approvedAmount ?? claim.claimAmount;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const invoice = await Invoice.findById(claim.invoiceId).session(session);
    if (!invoice) {
      throw new AppError("Linked invoice not found", 404, ErrorCodes.NOT_FOUND);
    }

    const [payment] = await Payment.create(
      [
        {
          invoiceId: invoice._id,
          patientId: claim.patientId,
          amount: settleAmount,
          method: "insurance",
          status: "success",
          receivedBy: currentUser.id,
        },
      ],
      { session }
    );

    const newAmountPaid = (invoice.amountPaid || 0) + settleAmount;
    invoice.amountPaid = newAmountPaid;
    invoice.status = newAmountPaid >= invoice.total ? "paid" : "partially-paid";
    await invoice.save({ session });

    claim.status = "settled";
    await claim.save({ session });

    await createAuditLog(
      {
        userId: currentUser.id,
        action: "UPDATE",
        resource: "insurance",
        resourceId: claim._id,
        oldValue,
        newValue: { ...claim.toObject(), settledPaymentId: payment._id },
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      },
      { session }
    );

    await session.commitTransaction();
    return claim;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
