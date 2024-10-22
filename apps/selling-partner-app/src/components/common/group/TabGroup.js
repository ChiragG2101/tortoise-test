import { Tab, Tabs } from '@nextui-org/react';
import React from 'react';

export default function TabGroup({
  activeTab,
  tabs,
  onSelectionChange,
  tabsProps,
  tabProps,
}) {
  return (
    <Tabs
      selectedKey={activeTab}
      onSelectionChange={onSelectionChange}
      {...tabsProps}
    >
      {tabs.map((tab) => (
        <Tab key={tab.key} value={tab.key} title={tab.label} {...tabProps} />
      ))}
    </Tabs>
  );
}
