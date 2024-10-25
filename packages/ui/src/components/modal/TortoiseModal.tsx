import React from "react";
import { Modal, ModalContent, ModalHeader } from "@nextui-org/react";
import { TortoiseModalProps } from "./types";

/**
 * TortoiseModal Component
 *
 * A reusable modal component that displays a header and content.
 *
 * @param props - The props for the component.
 * @returns The rendered modal component.
 */
export default function TortoiseModal({
  title,
  isOpen,
  onOpenChange,
  children,
}: TortoiseModalProps): JSX.Element {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
          {children}
        </ModalContent>
      </Modal>
    </>
  );
}
