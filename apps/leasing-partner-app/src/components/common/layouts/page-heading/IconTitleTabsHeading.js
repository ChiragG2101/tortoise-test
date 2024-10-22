import React from 'react';

import IconTitlePageHeading from './IconTitlePageHeading';
import { Tabs, Tab } from '@nextui-org/react';
import { TabGroup } from '../../group';

export default function IconTitleHeadingTabsLayout({
  title,
  Icon,
  iconProps,
  tabs,
  activeTab,
  onTabChange,
  tabsProps,
  tabProps,
}) {
  return (
    <div>
      <IconTitlePageHeading
        title={title}
        Icon={Icon}
        iconProps={iconProps}
        rightSlot={
          <TabGroup
            selectedKey={activeTab}
            tabs={tabs}
            onSelectionChange={onTabChange}
            tabsProps={tabsProps}
            tabProps={tabProps}
          />
        }
      />
    </div>
  );
}
