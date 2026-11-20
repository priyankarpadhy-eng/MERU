import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle } from 'lucide-react';
import { leadFormSchema } from '../../lib/validators';
import { SOURCE_LIST, SOURCE_CONFIG, STATUS_LIST, STATUS_CONFIG } from '../../lib/constants';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

export const LeadForm = ({
  lead = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
  onDirtyChange,
}) => {
  const isEdit = Boolean(lead?.id);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      source: 'WEBSITE',
      status: 'NEW',
      notes: '',
    },
    mode: 'onBlur',
  });

  // Track dirty state for parent drawer unsaved warnings
  useEffect(() => {
    if (onDirtyChange) onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  // Reset form with lead data when editing
  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        source: lead.source || 'WEBSITE',
        status: lead.status || 'NEW',
        notes: lead.notes || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'WEBSITE',
        status: 'NEW',
        notes: '',
      });
    }
  }, [lead, reset]);

  const currentStatus = watch('status');
  const currentNotes = watch('notes') || '';

  const handleFormSubmit = async (formData) => {
    try {
      await onSubmit(formData, setError);
    } catch (err) {
      if (err.status === 409 || err.code === 'CONFLICT') {
        setError('email', {
          type: 'manual',
          message: 'A lead with this email already exists',
        });
      } else if (err.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e) => {
          setError(e.field, { type: 'server', message: e.message });
        });
      }
    }
  };

  const sourceOptions = SOURCE_LIST.map((key) => ({
    value: key,
    label: SOURCE_CONFIG[key].label,
  }));

  return (
    <form id="lead-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* 2-column on desktop, single-column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Name"
            placeholder="Sarah Jenkins"
            required
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        <div className="sm:col-span-1">
          <Input
            label="Email"
            type="email"
            placeholder="sarah@acme.com"
            required
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="sm:col-span-1">
          <Input
            label="Phone"
            placeholder="+1 415 555 0101"
            required
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <div className="sm:col-span-1">
          <Input
            label="Company"
            placeholder="Acme Systems"
            required
            error={errors.company?.message}
            {...register('company')}
          />
        </div>

        <div className="sm:col-span-1">
          <Select
            label="Source"
            options={sourceOptions}
            required
            error={errors.source?.message}
            {...register('source')}
          />
        </div>
      </div>

      {/* Status Segmented Radio with Color Dots */}
      <div className="space-y-1.5 pt-1">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-[0.04em]">
          Status
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STATUS_LIST.map((key) => {
            const config = STATUS_CONFIG[key];
            const isSelected = currentStatus === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setValue('status', key, { shouldDirty: true })}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-[8px] text-xs font-medium border transition-all text-center',
                  isSelected
                    ? `${config.bgClass} font-semibold ring-1 ring-accent/30`
                    : 'bg-surface border-border text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                )}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: config.colorHex }}
                />
                <span className="truncate">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Textarea with Character Counter */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-[0.04em]">
            Notes
          </label>
          <span className="text-[11px] font-mono text-text-tertiary">
            {currentNotes.length}/500
          </span>
        </div>
        <textarea
          rows={4}
          maxLength={500}
          placeholder="Add context, conversation notes, or next steps..."
          className={cn(
            'w-full px-3 py-2 bg-surface text-text-primary text-xs rounded-[8px] border transition-colors',
            'placeholder:text-text-tertiary focus:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent resize-none',
            errors.notes ? 'border-[#DC2626]' : 'border-border hover:border-text-tertiary'
          )}
          {...register('notes')}
        />
        {errors.notes && (
          <p className="flex items-center gap-1.5 text-xs text-[#DC2626]" role="alert">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            <span>{errors.notes.message}</span>
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-border">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {isEdit ? 'Save changes' : 'Save lead'}
        </Button>
      </div>
    </form>
  );
};
