import { useState } from 'react';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { SiMicrosoftexcel } from 'react-icons/si';
import { Button } from '@chakra-ui/button';
import { HStack } from '@chakra-ui/layout';
import { Tooltip } from '@chakra-ui/tooltip';
import { useToast } from '@chakra-ui/toast';
import PulseLoader from 'react-spinners/PulseLoader';
import { apiGarage as api } from '../../../services/apiGarage';

// const PrivateLayout = dynamic(() => import("xlsx").then(module => module.utils));

interface IProps {
  fileName: string;
  columns: {
    field: string;
    title: string;
  }[];
  csvData?: any;
  async?: boolean;
  serverPagination?: boolean;
  url?: string;
}
const ExportCSV: React.FC<IProps> = ({
  csvData,
  fileName,
  columns,
  async = false,
  url,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const renameColumn = (ws: any): void => {
    const range = XLSX.utils.decode_range(ws['!ref']);
    const titles = columns.map((column) => column.title);
    for (let C = range.s.r; C <= range.e.r; ++C) {
      const address = `${XLSX.utils.encode_col(C)}1`; // <-- first row, column number C

      // eslint-disable-next-line
      if (!ws[address]) continue;
      // eslint-disable-next-line
      ws[address].v = titles[C].toUpperCase();
    }
  };

  const exportToCSV = (dataCsv: any, filename: string): void => {
    const ws = XLSX.utils.json_to_sheet(dataCsv);
    renameColumn(ws);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, filename + fileExtension);
  };

  const requestData = async (): Promise<void> => {
    if (async) {
      setLoading(true);
      try {
        const response = await api.get(url || '');
        // const data = serverPagination ? response.data.items : response.data;
        const {
          data: { items },
        } = response;

        const fields = columns.map((column) => column.field);
        const dataFormated = items.map((d: any) => {
          const entries = fields.map((field) => {
            return [field, d[field]];
          });

          const newObject = Object.fromEntries(entries);

          return newObject;
        });
        exportToCSV(dataFormated, fileName);
        toast({
          title: 'Sucesso!',
          description: 'Arquivo baixado com sucesso!',
          status: 'success',
          duration: 15000,
          isClosable: true,
          position: 'top-right',
        });
      } catch (error) {
        console.log(error);

        toast({
          title: 'Erro!',
          description: 'Ocorreu um erro ao baixar o arquivo!',
          status: 'error',
          duration: 15000,
          isClosable: true,
          position: 'top-right',
        });
      }
      setLoading(false);
    } else {
      exportToCSV(csvData, fileName);
    }
  };

  return (
    <HStack>
      {loading && (
        <PulseLoader size={8} margin={3} color="#1a8d4c" loading={loading} />
      )}
      <Tooltip hasArrow label="Baixar" placement="top" ml={2}>
        <Button
          colorScheme="green"
          rightIcon={<SiMicrosoftexcel size={22} />}
          onClick={() => requestData()}
          size="sm"
        >
          {loading ? 'Carregando...' : 'Baixar planilha'}
        </Button>
      </Tooltip>
    </HStack>
  );
};

export default ExportCSV;
