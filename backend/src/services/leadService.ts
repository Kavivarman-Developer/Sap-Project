import { LeadModel, type LeadDocument } from '../models/Lead.js';
import type { Booking, Lead, Pagination } from '../types/spa.js';
import { isDatabaseConnected } from './databaseService.js';

const memoryLeads: Lead[] = [];

const clampPage = (value: number) => (Number.isFinite(value) && value > 0 ? Math.floor(value) : 1);
const clampPageSize = (value: number) =>
  Number.isFinite(value) && value > 0 ? Math.min(Math.floor(value), 50) : 10;

const toApiLead = (lead: LeadDocument): Lead => ({
  id: lead.leadId,
  name: lead.name,
  phone: lead.phone,
  email: lead.email,
  gender: lead.gender,
  totalBookings: lead.totalBookings,
  lastBookingDate: lead.lastBookingDate,
  createdAt: lead.createdAt.toISOString(),
  updatedAt: lead.updatedAt.toISOString(),
});

export const upsertLeadFromBooking = async (booking: Booking) => {
  const now = new Date().toISOString();

  if (!isDatabaseConnected) {
    const existingLead = memoryLeads.find(
      (lead) => lead.email === booking.email && lead.phone === booking.phone,
    );

    if (existingLead) {
      existingLead.name = booking.customerName;
      existingLead.gender = booking.gender;
      existingLead.totalBookings += 1;
      existingLead.lastBookingDate = booking.date;
      existingLead.updatedAt = now;
      return existingLead;
    }

    const lead: Lead = {
      id: `LD-${Date.now().toString(36).toUpperCase()}`,
      name: booking.customerName,
      phone: booking.phone,
      email: booking.email,
      gender: booking.gender,
      totalBookings: 1,
      lastBookingDate: booking.date,
      createdAt: now,
      updatedAt: now,
    };
    memoryLeads.push(lead);
    return lead;
  }

  const lead = await LeadModel.findOneAndUpdate(
    { email: booking.email, phone: booking.phone },
    {
      $set: {
        name: booking.customerName,
        gender: booking.gender,
        lastBookingDate: booking.date,
      },
      $inc: { totalBookings: 1 },
      $setOnInsert: { leadId: `LD-${Date.now().toString(36).toUpperCase()}` },
    },
    { new: true, upsert: true },
  ).lean();

  return toApiLead(lead);
};

export const listLeads = async (pageValue: number, pageSizeValue: number) => {
  const page = clampPage(pageValue);
  const pageSize = clampPageSize(pageSizeValue);

  if (!isDatabaseConnected) {
    const sortedLeads = [...memoryLeads].sort((first, second) =>
      second.updatedAt.localeCompare(first.updatedAt),
    );
    const total = sortedLeads.length;
    const leads = sortedLeads.slice((page - 1) * pageSize, page * pageSize);
    const pagination: Pagination = {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
    return { leads, pagination };
  }

  const total = await LeadModel.countDocuments();
  const storedLeads = await LeadModel.find()
    .sort({ updatedAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();
  const pagination: Pagination = {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };

  return { leads: storedLeads.map(toApiLead), pagination };
};

