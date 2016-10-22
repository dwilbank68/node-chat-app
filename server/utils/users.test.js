var expect = require("expect");

var {Users} = require('./users');

describe('Users', () => {

    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [
            {id: '1', name:'Tom', room:'A'},
            {id: '2', name:'Dick', room:'B'},
            {id: '3', name:'Harry', room:'A'}
        ]
    })

    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: 'asdf',
            name: 'Taco Tom',
            room: 'Cat Eaters'
        }
        var resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it('should return names for A', () => {
        expect(users.getUserList('A')).toEqual(['Tom', 'Harry']);
    });

    it('should return names for B', () => {
        expect(users.getUserList('B')).toEqual(['Dick']);
    });

    it('should remove a user', () => {
        var userId = '2';
        var user = users.removeUser(userId);
        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2)
    });

    it('should not remove user', () => {
        var userId = '22';
        var user = users.removeUser(userId);
        expect(user).toNotExist();
        expect(users.users.length).toBe(3)
    });

    it('should find user', () => {
        expect(users.getUser('3')).toEqual({id: '3', name:'Harry', room:'A'})
    });

    it('should not find user', () => {
        expect(users.getUser('33')).toNotExist();
    });

});

