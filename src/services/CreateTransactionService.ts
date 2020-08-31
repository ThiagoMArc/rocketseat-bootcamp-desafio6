import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import { getRepository, getCustomRepository } from 'typeorm'
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {

    const transactionsRepository = getCustomRepository(TransactionRepository);

    const balance = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > balance.total)
      throw new AppError("Não é possível retirar valor superior ao total disponível na conta")

    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    let categoryDatabase = await categoryRepository.findOne({
      where: {
        title: category
      }
    });

    if (!categoryDatabase) {
      const newCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(newCategory);
      categoryDatabase = newCategory;
    }

    const newTransaction = transactionRepository.create({ title, value, type, category_id: categoryDatabase?.id });

    await transactionRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
