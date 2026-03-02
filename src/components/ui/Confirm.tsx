import { BottomSheet, Button } from './index';

interface ConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  desc?: string;
  confirmLabel?: string;
  danger?: boolean;
}

export function Confirm({ open, onClose, onConfirm, title, desc, confirmLabel = 'নিশ্চিত করুন', danger }: ConfirmProps) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {desc && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{desc}</p>}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={onClose}>বাতিল</Button>
          <Button variant={danger ? 'danger' : 'primary'} fullWidth onClick={() => { onConfirm(); onClose(); }}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
