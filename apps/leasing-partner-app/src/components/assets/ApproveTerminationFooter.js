import { useApproveTerminationRequestMutation } from '@/features/assets/api';
import { Button } from '@nextui-org/react';
import { toast } from 'react-toastify';

export default function ApproveTerminationFooter({
  terminationRequestId,
  assetId,
  onClose,
}) {
  const [
    approveTerminationRequest,
    { isLoading: isApproveTerminationRequestLoading },
  ] = useApproveTerminationRequestMutation();

  const handleApproveTerminationClick = async () => {
    try {
      await approveTerminationRequest({
        requestId: terminationRequestId,
        assetId,
      }).unwrap();
      toast.success('Approved lease termination request!');
      onClose();
    } catch {}
  };

  return (
    <div className='flex flex-col gap-4 px-4'>
      <div className='flex flex-col gap-1'>
        <div className='text-md text-black-9'>Approve termination request</div>
        <div className='text-xs'>
          Once you approve the termination request, an invoice will be generated
          for collection of remaining lease amount.
        </div>
      </div>
      <hr className='h-px bg-gray-200 border-0'></hr>
      <Button
        size='sm'
        bordered
        className='w-full bg-primary-main text-white border border-primary-dark'
        isLoading={isApproveTerminationRequestLoading}
        onClick={() => handleApproveTerminationClick()}
      >
        Approve Request
      </Button>
    </div>
  );
}
