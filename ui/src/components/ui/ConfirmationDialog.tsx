import React from "react";
import { Button } from "./Button";
import { Popup } from "./Popup";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const actions = (
    <>
      <Button
        onClick={onCancel}
        variant="ghost"
        className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
      >
        Cancel
      </Button>
      <Button onClick={onConfirm} variant="danger">
        Confirm
      </Button>
    </>
  );

  return (
    <Popup isOpen={isOpen} onClose={onCancel} title={title} actions={actions}>
      <p className="text-gray-600 mb-2">{message}</p>
    </Popup>
  );
};
