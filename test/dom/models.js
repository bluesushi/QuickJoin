const { Meeting, MeetingManager } = require('../../web/dashboard/models')

test('create a meeting and test accessors', () => {
    let mng = new MeetingManager()
    let first = new Meeting('youtube', '12:34', 'name goes here')
    let second = new Meeting('', '', '')

    mng.add(first)
    mng.add(second)

    expect(first.id).toBe(1)
    expect(second.id).toBe(2)

    let m = new Meeting('', '', '')
    m.id = 453
    expect(m.id).toBe(453)

    m.name = 'a random name'
    expect(m.name).toBe('a random name')
})

test('make sure meeting manager works properly', () => {
    let mng = new MeetingManager()
    let sample = { url: '', time: '', name: ''}

    expect(typeof mng.meetings).toBe('object')

    let arr = [1, 2, 3, 4, 5]
    mng.meetings = [ ...arr ]
    expect(mng.meetings).toEqual(arr)

    mng.meetings = []
    mng.add(new Meeting(sample))
    expect(mng.arrSize()).toEqual(1)
})

test('meeting can be constructed with spread operator', () => {
    let classLink = {
        url: 'a url',
        time: '12:42',
        name: 'link name'
    }

    let meeting = new Meeting({ ...classLink })
    expect(meeting).toEqual(expect.objectContaining({
        ...classLink
    }))
})