import { Box, Flex } from '@chakra-ui/react';
import Select from '../FormSelect';
import { usePagination, usePaginationResponse, useResponse } from '../hooks';
import Paginator from '../Paginator';

const perPageItems = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 30, label: '30' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 200, label: '200' },
];

export const BoxPagination: React.FC = () => {
  const { page, perPage, updatePage, updatePerPage } = usePagination();
  const { total } = usePaginationResponse();
  const { dataList } = useResponse();

  const handleChangePerPage = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    updatePerPage(Number(event.currentTarget.value));
    updatePage(1);
  };

  const handleChangePage = (selectedPage: number): void => {
    updatePage(selectedPage);
  };

  return (
    <Flex
      direction="row"
      mt={4}
      justifyContent="space-between"
      alignItems="center"
    >
      <Box>
        {dataList.length === 0
          ? 'Nenhum registro encontrado'
          : `Mostrando de ${
              dataList.length > 0 ? perPage * page - perPage + 1 : 0
            } a ${dataList.length + perPage * (page - 1)} de ${total} ${
              total === 1 ? 'registro' : 'registros'
            }`}
      </Box>

      {dataList.length >= 1 && (
        <>
          <Flex direction="row" alignItems="center" w={180} mt={4}>
            <Flex w={20}>
              <Select
                optionsSelect={perPageItems}
                onChange={handleChangePerPage}
              />
            </Flex>
            <Box w={180} ml={8} fontSize={16}>
              <span>por página</span>
            </Box>
          </Flex>

          <Paginator handleChangePage={handleChangePage} />
        </>
      )}
    </Flex>
  );
};
