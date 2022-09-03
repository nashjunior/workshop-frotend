import {
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  useTransition,
  useMemo,
  useRef,
} from 'react';
import OrderBy from 'lodash/orderBy';
import Get from 'lodash/get';
import PulseLoader from 'react-spinners/PulseLoader';
import { format, parseISO } from 'date-fns';
import { Tooltip } from '@chakra-ui/tooltip';
import {
  Button,
  Flex,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import axios, { AxiosRequestConfig } from 'axios';
import { Spinner } from '@chakra-ui/react';
import FormGroup from '../FormGroup';
import Select from '../FormSelect';
import FormInputSearch from '../FormInputSearch';
import Paginator from '../Paginator';
import HeaderColumn from '../HeaderColumn';
import styles from './styles.module.scss';
import { apiGarage as api } from '../../../services/apiGarage';
import ExportCSV from '../ExportCSV';
import {
  IColumns,
  IRemoteDatatableOptions,
  IResponsePaginaton,
} from '../interfaces';
import { usePagination, useResponse } from '../hooks';
import { BoxPagination } from '../BoxPagination';
// import ExportCSV from '../ExportCSV';

interface IDataTableProps {
  columns: IColumns;
  options: IRemoteDatatableOptions;
}

const RemoteSourceDataTable: React.FC<IDataTableProps> = ({
  columns,
  options,
}) => {
  const { serverData } = options;
  const { page, perPage } = usePagination();
  const { dataList, updateDatatable, updateTotal, updateTotalPage } =
    useResponse();

  const [isPending, startTransition] = useTransition();
  const url = useRef<string>(null);

  const columnsFields = columns.map((column) => {
    return { field: column.field, type: column.type };
  });

  const requestParams: AxiosRequestConfig = useMemo(
    () => ({
      params: {
        page: serverData.serverPagination ? page : undefined,
        perPage: serverData.serverPagination ? perPage : undefined,
        ...options.filters?.reduce(
          (obj, { field, value }) =>
            Array.isArray(field)
              ? {
                  ...obj,
                  query: value,
                  query_fields: field,
                }
              : {
                  ...obj,
                  [field]: value,
                },
          {},
        ),
      },
      headers: { ...serverData.headers },
    }),
    [options.filters, serverData, page, perPage],
  );

  const loadItems = useCallback(async (): Promise<void> => {
    const {
      data: { items, total: totalReponse, totalPage: totalPageResponse },
      request,
    } = await axios.get<IResponsePaginaton>(serverData.url, {
      ...requestParams,
    });

    url.current = request?.responseURL;
    updateTotal(totalReponse);
    updateTotalPage(totalPageResponse);
    updateDatatable(items);
  }, [
    requestParams,
    serverData.url,
    updateTotal,
    updateTotalPage,
    updateDatatable,
  ]);

  useEffect(() => {
    startTransition(() => {
      loadItems();
    });
  }, [loadItems]);

  const formatValue = useCallback(
    (value: any, tipo: any) => {
      if (tipo.name === 'date') {
        try {
          return format(parseISO(value), tipo.format);
        } catch (error) {
          return value;
        }
      }
      return value;
    },

    [],
  );

  const getValue = useCallback(
    (row: any, column: any) => {
      switch (column.type.name) {
        case 'enum':
          return column.type.enum[Get(row, column.field)];
        case 'date':
          return formatValue(Get(row, column.field), column.type);
        case 'currency':
          try {
            return new Intl.NumberFormat('pt-BR', {
              currency: 'BRL',
              style: 'currency',
            }).format(
              !Number.isNaN(Number(String(Get(row, column.field))))
                ? Get(row, column.field)
                : 0,
            );
          } catch (error) {
            return Get(row, column.field);
          }
        default:
          return Get(row, column.field);
      }
    },
    [formatValue],
  );

  return (
    <>
      <SimpleGrid
        columns={{
          sm: 1,
          md: 2,
          lg: 5,
        }}
        spacing={2}
      >
        {options.exportCsv && (
          <Flex
            alignItems="flex-end"
            justifyContent="center"
            h={55}
            pr={8}
            minW={240}
          >
            <ExportCSV
              async
              serverPagination={options?.serverData?.serverPagination}
              fileName={options.exportCsv.filename}
              columns={options.exportCsv.columns}
              url={url.current as string}
            />
          </Flex>
        )}
        {options.filters?.map(({ component: Component }) => Component)}
      </SimpleGrid>

      <Flex direction="column">
        <TableContainer>
          <Table variant="simple" colorScheme="teal" overflowX="scroll">
            <Thead>
              <Tr>
                {columns.map((column, index) => (
                  <Th key={`column${index}`}>
                    <HeaderColumn
                      field={column.field}
                      text={column.text}
                      handleFieldSort={() => console.log('aqui')}
                    />
                  </Th>
                ))}
              </Tr>
            </Thead>

            <Tbody>
              {isPending ? (
                <Tr mt={2} border={0}>
                  <Td
                    colSpan={columnsFields.length}
                    rowSpan={columns.length}
                    border={0}
                    textAlign="center"
                  >
                    <Spinner size="xl" />
                  </Td>
                </Tr>
              ) : (
                dataList.map((row, indexRow) => (
                  <Tr key={`row${indexRow}`}>
                    {columnsFields.map((column) => {
                      return (
                        <Td key={column.field}>{getValue(row, column)}</Td>
                      );
                    })}

                    {options?.actions && (
                      <Td
                        textAlign="center"
                        color="#898c90"
                        _hover={{
                          color: '#333',
                        }}
                      >
                        {options?.actions.items.map(
                          (action, index) =>
                            ((action.handleShowAction &&
                              !!action.handleShowAction(row)) ||
                              !action.handleShowAction) && (
                              <Button
                                bg="none"
                                type="button"
                                onClick={() => action.getRow(row)}
                                key={index}
                              >
                                <Tooltip
                                  hasArrow
                                  label={action.tooltip}
                                  placement="left"
                                >
                                  <span>{action.icon}</span>
                                </Tooltip>
                              </Button>
                            ),
                        )}
                      </Td>
                    )}
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>

        <BoxPagination />
      </Flex>
    </>
  );
};

RemoteSourceDataTable.defaultProps = {
  columns: [],
  options: {
    actions: [] as any,
    filters: [],
    serverData: undefined as any,
  },
};

export default RemoteSourceDataTable;
