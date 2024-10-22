import { WorkflowValidationException } from './exception';

const { ORDER_WORKFLOW_EXECUTION_STEPS } = require('./constants');

const getConfirmLessorOrderProductData = (
  orderData,
  workflowStep,
  lessorOrderProduct
) => ({
  orderId: orderData.id,
  workflowId: workflowStep.id,
  data: {
    lessor_order_product_id: lessorOrderProduct.id,
    confirmed_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  },
});

const getSihpLessorOrderProductData = (
  orderData,
  workflowStep,
  lessorOrderProduct,
  formData
) => {
  if (!lessorOrderProduct.product_reference_number) {
    throw new WorkflowValidationException(
      'Please ensure that each product has a valid IMEI/Serial number before proceeding.'
    );
  }
  if (!lessorOrderProduct.supplier_invoice) {
    throw new WorkflowValidationException('Please upload an invoice.');
  }
  return {
    orderId: orderData.id,
    workflowId: workflowStep.id,
    data: {
      lessor_order_product_id: lessorOrderProduct.id,
      shipping_provider: formData.shipping_provider,
      tracking_number: formData.tracking_number,
      product_reference_number: lessorOrderProduct.product_reference_number,
      shipped_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    },
  };
};

const getDeliverLessorOrderProductData = (
  orderData,
  workflowStep,
  lessorOrderProduct,
  deliveryProofs
) => {
  if (!lessorOrderProduct.supplier_invoice) {
    throw new WorkflowValidationException('Please upload an invoice.');
  }
  if (!deliveryProofs?.length === 0) {
    throw new WorkflowValidationException('Please upload proof of delivery.');
  }
  return {
    orderId: orderData.id,
    workflowId: workflowStep.id,
    data: {
      lessor_order_product_id: lessorOrderProduct.id,
      delivered_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    },
  };
};

export const validateAndCreateProcurementWorkflowDataInput = (
  orderData,
  workflowStep,
  lessorOrderProductId,
  { formData = {}, deliveryProofs = null } = {}
) => {
  try {
    const lessorOrderProduct = orderData?.order_products.find(
      (product) => product.id === parseInt(lessorOrderProductId, 10)
    );

    if (!lessorOrderProduct) {
      throw new WorkflowValidationException('Lessor order product not found');
    }

    switch (workflowStep.code) {
      case ORDER_WORKFLOW_EXECUTION_STEPS.CONFIRM_LESSOR_ORDER_PRODUCT:
        return getConfirmLessorOrderProductData(
          orderData,
          workflowStep,
          lessorOrderProduct
        );
      case ORDER_WORKFLOW_EXECUTION_STEPS.SHIP_LESSOR_ORDER_PRODUCT:
        return getSihpLessorOrderProductData(
          orderData,
          workflowStep,
          lessorOrderProduct,
          formData
        );
      case ORDER_WORKFLOW_EXECUTION_STEPS.DELIVER_LESSOR_ORDER_PRODUCT:
        return getDeliverLessorOrderProductData(
          orderData,
          workflowStep,
          lessorOrderProduct,
          deliveryProofs
        );
      default:
        throw new WorkflowValidationException(
          `Unsupported workflow step code: ${workflowStep.code}`
        );
    }
  } catch (error) {
    throw new WorkflowValidationException(error.message);
  }
};
