import React, { type Key } from "react";
import IconTitlePageHeading from "./IconTitlePageHeading";
import { TabGroup } from "../../group";

interface IconTitleHeadingTabsLayoutProps {
  /** The main title text displayed in the heading */
  title: string;
  /** The icon component to display alongside the title */
  Icon: React.ComponentType<any>;
  /** Optional props to pass to the icon component */
  iconProps?: React.SVGProps<SVGSVGElement>;
  /** Array of tabs to be displayed in the tab group */
  tabs: any[];
  /** The currently active tab */
  activeTab: string;
  /** Callback function called when the active tab changes */
  onTabChange: (active: Key) => void;
  /** Optional props for the tab group */
  tabsProps?: React.HTMLProps<HTMLDivElement>;
  /** Optional props for each individual tab */
  tabProps?: React.HTMLProps<HTMLDivElement>;
}

/**
 * `IconTitleHeadingTabsLayout` is a layout component that combines an icon and title
 * with a tab group for navigation.
 *
 * Usage:
 * ```
 * <IconTitleHeadingTabsLayout
 *   title="Main Title"
 *   Icon={MyIcon}
 *   iconProps={{ size: 24 }}
 *   tabs={['Tab 1', 'Tab 2']}
 *   activeTab="Tab 1"
 *   onTabChange={(tab) => console.log(tab)}
 * />
 * ```
 *
 * Props:
 * - `title`: string - The title text to be displayed.
 * - `Icon`: ComponentType - The icon component to render.
 * - `iconProps`: SVGProps - Optional properties for the icon component.
 * - `tabs`: string[] - An array of tab names.
 * - `activeTab`: string - The currently active tab.
 * - `onTabChange`: function - A callback function that is triggered when the active tab changes.
 * - `tabsProps`: HTMLProps (optional) - Additional properties for the tab group.
 * - `tabProps`: HTMLProps (optional) - Additional properties for individual tabs.
 */
export default function IconTitleHeadingTabsLayout({
  title,
  Icon,
  iconProps,
  tabs,
  activeTab,
  onTabChange,
  tabsProps,
  tabProps,
}: IconTitleHeadingTabsLayoutProps): JSX.Element {
  return (
    <div>
      <IconTitlePageHeading
        title={title}
        Icon={Icon}
        iconProps={iconProps}
        rightSlot={
          <TabGroup
            activeTab={activeTab}
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
