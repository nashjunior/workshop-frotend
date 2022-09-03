import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { usePagination, usePaginationResponse } from '../hooks';

interface IPaginatorProps {
  handleChangePage(page: number): void;
}

const Paginator: React.FC<IPaginatorProps> = ({ handleChangePage }) => {
  const { updatePage, page } = usePagination();
  const { totalPage } = usePaginationResponse();

  const createButtonsPagination = (): JSX.Element[] => {
    const buttons = [];
    if (page > 3) {
      buttons.push(
        <Button
          key="initial"
          type="button"
          borderLeft="none"
          borderRight="none"
          minW={4}
          onClick={() => handleChangePage(1)}
        >
          <FiChevronsLeft size={15} />
        </Button>,
      );
    }
    for (let i = 1; i <= totalPage; i++) {
      if (i >= page - 2 && i <= page + 2) {
        buttons.push(
          <Button
            borderLeft="none"
            borderRight="none"
            minW={10}
            key={i}
            bg="none"
            type="button"
            _active={{ bg: '#ccc' }}
            onClick={() => handleChangePage(i)}
          >
            {i}
          </Button>,
        );
      }
    }
    if (page < totalPage - 3) {
      buttons.push(
        <Button
          key="final"
          type="button"
          borderLeft="none"
          borderRight="none"
          _active={{ bg: '#ccc' }}
          onClick={() => handleChangePage(totalPage)}
        >
          <FiChevronsRight size={15} />
        </Button>,
      );
    }

    return buttons;
  };

  return (
    <Flex direction="row" wrap="nowrap" ml={2}>
      <Button
        alignSelf="center"
        justifyContent="center"
        type="button"
        // className={`${styles.previous}`}
        onClick={() => {
          if (page >= 2) updatePage(page - 1);
        }}
      >
        Anterior
      </Button>
      {createButtonsPagination()}

      <Button
        type="button"
        // className={`${styles.next}`}
        onClick={() => {
          if (page < totalPage) updatePage(page + 1);
        }}
      >
        Próximo
      </Button>
    </Flex>
  );
};

export default Paginator;
