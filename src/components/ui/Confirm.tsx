import { BottomSheet, Button } from './index';

interface ConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  desc?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export function Confirm({ open, onClose, onConfirm, title, desc, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger }: ConfirmProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <div className="p-6 space-y-6">
        {desc && (
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-center">
            {desc}
          </p>
        )}
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={onClose}>{cancelLabel}</Button>
          <Button variant={danger ? 'danger' : 'primary'} fullWidth onClick={() => { onConfirm(); onClose(); }}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
