import { Router } from 'express';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfig from '../config/upload';
import multer from 'multer';
import Transaction from '../models/Transaction';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = new TransactionsRepository();
  const transactions = await transactionsRepository.all();
  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance })

});

transactionsRouter.post('/', async (request, response) => {

  const { title, value, type, category } = request.body;
  const transactionService = new CreateTransactionService();

  const newTransaction = await transactionService.execute({ title, value, type, category });
  return response.json(newTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute({ id });

  return response.status(204).send();
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const transationsImportService = new ImportTransactionsService();

  const transaction = await transationsImportService.execute({
    transactionFile: request.file.filename
  });

  return response.json(transaction);
});

export default transactionsRouter;
