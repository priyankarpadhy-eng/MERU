import { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { LeadForm } from './LeadForm';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useCreateLead, useUpdateLead } from '../../hooks/useLeads';

export const LeadDrawer = ({
  isOpen,
  onClose,
  lead = null,
}) => {
  const isEdit = Boolean(lead?.id);
  const createLeadMutation = useCreateLead();
  const updateLeadMutation = useUpdateLead();

  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const handleRequestClose = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardConfirm(false);
    setIsDirty(false);
    onClose();
  };

  const handleSubmit = async (formData, setError) => {
    try {
      if (isEdit) {
        await updateLeadMutation.mutateAsync({
          id: lead.id,
          data: formData,
        });
      } else {
        await createLeadMutation.mutateAsync(formData);
      }
      setIsDirty(false);
      onClose();
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

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={handleRequestClose}
        title={isEdit ? 'Edit lead' : 'Add lead'}
        description={
          isEdit
            ? 'Update lead contact information and pipeline status.'
            : 'Capture a new sales opportunity in your pipeline.'
        }
      >
        <LeadForm
          lead={lead}
          onSubmit={handleSubmit}
          onCancel={handleRequestClose}
          isSubmitting={createLeadMutation.isPending || updateLeadMutation.isPending}
          onDirtyChange={setIsDirty}
        />
      </Drawer>

      {/* Discard confirmation when closing dirty form */}
      <ConfirmDialog
        isOpen={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        onConfirm={handleConfirmDiscard}
        title="Discard unsaved changes?"
        description="You have unsaved changes in this form. If you close now, your progress will be lost."
        requireTyping={false}
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
      />
    </>
  );
};
