import { Accordion, GridItem } from '@chakra-ui/react';
import { FaCar, FaPlug } from 'react-icons/fa';
import { ItemAccordion } from './Item';
import { useSidebarDesktop } from './SidebarContext';

type IProps = {
  urlRedirect?: string;
  label: string;
  items?: IProps[];
  icon?: React.ReactElement;
};

const items: IProps[] = [
  {
    label: 'Vehicles',
    icon: <FaCar />,
    items: [
      { label: 'Index', urlRedirect: '/vehicles' },
      { label: 'Create', urlRedirect: '/vehicles/create', icon: <FaPlug /> },
    ],
  },
  {
    urlRedirect: '/',
    items: [],
    icon: <FaCar />,
    label: 'Home',
  },
];

export const Sidebar: React.FC = () => {
  const { isOpen } = useSidebarDesktop();

  return (
    <GridItem
      as="aside"
      w={isOpen ? '10vw' : '4vw'}
      transition="width 0.6s"
      gridArea="nav"
      bg="green.500"
      boxShadow="4px 0px 9px -4px rgba(0, 0, 0, 0.71)"
      zIndex={2}
    >
      <Accordion allowToggle>
        {items.map((item) => (
          <ItemAccordion {...item} key={item.label} />
        ))}
      </Accordion>
    </GridItem>
  );
};
