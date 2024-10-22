import React from 'react';
import { Modal, ModalContent, ModalHeader } from '@nextui-org/react';

export default function TortoiseModal({
  title,
  isOpen,
  onOpenChange,
  children,
}) {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>
          {children}
        </ModalContent>
      </Modal>
    </>
  );
}
