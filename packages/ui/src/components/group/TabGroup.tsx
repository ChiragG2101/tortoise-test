import { Tab, Tabs } from "@nextui-org/react";
import React, { Key } from "react";

// Define the type for a single tab
interface TabType {
  key: string; // Unique identifier for the tab
  label: string; // Display label for the tab
}

// Define the props for the TabGroup component
interface TabGroupProps {
  activeTab: string; // The key of the currently active tab
  tabs: TabType[]; // Array of tab objects
  onSelectionChange: (key: Key) => void; // Callback function when a tab is selected
  tabsProps?: object; // Additional props for the Tabs component
  tabProps?: object; // Additional props for each Tab component
}
/**
 * TabGroup component renders a group of tabs using the NextUI Tabs component.
 *
 * @param props - The props for the component.
 * @returns The rendered Tabs component.
 */

export default function TabGroup({
  activeTab,
  tabs,
  onSelectionChange,
  tabsProps,
  tabProps,
}: TabGroupProps): JSX.Element {
  return (
    <Tabs
      selectedKey={activeTab} // Sets the active tab
      onSelectionChange={onSelectionChange} // Handles tab selection changes
      {...tabsProps} // Spread additional props to Tabs component
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.key} // Unique key for each tab
          value={tab.key} // Value used for tab selection
          title={tab.label} // Display title of the tab
          {...tabProps} // Spread additional props to each Tab component
        />
      ))}
    </Tabs>
  );
}
