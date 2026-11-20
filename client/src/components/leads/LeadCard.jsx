import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { CopyButton } from '../ui/CopyButton';
import { SOURCE_CONFIG } from '../../lib/constants';
import { formatRelativeTime } from '../../lib/utils';

export const LeadCard = ({
  lead,
  onClick,
  onEdit,
  onDelete,
  onChangeStatus,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div
      onClick={onClick}
      className="p-4 bg-surface border border-border rounded-[12px] flex flex-col gap-3 active:bg-surface-muted/40 transition-colors cursor-pointer select-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="group/copy flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-text-primary leading-tight">
              {lead.name}
            </h3>
            <CopyButton text={lead.name} label="Name" />
          </div>
          <div className="group/copy flex items-center gap-1.5 text-xs text-text-secondary mt-0.5">
            <span>{lead.company}</span>
            <CopyButton text={lead.company} label="Company" />
          </div>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <StatusBadge
            status={lead.status}
            onChangeStatus={(newStatus) => onChangeStatus(lead.id, newStatus)}
          />

          {/* Kebab menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-[6px] text-text-tertiary hover:text-text-primary hover:bg-surface-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="More actions"
            >
              <MoreHorizontal className="w-4 h-4" strokeWidth={1.75} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-surface border border-border rounded-[8px] shadow-floating z-30 py-1">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(lead);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-muted cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Edit lead</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(lead);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#DC2626] hover:bg-[#FCE6E3] dark:hover:bg-[#3D1B18] cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-text-tertiary pt-2 border-t border-border">
        <span>{SOURCE_CONFIG[lead.source]?.label || lead.source}</span>
        <span className="font-mono text-[11px]">{formatRelativeTime(lead.createdAt)}</span>
      </div>

      {/* Quick Action buttons: Tap to call & Tap to email + copy buttons */}
      <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
        {lead.phone && (
          <div className="flex-1 flex items-center gap-1">
            <a
              href={`tel:${lead.phone}`}
              className="flex-1 h-9 rounded-[8px] bg-surface-muted text-text-secondary hover:text-text-primary hover:bg-surface-muted/80 flex items-center justify-center gap-1.5 text-xs font-medium border border-border transition-colors"
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Call</span>
            </a>
            <CopyButton
              text={lead.phone}
              label="Phone number"
              variant="inline"
              className="h-9 w-9 bg-surface-muted border border-border"
            />
          </div>
        )}
        {lead.email && (
          <div className="flex-1 flex items-center gap-1">
            <a
              href={`mailto:${lead.email}`}
              className="flex-1 h-9 rounded-[8px] bg-surface-muted text-text-secondary hover:text-text-primary hover:bg-surface-muted/80 flex items-center justify-center gap-1.5 text-xs font-medium border border-border transition-colors"
            >
              <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Email</span>
            </a>
            <CopyButton
              text={lead.email}
              label="Email address"
              variant="inline"
              className="h-9 w-9 bg-surface-muted border border-border"
            />
          </div>
        )}
      </div>
    </div>
  );
};
