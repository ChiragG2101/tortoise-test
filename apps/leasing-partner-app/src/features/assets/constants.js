import { STATUS_COLORS } from '@/components/common/constants';

export const assetStatusToLabel = Object.freeze({
  assigned: 'Assigned',
  sold: 'Sold',
  provisioned: 'Not Assigned',
  archived: 'Tenure Finished',
});

export const assetStatusToColorHighlight = Object.freeze({
  assigned: STATUS_COLORS.PURPLE,
  sold: STATUS_COLORS.GREEN,
  provisioned: STATUS_COLORS.GREY,
  archived: STATUS_COLORS.GREY,
});
