const { validatePassword } = require('../../../auth/validator.js')

describe('ensure that passwords are being validated properly', () => {
    let lowerThan8 = '1234567'
    let exactly8 = '12345678'
    let greaterThan20 = '1234567890123456789012345'
    let exactly20 = '12345678901234567890'
    let middleLength = 'alsdfkjlaksfj'
    let mixed = 'j23j4134jk'
    let nonAlphaN = '!sdk#$@'
    let spaces = '      '

    test('reject if not minlength of 8', () => {
        expect(validatePassword(lowerThan8)).toBeFalsy()
    })

    test('accept if minlength of 8', () => {
        expect(validatePassword(exactly8)).toBeTruthy()
    })

    test('reject greater than 20', () => {
        expect(validatePassword(greaterThan20)).toBeFalsy()
    })

    test('accept if is length 20 or less', () => {
        expect(validatePassword(exactly20)).toBeTruthy()
    })

    test('a length which fits', () => {
        expect(validatePassword(middleLength)).toBeTruthy()
    })

    test('accepts both numbers and alphabet', () => {
        expect(validatePassword(mixed)).toBeTruthy()
    })

    test('reject non alphanumeric', () => {
        expect(validatePassword(nonAlphaN)).toBeFalsy()
        expect(validatePassword(spaces)).toBeFalsy()
    })
})