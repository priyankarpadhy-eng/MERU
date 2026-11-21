import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useLead, useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import { StatusBadge } from '../components/leads/StatusBadge';
import { SourceBadge } from '../components/leads/SourceBadge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { CopyButton } from '../components/ui/CopyButton';
import { CountryFlag, formatPhoneNumber } from '../components/ui/CountryFlag';
import { formatDateTime, formatDate, getInitials, getAvatarColor, cn } from '../lib/utils';

export const LeadDetail = ({ onOpenEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: lead, isLoading, isError, error } = useLead(id);
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleStatusChange = (newStatus) => {
    updateLeadMutation.mutate({
      id: lead.id,
      data: { status: newStatus },
    });
  };

  const handleConfirmDelete = async () => {
    await deleteLeadMutation.mutateAsync(lead.id);
    navigate('/leads');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // 404 Not Found state
  if (isError || !lead) {
    return (
      <div className="p-12 text-center bg-surface border border-border rounded-[12px] max-w-lg mx-auto mt-8">
        <div className="w-12 h-12 rounded-[10px] bg-[#FCE6E3] dark:bg-[#3D1B18] text-[#DC2626] flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" strokeWidth={1.75} />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-1">
          Lead not found
        </h2>
        <p className="text-xs text-text-secondary mb-6">
          The requested lead does not exist or you don't have permission to view it.
        </p>
        <Button variant="primary" onClick={() => navigate('/leads')}>
          Back to leads
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-secondary">
        <Link
          to="/leads"
          className="hover:text-text-primary transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Leads</span>
        </Link>
        <span className="text-text-tertiary">/</span>
        <span className="text-text-primary font-medium truncate max-w-xs">
          {lead.name}
        </span>
      </nav>

      {/* Header bar with Circular Avatar, Status and Actions */}
      <div className="p-5 sm:p-6 bg-surface border border-border rounded-[12px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          {/* Circular avatar badge with initials */}
          <div
            className={cn(
              'w-12 h-12 rounded-full border flex items-center justify-center shrink-0 text-sm font-semibold select-none shadow-xs',
              getAvatarColor(lead.name)
            )}
            title={lead.name}
          >
            {getInitials(lead.name)}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
                {lead.name}
              </h1>
              <CopyButton text={lead.name} label="Name" variant="inline" />
              <StatusBadge
                status={lead.status}
                onChangeStatus={handleStatusChange}
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-1">
              <Building2 className="w-3.5 h-3.5 text-text-tertiary" />
              <span>{lead.company}</span>
              <CopyButton text={lead.company} label="Company" variant="inline" />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={Pencil}
            onClick={() => (onOpenEdit ? onOpenEdit(lead) : navigate(`/leads/${lead.id}/edit`))}
            className="flex-1 sm:flex-initial"
          >
            Edit
          </Button>
          <Button
            variant="destructiveOutline"
            size="sm"
            leftIcon={Trash2}
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 sm:flex-initial"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Contact Information */}
        <div className="p-5 sm:p-6 bg-surface border border-border rounded-[12px] space-y-4 shadow-xs">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-[0.04em] pb-3 border-b border-border">
            Contact information
          </h3>

          <div className="space-y-3.5">
            {/* Email */}
            <div className="flex items-center justify-between p-3 rounded-[8px] bg-surface-muted/40 border border-border group/copy">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-[6px] bg-surface flex items-center justify-center text-text-tertiary border border-border shrink-0">
                  <Mail className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="truncate">
                  <span className="text-[10px] text-text-tertiary uppercase block">
                    Email address
                  </span>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-xs font-medium text-text-primary hover:text-accent truncate block"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>
              <CopyButton text={lead.email} label="Email address" variant="inline" />
            </div>

            {/* Phone with Country Flag */}
            <div className="flex items-center justify-between p-3 rounded-[8px] bg-surface-muted/40 border border-border group/copy">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-[6px] bg-surface flex items-center justify-center text-text-tertiary border border-border shrink-0">
                  <Phone className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="truncate">
                  <span className="text-[10px] text-text-tertiary uppercase block">
                    Phone number
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <CountryFlag phone={lead.phone} />
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-xs font-mono font-medium text-text-primary hover:text-accent truncate block"
                    >
                      {formatPhoneNumber(lead.phone)}
                    </a>
                  </div>
                </div>
              </div>
              {lead.phone && (
                <CopyButton text={formatPhoneNumber(lead.phone)} label="Phone number" variant="inline" />
              )}
            </div>

            {/* Company */}
            <div className="flex items-center justify-between p-3 rounded-[8px] bg-surface-muted/40 border border-border group/copy">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-[6px] bg-surface flex items-center justify-center text-text-tertiary border border-border shrink-0">
                  <Building2 className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="truncate">
                  <span className="text-[10px] text-text-tertiary uppercase block">
                    Organization
                  </span>
                  <span className="text-xs font-medium text-text-primary truncate block">
                    {lead.company}
                  </span>
                </div>
              </div>
              <CopyButton text={lead.company} label="Company" variant="inline" />
            </div>
          </div>
        </div>

        {/* Right Card: Attribution & Notes */}
        <div className="p-5 sm:p-6 bg-surface border border-border rounded-[12px] space-y-4 shadow-xs">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-[0.04em] pb-3 border-b border-border">
            Attribution & Timeline
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-[8px] bg-surface-muted/40 border border-border">
              <span className="text-[10px] uppercase text-text-tertiary block mb-1.5">Source</span>
              <SourceBadge source={lead.source} />
            </div>

            <div className="p-3 rounded-[8px] bg-surface-muted/40 border border-border">
              <div className="flex items-center gap-1.5 text-text-tertiary mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase">Created</span>
              </div>
              <p className="font-mono text-[11px] text-text-primary">
                {formatDate(lead.createdAt)}
              </p>
            </div>

            <div className="col-span-2 p-3 rounded-[8px] bg-surface-muted/40 border border-border">
              <div className="flex items-center gap-1.5 text-text-tertiary mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase">Last updated</span>
              </div>
              <p className="font-mono text-[11px] text-text-primary">
                {formatDateTime(lead.updatedAt)}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 text-text-secondary text-xs font-semibold uppercase tracking-[0.04em] mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Notes</span>
            </div>
            <div className="p-3.5 rounded-[8px] bg-surface-muted/20 border border-border text-xs text-text-secondary leading-relaxed min-h-[96px] whitespace-pre-wrap">
              {lead.notes || 'No notes added for this lead yet.'}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog requiring typed "delete" */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete this lead?"
        itemName={lead.name}
        description="This action cannot be undone. All contact details and notes will be permanently removed."
        expectedWord="delete"
        confirmLabel="Delete lead"
        isLoading={deleteLeadMutation.isPending}
      />
    </div>
  );
};
