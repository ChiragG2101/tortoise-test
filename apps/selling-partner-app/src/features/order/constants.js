export const ORDER_TAG_TYPES = Object.freeze({
  ORDERS: 'Orders',
  ORDER_BY_ID: 'OrderById',
  POST_APPROVAL: 'PostApproval',
  PROCUREMENT_WORKFLOW_STEPS: 'ProcurementWorkflowSteps',
  DELIVERY_PROOFS: 'DeliveryProofs',
});

export const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSED: 'processed',
  CANCELLED: 'cancelled',
  PAID: 'paid',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  RETURNED: 'returned',
  REFUNDED: 'refunded',
  SUPPORTED: 'supported',
  COMPLETED: 'completed',
  FAILED: 'failed',
  ARCHIVED: 'archived',
});

export const LESSOR_ORDER_PRODUCT_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
});

export const PURCHASE_ORDER_STATUS = Object.freeze({
  WAITING_FOR_SUPPLIER_SELECTION: 'waiting_for_supplier_selection',
  PENDING: 'pending',
  CONFIRMED_BY_LESSOR: 'confirmed_by_lessor',
  PLACED_BY_LESSOR: 'placed_by_lessor',
  CONFIRMED_BY_SUPPLIER: 'confirmed_by_supplier',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  RETURNED: 'returned',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
});

export const ORDER_WORKFLOW_EXECUTION_STEPS = {
  CONFIRM_LESSOR_ORDER_PRODUCT: 'confirm_lessor_order_product',
  SHIP_LESSOR_ORDER_PRODUCT: 'ship_lessor_order_product',
  DELIVER_LESSOR_ORDER_PRODUCT: 'deliver_lessor_order_product',
};

export const SHIPPING_PROVIDERS = Object.freeze([
  { label: 'By Hand', value: 'By Hand' },
  { label: 'Jet Air Express', value: 'Jet Air Express' },
  { label: 'Blue Dart', value: 'Blue Dart' },
  // { label: 'Delhivery', value: 'Delhivery' },
  // { label: 'Fedex', value: 'Fedex' },
]);
