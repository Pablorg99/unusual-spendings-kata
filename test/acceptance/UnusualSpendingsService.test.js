import { UnusualSpendingsDetector } from '../../src/UnusualSpendingsDetector';
import { AlertSender } from '../../src/AlertSender';
import { UnusualSpendingsService } from '../../src/UnusualSpendingsService';

describe('UnusualSpendingsService acceptance', () => {
    test('alerting users with unusual spendings in some categories', () => {
        const paymentsRepository = {find: () => [
            {amount: 100, category: 'food', month: '2020-01'},
            {amount: 200, category: 'food', month: '2020-02'}
        ]};
        const calendar = {getCurrentMonth: () => '2020-02'};
        const notifier = {notify: jest.fn()};
        const usersRepository = {find: () => [{email: 'user@mail.com'}]};
        const unusualSpendingsDetector = new UnusualSpendingsDetector(paymentsRepository, calendar);
        const alertSender = new AlertSender(usersRepository, notifier);
        const unusualSpendingsService = new UnusualSpendingsService(unusualSpendingsDetector, alertSender);
        const userId = '1234'

        unusualSpendingsService.run(userId)

        const expectedNotification = `Hello card user!

        We have detected unusually high spending on your card in these categories:

        * You spent $200 on food

        Love,

        The Credit Card Company`;

        expect(notifier.notify).toHaveBeenCalledWith(expectedNotification)
    });
});
