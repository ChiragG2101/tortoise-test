const { Modal, ModalContent } = require('@nextui-org/react');

const ProductCardModal = ({ product, isOpen, onOpenChange }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      backdrop='transparent'
    >
      <ModalContent className='w-72 border?-1 border-black-6 flex flex-col'>
        <div className='border-b-1 p-8'>
          <img className='w-full' src={product?.image_url} alt='iPhone 15' />
        </div>
        <div className='p-4 flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <div className='font-bold'>{product?.name}</div>
            <p className='text-black-5 text-sm'>
              {product?.manufacturer_product_code}
            </p>
          </div>
          {/* 
          TODO: Handle product properties here
          {Object.keys(product?.properties ?? {}).length > 0 && <></>} 
          */}
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ProductCardModal;
