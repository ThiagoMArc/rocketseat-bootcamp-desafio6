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

    return transactionData;
  }

}

export default ImportTransactionsService;
