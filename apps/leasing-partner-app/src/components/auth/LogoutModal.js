import { api } from '@/features/api/api';
import { clearUser } from '@/features/auth/slice';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function LogoutModal({ isOpen, onOpenChange, onClose }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = useCallback(async () => {
    dispatch(clearUser());
    dispatch(api.util.resetApiState());
    onClose();
    router.push('/');
  }, [dispatch, onClose, router]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              Are you sure you want to sign out?
            </ModalHeader>
            <ModalFooter>
              <Button variant='bordered' onPress={onClose}>
                Cancel
              </Button>
              <Button
                className='bg-[#AA3628] border border-[#80121D] text-white'
                onPress={handleLogout}
              >
                Sign out
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
