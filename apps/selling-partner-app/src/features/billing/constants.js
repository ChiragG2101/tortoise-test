export const BILLING_STATUS = {
  UPCOMING: 'upcoming',
  UNPAID: 'unpaid',
  PAID: 'paid',
  DRAFT: 'draft',
  DUE: 'due',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
};

export const getStatusFilter = (activeTab) => {
  switch (activeTab) {
    case BILLING_STATUS.UNPAID:
      return {
        status__in: [BILLING_STATUS.DUE, BILLING_STATUS.OVERDUE],
      };
    case BILLING_STATUS.UPCOMING:
    case BILLING_STATUS.PAID:
      return {
        status: activeTab,
      };
    default:
      break;
  }
};
