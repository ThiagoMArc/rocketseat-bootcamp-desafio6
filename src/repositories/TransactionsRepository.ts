import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionRepository = getRepository(Transaction);

    const income = await transactionRepository.find({
      where: {
        type: 'income'
      }
    }).then((tr) => {
      return tr.map(t => Number(t.value)).reduce((initial, curr) => initial + curr, 0)
    });

    const outcome = await transactionRepository.find({
      where: {
        type: 'outcome'
      }
    }).then((tr) => {
      return tr.map(t => Number(t.value)).reduce((initial, curr) => initial + curr, 0)
    });

    return { outcome, income, total: income - outcome };
  }

  public async all(): Promise<Transaction[]> {
    const transactionRepository = getRepository(Transaction);
    return await transactionRepository.find();
  }

}

export default TransactionsRepository;
