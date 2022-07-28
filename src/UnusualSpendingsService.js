export class UnusualSpendingsService {

    constructor(unusualSpendingsDetector, alertSender) {
        this.unusualSpendingsDetector=unusualSpendingsDetector
        this.alertSender=alertSender
    }

    run(userId) {
        let paymentsExceeded = this.unusualSpendingsDetector.run(userId)

        if(paymentsExceeded.length === 0) {
            return
        }

        this.alertSender.run(userId, paymentsExceeded)
    }
}
