import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { LeadCard } from './LeadCard';
import { CopyButton } from '../ui/CopyButton';
import { SOURCE_CONFIG } from '../../lib/constants';
import { formatDate } from '../../lib/utils';

export const LeadsTable = ({
  leads = [],
  sortBy = 'createdAt',
  order = 'desc',
  onSort,
  onRowClick,
  onEdit,
  onDelete,
  onChangeStatus,
  isInitialLoad = false,
}) => {
  // Sort icon renderer
  const renderSortIcon = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.75} />;
    }
    return order === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
    );
  };

  return (
    <div className="w-full">
      {/* Mobile view (<768px): Stacked LeadCards */}
      <div className="md:hidden space-y-3 p-4">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onClick={() => onRowClick(lead.id)}
            onEdit={onEdit}
            onDelete={onDelete}
            onChangeStatus={onChangeStatus}
          />
        ))}
      </div>

      {/* Desktop / Tablet view (>=768px): Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Sticky table header with solid background and bottom border: no cutoff */}
          <thead className="sticky top-0 z-10 bg-surface border-b border-border shadow-xs">
            <tr className="bg-surface-muted/60 text-[11px] font-semibold text-text-secondary uppercase tracking-[0.04em] select-none">
              <th
                onClick={() => onSort('name')}
                className="py-3 px-4 cursor-pointer hover:text-text-primary transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Name</span>
                  {renderSortIcon('name')}
                </div>
              </th>

              <th
                onClick={() => onSort('company')}
                className="py-3 px-4 cursor-pointer hover:text-text-primary transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Company</span>
                  {renderSortIcon('company')}
                </div>
              </th>

              <th className="hidden lg:table-cell py-3 px-4">
                <span>Phone</span>
              </th>

              <th className="py-3 px-4">
                <span>Source</span>
              </th>

              <th
                onClick={() => onSort('status')}
                className="py-3 px-4 cursor-pointer hover:text-text-primary transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </th>

              <th
                onClick={() => onSort('createdAt')}
                className="hidden lg:table-cell py-3 px-4 cursor-pointer hover:text-text-primary transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Created</span>
                  {renderSortIcon('createdAt')}
                </div>
              </th>

              <th className="py-3 px-4 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            <AnimatePresence initial={isInitialLoad}>
              {leads.map((lead, index) => (
                <motion.tr
                  key={lead.id}
                  initial={isInitialLoad ? { opacity: 0, y: 6 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    duration: 0.18,
                    delay: isInitialLoad ? Math.min(index * 0.03, 0.3) : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => onRowClick(lead.id)}
                  className="group bg-surface hover:bg-surface-muted/40 transition-colors cursor-pointer select-none text-xs"
                >
                  {/* Name + Email with hover copy buttons */}
                  <td className="py-3.5 px-4 font-medium text-text-primary">
                    <div className="group/copy flex items-center gap-1.5">
                      <span className="font-semibold text-text-primary">{lead.name}</span>
                      <CopyButton text={lead.name} label="Name" />
                    </div>
                    <div className="group/copy flex items-center gap-1.5 text-text-tertiary text-[11px] font-normal">
                      <span className="truncate">{lead.email}</span>
                      <CopyButton text={lead.email} label="Email" />
                    </div>
                  </td>

                  {/* Company with hover copy button */}
                  <td className="py-3.5 px-4 text-text-secondary">
                    <div className="group/copy flex items-center gap-1.5">
                      <span>{lead.company}</span>
                      <CopyButton text={lead.company} label="Company" />
                    </div>
                  </td>

                  {/* Phone (>=1024px) with hover copy button */}
                  <td className="hidden lg:table-cell py-3.5 px-4 font-mono text-[11px] text-text-secondary">
                    <div className="group/copy flex items-center gap-1.5">
                      <span>{lead.phone || '—'}</span>
                      {lead.phone && <CopyButton text={lead.phone} label="Phone number" />}
                    </div>
                  </td>

                  {/* Source */}
                  <td className="py-3.5 px-4 text-text-secondary text-[11px]">
                    {SOURCE_CONFIG[lead.source]?.label || lead.source}
                  </td>

                  {/* Status with popover */}
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <StatusBadge
                      status={lead.status}
                      onChangeStatus={(newStatus) => onChangeStatus(lead.id, newStatus)}
                    />
                  </td>

                  {/* Created (>=1024px) */}
                  <td className="hidden lg:table-cell py-3.5 px-4 font-mono text-[11px] text-text-tertiary">
                    {formatDate(lead.createdAt)}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Desktop (>=1024px) Action Buttons */}
                    <div className="hidden lg:flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-1.5 rounded-[6px] text-text-tertiary hover:text-text-primary hover:bg-surface-muted transition-colors cursor-pointer"
                        title="Edit lead"
                        aria-label="Edit lead"
                      >
                        <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => onDelete(lead)}
                        className="p-1.5 rounded-[6px] text-text-tertiary hover:text-[#DC2626] hover:bg-[#FCE6E3] dark:hover:bg-[#3D1B18] transition-colors cursor-pointer"
                        title="Delete lead"
                        aria-label="Delete lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </button>
                    </div>

                    {/* Tablet (768-1023px) Collapsed Action Menu */}
                    <div className="lg:hidden flex justify-end">
                      <TabletRowMenu
                        lead={lead}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TabletRowMenu = ({ lead, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-[6px] text-text-tertiary hover:text-text-primary hover:bg-surface-muted"
        aria-label="Lead actions"
      >
        <MoreHorizontal className="w-4 h-4" strokeWidth={1.75} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-32 bg-surface border border-border rounded-[8px] shadow-floating z-30 py-1">
          <button
            onClick={() => {
              setOpen(false);
              onEdit(lead);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-muted text-left"
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete(lead);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#DC2626] hover:bg-[#FCE6E3] dark:hover:bg-[#3D1B18] text-left"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};
