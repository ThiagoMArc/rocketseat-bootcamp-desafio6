import Transaction from '../models/Transaction';
import { getRepository } from 'typeorm';
import ImportFileService from '../services/ImportFileService';

interface Request {
  transactionFile: string;
}

class ImportTransactionsService {
  async execute({ transactionFile }: Request): Promise<Transaction[]> {

    const importFileService = new ImportFileService();
    const transactionRepository = getRepository(Transaction);

    const transactionData = await importFileService.loadCSV(transactionFile);

    transactionData.forEach(transactionArr => {
      const [title, type, value, category] = transactionArr;
      
    });


    return [];
  }

}

export default ImportTransactionsService;
