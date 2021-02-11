export class TestHelperData {
    static randomInt = () => {
        const maxRandomInt = 100

        return Math.floor(Math.random() * maxRandomInt)
    }
}
