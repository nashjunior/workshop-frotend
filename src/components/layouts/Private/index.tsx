import {
  Grid,
  GridItem,
  GridProps,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Sidebar, SidebarDesktopContext } from './desktop';

type IProps = { children: React.ReactNode };

const LazyHeaderMobile: React.ComponentType = dynamic(
  () => import('./tablet').then(({ HeaderMobile }) => HeaderMobile),
  { ssr: false },
);
const LazyHeaderDesktop: React.ComponentType<{
  handleActiveSidebar: () => void;
}> = dynamic(
  () => import('./desktop').then(({ HeaderDesktop }) => HeaderDesktop),
  { ssr: false },
);

export const PrivateLayout: React.FC<IProps> = ({ children }) => {
  const [isDesktop, isTablet] = useMediaQuery([
    '(min-width: 960px)',
    '(max-width: 960px)',
  ]);

  const { isOpen, onToggle } = useDisclosure();

  const gridProps2: GridProps = isTablet
    ? {
        gridTemplateRows: '10vh 1fr 10vh',
        height: '100vh',
        rowGap: 0,
        gridRowGap: 0,
      }
    : {
        height: '100vh',
        width: '100vw',
        gridTemplateAreas: `
      "nav header"
      "nav main"
      "nav footer"
    `,
        gridTemplateRows: '1fr 4fr 1fr',
        gridTemplateColumns: 'auto 1fr',
      };

  const handleActiveSidebar = useMemo(
    () => ({
      isOpen,
      handleActivateSidebar: onToggle,
    }),
    [onToggle, isOpen],
  );

  return (
    <Grid {...gridProps2} suppressHydrationWarning>
      <GridItem
        as="header"
        gridArea={isDesktop ? 'header' : undefined}
        bg="green.200"
      >
        {isDesktop && <LazyHeaderDesktop handleActiveSidebar={onToggle} />}
        {isTablet && <LazyHeaderMobile />}
      </GridItem>

      {isDesktop && (
        <SidebarDesktopContext.Provider value={handleActiveSidebar}>
          <Sidebar />
        </SidebarDesktopContext.Provider>
      )}

      <GridItem
        as="main"
        gridArea={isDesktop ? 'main' : undefined}
        color="#E58346"
        padding={isDesktop ? 2 : undefined}
        marginLeft={isDesktop ? 2 : undefined}
        zIndex={0}
      >
        {children}
      </GridItem>

      <GridItem as="footer" gridArea={isDesktop ? 'footer' : undefined}>
        footer
      </GridItem>
    </Grid>
  );
};
