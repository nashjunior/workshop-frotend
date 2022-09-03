import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Tooltip,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { IconBaseProps } from 'react-icons';

import { useSidebarDesktop } from './SidebarContext';

type IProps = {
  urlRedirect?: string;
  label: string;
  items?: IProps[];
  icon?: React.ReactElement<IconBaseProps>;
};

export const ItemAccordion: React.FC<IProps> = ({
  label,
  icon: Icon,
  urlRedirect,
  items,
}) => {
  const { isOpen, handleActivateSidebar } = useSidebarDesktop();
  const router = useRouter();

  const hasItems = items ? items.length > 0 : false;

  const hasURL = !!urlRedirect && isOpen;

  return (
    <Tooltip label={label} placement="left" hasArrow isDisabled={isOpen}>
      <AccordionItem background="green.500" transition="all 0.3s" border="none">
        {({ isExpanded }) => (
          <>
            <AccordionButton
              color="white"
              onClick={
                hasURL
                  ? (e) => {
                      e.preventDefault();

                      router.push(urlRedirect);
                    }
                  : !isOpen
                  ? () => handleActivateSidebar()
                  : undefined
              }
              _focus={{ boxShadow: 'none' }}
              _hover={{ background: 'white', color: 'black' }}
              px={`${isOpen ? '18px' : '16px'}`}
              _expanded={
                isOpen
                  ? { background: '#ddd', color: 'black' }
                  : { background: 'green' }
              }
              disabled={!isOpen}
              height="70px"
            >
              <Flex
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                alignContent="flex-start"
                height="100%"
                w="100%"
                align="center"
              >
                {Icon}
                {isOpen && label}
                {hasItems && isOpen && <AccordionIcon />}
              </Flex>
            </AccordionButton>

            <AccordionPanel
              pb={0}
              p={0}
              style={
                !isOpen || !isExpanded
                  ? {
                      overflow: 'hidden',
                      display: 'none',
                      opacity: 0,
                      height: '0px',
                    }
                  : {}
              }
            >
              <Accordion allowToggle>
                {items?.map((item) => (
                  <ItemAccordion {...item} key={JSON.stringify(item)} />
                ))}
              </Accordion>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Tooltip>
  );
};
